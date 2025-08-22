import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getPrismaClient } from "@/lib/prisma";
import { typeDefs } from "./typeDefs";
import { NextRequest } from "next/server";

const prisma = getPrismaClient();

export const resolvers = {
    Query: {
        users: async () => {
            return prisma.user.findMany({
                include: { lists: true, assignedItems: true },
            });
        },

        user: async (_: any, args: { id: number }) => {
            return prisma.user.findUnique({
                where: { id: args.id },
                include: { lists: true, assignedItems: true },
            });
        },

        lists: async () => {
            return prisma.list.findMany({
                include: { items: true, categories: true, users: true },
            });
        },

        list: async (_: any, args: { id: number }) => {
            return prisma.list.findUnique({
                where: { id: args.id },
                include: { items: true, categories: true, users: true },
            });
        },

        items: async (_: any, args: { listId: number }) => {
            return prisma.item.findMany({
                where: { listId: args.listId },
                include: { category: true, assignedTo: true, list: true },
            });
        },

        categories: async (_: any, args: { listId: number }) => {
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
            args: {
                listId: number;
                name: string;
                lastMinute?: boolean;
                isTask?: boolean;
                categoryId?: number;
                assignedToId?: number;
            }
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
            args: {
                ItemId: number;
                checked?: boolean;
                name?: string;
                lastMinute?: boolean;
                isTask?: boolean;
                categoryId?: number;
                assignedToId?: number;
            }
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

        addUser: async (_: any, args: { listId: number; userId: number }) => {
            return prisma.list.update({
                where: { id: args.listId },
                data: { users: { connect: { id: args.userId } } },
                include: { users: true },
            });
        },

        duplicateList: async (_: any, args: { listId: number, userId: number }) => {
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
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req, prisma }),
});

export { handler as GET, handler as POST };
