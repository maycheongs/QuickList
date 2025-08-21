import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.create({
        data: { name: "Alice", email: "alice@example.com" },
    });

    const list = await prisma.list.create({
        data: { name: "Packing for Trip", type: "PACKING", users: { connect: { id: alice.id } } },
    });

    await prisma.item.createMany({
        data: [
            { name: "Toothbrush", listId: list.id, isTask: false },
            { name: "Passport", listId: list.id, isTask: false },
        ],
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
