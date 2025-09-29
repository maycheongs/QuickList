import { gql } from 'graphql-tag'

export const typeDefs = gql`
scalar ID

type Query {
    users: [User!]!
    user(id: ID!): User
    lists: [List!]!
    list(id: ID!): List
    items(listId: ID!): [Item!]!
    categories(listId: ID!): [Category!]!
  }

type DeleteItemResult {
  item: Item!
  deletedCategory: Category
}

type UpdateItemPayload {
  item: Item!
  deletedCategory: Category
}

type Mutation {
    createUser(name: String!, email: String!): User!
    createList(name: String!, type: ListType!, userId: ID!): List!
    updateList(listId: ID!, name: String, dueDate: String): List!
    deleteList(listId:ID!): List!
    addItemToList(listId: ID!, name: String!, lastMinute: Boolean, isTask: Boolean, categoryId: ID, assignedToId: ID, reminderAt: String, recurrence: String, recurrenceEnd: String): Item!
    updateItem(ItemId: ID!, checked: Boolean, name: String, lastMinute: Boolean, isTask: Boolean, categoryId: ID, assignedToId: ID, reminderAt: String, recurrence: String, recurrenceEnd: String ): UpdateItemPayload!
    deleteItem(itemId: ID!): DeleteItemResult!
    addUser(listId: ID!, userId: ID!): List!
    duplicateList(listId: ID!): List!
    toggleReminders(listId: ID!, remindersOn: Boolean): List!
    createCategory(listId: ID!, name: String!): Category!
    updateCategory(categoryId: ID!, name: String!): Category!
}

type User {
    id: ID!
    name: String!
    email: String!
    lists: [List!]!
    assignedItems: [Item!]!
  }

type List {
    id: ID!
    name: String!
    type: ListType
    items: [Item!]!
    categories: [Category!]!
    users: [User!]!
    createdAt: String!
    dueDate: String
    remindersOn: Boolean
  }

 type Item {
    id: ID!
    name: String!
    lastMinute: Boolean!
    checked: Boolean!
    list: List!
    category: Category
    assignedTo: User
    isTask: Boolean
    reminderAt: String
    recurrence: String
    recurrenceEnd: String
    createdAt: String!
  } 

 type Category {
    id: ID!
    name: String!
    list: List!
    items: [Item!]!
  }

  enum ListType {
    TASK
    PACKING
  } 


`