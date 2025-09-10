//src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getPrismaClient } from "@/lib/prisma";
import { typeDefs } from "./typeDefs";
import { NextRequest } from "next/server";
import { QueryUserArgs, QueryListArgs, MutationAddItemToListArgs, MutationUpdateItemArgs, MutationDeleteItemArgs, MutationUpdateCategoryArgs } from "@/graphql/codegen";

const prisma = getPrismaClient();

export const resolvers = {
    Query: {
        users: async () => {
            return prisma.user.findMany({
                include: { lists: true, assignedItems: true },
            });
        },

        user: async (_: any, args: QueryUserArgs) => {
            return prisma.user.findUnique({
                where: { id: args.id },
                include: {
                    lists: {
                        include:
                        {
                            items: {
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

        list: async (_: any, args: { id: QueryListArgs }) => {
            return prisma.list.findUnique({
                where: { id: args.id },
                include: { items: { include: { category: true, assignedTo: true } }, categories: true, users: true },
            });
        },

        items: async (_: any, args: { listId: QueryListArgs['id'] }) => {
            return prisma.item.findMany({
                where: { listId: args.listId },
                include: { category: true, assignedTo: true, list: true },
            });
        },

        categories: async (_: any, args: { listId: QueryListArgs['id'] }) => {
            return prisma.category.findMany({
                where: { listId: args.listId },
                include: { items: true, list: true },
            });
        },
    },

    Mutation: {
        createUser: async (_: any, args: { name: string; email: string }) => {
            return prisma.user.create({
                data: { name: args.name, email: args.email },
            });
        },

        createList: async (_: any, args: { name: string; type: 'TASK' | 'PACKING'; userId: number }) => {
            return prisma.list.create({
                data: {
                    name: args.name,
                    type: args.type,
                    users: { connect: { id: args.userId } },
                },
            });
        },

        addItemToList: async (
            _: any,
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

        updateItem: async (
            _: any,
            args: MutationUpdateItemArgs
        ) => {
            return prisma.item.update({
                where: { id: args.ItemId },
                data: {
                    name: args.name,
                    checked: args.checked,
                    lastMinute: args.lastMinute,
                    isTask: args.isTask,
                    categoryId: args.categoryId,
                    assignedToId: args.assignedToId,
                },
            });
        },


        deleteItem: async (_: any, args: MutationDeleteItemArgs) => {
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

            return { ...item, deletedCategory };
        },

        addUser: async (_: any, args: { listId: QueryListArgs['id']; userId: QueryUserArgs['id'] }) => {
            return prisma.list.update({
                where: { id: args.listId },
                data: { users: { connect: { id: args.userId } } },
                include: { users: true },
            });
        },

        duplicateList: async (_: any, args: { listId: QueryListArgs['id'], userId: QueryUserArgs['id'] }) => {
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


        toggleReminders: async (_: any, args: { listId: number; remindersOn: boolean }) => {
            return prisma.list.update({
                where: { id: args.listId },
                data: { remindersOn: args.remindersOn },
            });
        },

        createCategory: async (_: any, args: { listId: number; name: string }) => {
            return prisma.category.create({
                data: { name: args.name, list: { connect: { id: args.listId } } },
            });
        },

        updateCategory: async (_: any, args: MutationUpdateCategoryArgs) => {
            return prisma.category.update({
                where: { id: args.categoryId },
                data: { name: args.name },
            });
        },

        deleteList: async (_: any, args: { listId: QueryListArgs['id'] }) => {
            // Cascade delete items and categories
            await prisma.item.deleteMany({ where: { listId: args.listId } });
            await prisma.category.deleteMany({ where: { listId: args.listId } });

            return prisma.list.delete({ where: { id: args.listId } });
        },


    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req, prisma }),
});

export { handler as GET, handler as POST };
