import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

    //USER SEEDS
    const alice = await prisma.user.create({
        data: { name: "Alice", email: "alice@example.com" },
    });

    const bob = await prisma.user.create({
        data: { name: "Bob", email: "bob@builder.com" },
    });

    //LIST SEEDS

    const list = await prisma.list.create({
        data: { name: "Packing for Trip", type: "PACKING", users: { connect: { id: alice.id } } },
    });
    await prisma.item.createMany({
        data: [
            { name: "Toothbrush", listId: list.id, isTask: false },
            { name: "Passport", listId: list.id, isTask: false },
        ],
    });


    const list2 = await prisma.list.create({
        data: { name: "Grocery List", type: "TASK", users: { connect: { id: alice.id } } },
    });
    await prisma.item.createMany({
        data: [
            { name: "Milk", listId: list2.id, isTask: false },
            { name: "Eggs", listId: list2.id, isTask: false },
            { name: "Bread", listId: list2.id, isTask: false },
        ],
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
