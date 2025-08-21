import { gql } from 'graphql-tag'

export const typeDefs = gql`
type Query {
    users: [User!]!
    lists: [List!]!
    list(id: Int!): List
    items(listId: Int!): [Item!]!
  }

type Mutation {
createUser(name: String!, email: String!): User!
createList(name: String!, type: ListType!, userId: Int!): List!
addItemToList(listId: Int!, name: String!, lastMinute: Boolean, isTask: Boolean, categoryId: Int, assignedToId: Int, reminderAt: String, recurrence: String, recurrenceEnd: String): Item!
updateItem(ItemId: Int!, checked: Boolean, name: String!, lastMinute: Boolean, isTask: Boolean, categoryId: Int, assignedToId: Int, reminderAt: String, recurrence: String, recurrenceEnd: String ): Item!
addUser(listId: Int!, userId: Int!): List!
createCategory(listId: Int!, name: String!, color: String!): Category!
}

type User {
    id: Int!
    name: String!
    email: String!
    lists: [List!]!
    assignedItems: [Item!]!
  }

type List {
    id: Int!
    name: String!
    type: ListType!
    items: [Item!]!
    categories: [Category!]!
    users: [User!]!
    createdAt: String!
    dueDate: String
    remindersOn: Boolean!
  }

 type Item {
    id: Int!
    name: String!
    lastMinute: Boolean!
    checked: Boolean!
    list: List!
    category: Category
    assignedTo: User
    isTask: Boolean!
    reminderAt: String
    recurrence: String
    recurrenceEnd: String
  } 

 type Category {
    id: Int!
    name: String!
    color: String!
    list: List!
    items: [Item!]!
  }

  enum ListType {
    TASK
    PACKING
  } 


`