//src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { GraphQLDateTime } from 'graphql-scalars';
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getPrismaClient } from "@/lib/prisma";
import { typeDefs } from "./typeDefs";
import { NextRequest } from "next/server";
import { QueryUserArgs, QueryListArgs, MutationAddItemToListArgs, MutationUpdateItemArgs, MutationDeleteItemArgs, MutationUpdateCategoryArgs, MutationUpdateListArgs } from "@/graphql/codegen";

// Define resolver parent/context types
type ResolverParent = unknown;
// type ResolverContext = { req: NextRequest; prisma: ReturnType<typeof getPrismaClient> };


const prisma = getPrismaClient();

const resolvers = {
    DateTime: GraphQLDateTime,
    Query: {
        users: async () => {
            return prisma.user.findMany({
                include: { lists: true, assignedItems: true },
            });
        },

        user: async (_parent: ResolverParent, args: QueryUserArgs) => {
            return prisma.user.findUnique({
                where: { id: args.id },
                include: {
                    lists: {
                        orderBy: { createdAt: 'asc' },
                        include:
                        {
                            items: {
                                orderBy: { createdAt: 'desc' },
                                include:
                                    { category: true, assignedTo: true }
                            },
                            categories: true,
                            users: true
                        }
                    },
                    assignedItems: true
                },
            });
        },

        lists: async () => {
            return prisma.list.findMany({
                include: { items: true, categories: true, users: true },
            });
        },

        list: async (_parent: ResolverParent, args: QueryListArgs) => {
            return prisma.list.findUnique({
                where: { id: args.id },
                include: { items: { include: { category: true, assignedTo: true } }, categories: true, users: true },
            });
        },

        items: async (_parent: ResolverParent, args: { listId: QueryListArgs['id'] }) => {
            return prisma.item.findMany({
                where: { listId: args.listId },
                include: { category: true, assignedTo: true, list: true },
            });
        },

        categories: async (_parent: ResolverParent, args: { listId: QueryListArgs['id'] }) => {
            return prisma.category.findMany({
                where: { listId: args.listId },
                include: { items: true, list: true },
            });
        },
    },

    Mutation: {
        createUser: async (_parent: ResolverParent, args: { name: string; email: string }) => {
            return prisma.user.create({
                data: { name: args.name, email: args.email },
            });
        },

        createList: async (_parent: ResolverParent, args: { name: string; type: 'TASK' | 'PACKING'; userId: QueryUserArgs['id'] }) => {

            return prisma.list.create({
                data: {
                    name: args.name,
                    type: args.type,
                    users: { connect: { id: args.userId } },
                },
                include: { users: true, items: { include: { category: true, assignedTo: true } }, categories: true },
            });
        },

        updateList: async (_parent: ResolverParent, args: MutationUpdateListArgs) => {
            const updateData = Object.fromEntries(Object.entries(args).filter(([key, value]) => value !== undefined && key !== 'listId' && key !== 'users'))
            return prisma.list.update({
                where: { id: args.listId },
                data: updateData,
            });
        },

        addItemToList: async (
            _parent: ResolverParent,
            args: MutationAddItemToListArgs
        ) => {
            return prisma.item.create({
                data: {
                    name: args.name,
                    lastMinute: args.lastMinute ?? false,
                    isTask: args.isTask ?? false,
                    list: { connect: { id: args.listId } },
                    category: args.categoryId ? { connect: { id: args.categoryId } } : undefined,
                    assignedTo: args.assignedToId ? { connect: { id: args.assignedToId } } : undefined,
                },
            });
        },
        updateItem: async (_parent: ResolverParent, args: MutationUpdateItemArgs) => {
            const { ItemId, ...rest } = args;

            const updateData = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value !== undefined))
            let deletedCategory: { id: string; name: string; listId: string } | null = null

            // If categoryId is not being updated, just update the item and return
            if (!('categoryId' in updateData)) {
                const updated = await prisma.item.update({
                    where: { id: ItemId },
                    data: updateData,
                    include: { category: true, assignedTo: true }
                });
                return { item: updated, deletedCategory }
            }

            // If categoryId is being updated, handle category deletion logic in a transaction
            return prisma.$transaction(async (tx) => {
                // Get current category of the item
                const currentItem = await tx.item.findUnique({
                    where: { id: ItemId },
                    select: { category: true },
                });

                const previousCategoryId = currentItem?.category?.id;

                // Update the item
                const updatedItem = await tx.item.update({
                    where: { id: ItemId },
                    data: updateData,
                    include: { category: true, assignedTo: true }
                });



                // If previous category exists and is different from the new category
                if (
                    previousCategoryId &&
                    updateData.categoryId !== previousCategoryId
                ) {
                    const { count } = await tx.category.deleteMany({
                        where: {
                            id: previousCategoryId,
                            items: { none: {} },     //delete the category only if it has no items
                        },
                    });
                    if (count > 0) deletedCategory = currentItem.category
                }
                // console.log('updated item', updatedItem, 'deletedCat', deletedCategory)

                return { item: updatedItem, deletedCategory };
            });
        }
        ,


        deleteItem: async (_parent: ResolverParent, args: MutationDeleteItemArgs) => {
            // Fetch the item first, including its category
            const item = await prisma.item.findUnique({
                where: { id: args.itemId },
                include: { category: true },
            });

            if (!item) throw new Error("Item not found");

            const categoryId = item.category?.id;

            // Delete the item
            await prisma.item.delete({ where: { id: args.itemId } });


            // If the item had a category, check if category is now empty
            let deletedCategory = null;
            if (item.category?.id) {
                const remainingItems = await prisma.item.count({
                    where: { categoryId },
                });

                if (remainingItems === 0) {
                    // Delete the empty category
                    deletedCategory = await prisma.category.delete({ where: { id: categoryId } });
                }
            }

            return { item, deletedCategory };
        },

        addUser: async (_parent: ResolverParent, args: { listId: QueryListArgs['id']; userId: QueryUserArgs['id'] }) => {
            return prisma.list.update({
                where: { id: args.listId },
                data: { users: { connect: { id: args.userId } } },
                include: { users: true },
            });
        },

        duplicateList: async (_parent: ResolverParent, args: { listId: QueryListArgs['id'], userId: QueryUserArgs['id'] }) => {
            const original = await prisma.list.findUnique({
                where: { id: args.listId },
                include: { categories: true, items: true },
            });
            if (!original) throw new Error('List not found');

            // Duplicate without per-instance data
            const duplicate = await prisma.list.create({
                data: {
                    name: original.name + ' (Copy)',
                    type: original.type,
                    users: {
                        connect: { id: args.userId },
                    },
                    categories: {
                        create: original.categories.map(
                            (c: { name: string }) => ({ name: c.name })
                        ),
                    },
                },
                include: { categories: true, users: true },
            });

            return duplicate;
        },


        toggleReminders: async (_parent: ResolverParent, args: { listId: QueryListArgs['id']; remindersOn: boolean }) => {
            return prisma.list.update({
                where: { id: args.listId },
                data: { remindersOn: args.remindersOn },
            });
        },

        createCategory: async (_parent: ResolverParent, args: { listId: QueryListArgs['id']; name: string }) => {
            return prisma.category.create({
                data: { name: args.name, list: { connect: { id: args.listId } } },
            });
        },

        updateCategory: async (_parent: ResolverParent, args: MutationUpdateCategoryArgs) => {
            return prisma.category.update({
                where: { id: args.categoryId },
                data: { name: args.name },
            });
        },

        deleteList: async (_parent: ResolverParent, args: { listId: QueryListArgs['id'] }) => {
            // Cascade delete items and categories
            await prisma.item.deleteMany({ where: { listId: args.listId } });
            await prisma.category.deleteMany({ where: { listId: args.listId } });

            return prisma.list.delete({ where: { id: args.listId } });
        },


    },
};

const server = new ApolloServer({ typeDefs, resolvers });

// create handler once
const graphqlHandler = startServerAndCreateNextHandler(server, {
    context: async (req) => ({ req, prisma }),
});

// Wrap for Next.js App Router
export async function GET(req: NextRequest) {
    return graphqlHandler(req);
}

export async function POST(req: NextRequest) {
    return graphqlHandler(req);
}

// const handler = startServerAndCreateNextHandler(server, {
//     context: async (req) => ({ req, prisma }),
// });

// export { handler as GET, handler as POST };
