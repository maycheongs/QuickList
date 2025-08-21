import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getPrismaClient } from "@/lib/prisma";
import { typeDefs } from "./typeDefs";
import { NextRequest } from "next/server";

const prisma = getPrismaClient();

const resolvers = {
    Query: {
        users: () => prisma.user.findMany(),
        lists: () => prisma.list.findMany(),
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => ({ req, prisma }),
});

export { handler as GET, handler as POST };
