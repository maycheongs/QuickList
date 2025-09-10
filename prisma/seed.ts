import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

    //USER SEEDS
    const alice = await prisma.user.upsert({
        where: { id: "test-id" },
        update: {},
        create: { name: "Alice", email: "alice@example.com", id: "test-id" },
    });

    const bob = await prisma.user.create({
        data: { name: "Bob", email: "bob@builder.com" },
    });

    //LIST SEEDS

    //Packing list with no categories, item is lastMinute
    const list = await prisma.list.create({
        data: { name: "Packing for Trip", type: "PACKING", users: { connect: { id: alice.id } } },
    });
    await prisma.item.createMany({
        data: [
            { name: "Toothbrush", listId: list.id, isTask: false },
            { name: "Passport", listId: list.id, isTask: false },
            { name: "Sunglasses (last minute)", listId: list.id, isTask: false, lastMinute: true },
        ],
    });

    //Grocery list with 2 categories, one item is checked, one item is lastMinute, one item has no category
    const groceryList = await prisma.list.create({
        data: {
            name: "Grocery List", type: "PACKING", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            , users: { connect: [{ id: alice.id }, { id: bob.id }] }
        },
    });
    const dairyCategory = await prisma.category.create({
        data: { name: "Dairy", listId: groceryList.id },
    });

    const fruitsCategory = await prisma.category.create({
        data: { name: "Fruits", listId: groceryList.id },
    });
    await prisma.item.createMany({
        data: [
            { name: "Milk", listId: groceryList.id, categoryId: dairyCategory.id },
            { name: "Cheese", listId: groceryList.id, categoryId: dairyCategory.id, checked: true },
            { name: "Apples", listId: groceryList.id, categoryId: fruitsCategory.id },
            { name: "Berries", listId: groceryList.id, categoryId: fruitsCategory.id },
            { name: "Peaches", listId: groceryList.id, categoryId: fruitsCategory.id },
            { name: "Bananas (last minute)", listId: groceryList.id, lastMinute: true },
            { name: "Bread", listId: groceryList.id }, // no category
        ],
    });


}


main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
