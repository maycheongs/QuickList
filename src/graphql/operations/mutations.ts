//src/graphql/operations/mutations.ts
import { gql } from '@apollo/client';

// Create a new list
export const CREATE_LIST = gql`
  mutation CreateList($name: String!, $type: ListType!, $userId: ID!) {
    createList(name: $name, type: $type, userId: $userId) {
      id
      name
      type
    }
  }
`;

// Add item to a list
export const ADD_ITEM_TO_LIST = gql`
  mutation AddItemToList(
    $listId: ID!
    $name: String!
    $lastMinute: Boolean
    $isTask: Boolean
    $categoryId: ID
  ) {
    addItemToList(
      listId: $listId
      name: $name
      lastMinute: $lastMinute
      isTask: $isTask
      categoryId: $categoryId
    ) {
      id
      name
      lastMinute
      checked
      category {
        id
        name
      }
    }
  }
`;

// Toggle reminders for a list
export const TOGGLE_REMINDERS = gql`
  mutation ToggleReminders($listId: ID!, $remindersOn: Boolean!) {
    toggleReminders(listId: $listId, remindersOn: $remindersOn) {
      id
      name
      remindersOn
    }
  }
`;

// Duplicate a list
export const DUPLICATE_LIST = gql`
  mutation DuplicateList($listId: ID!) {
    duplicateList(listId: $listId) {
      id
      name
      categories {
        id
        name
      }
    }
  }
`;

// Create category
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($listId: ID!, $name: String!) {
    createCategory(listId: $listId, name: $name,) {
      id
      name
    }
  }
`;

// Update category name
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String!) {
    updateCategory(categoryId: $categoryId, name: $name) {
      id
      name
    }
  }
`;


// Update item in a list
export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem(
    $itemId: ID!
    $name: String
    $checked: Boolean
    $lastMinute: Boolean
    $isTask: Boolean
    $categoryId: ID
    $assignedToId: ID
  ) {
    updateItem(
      ItemId: $itemId
      name: $name
      checked: $checked
      lastMinute: $lastMinute
      isTask: $isTask
      categoryId: $categoryId
      assignedToId: $assignedToId
    ) {
      item {
        id
        name
        checked
        lastMinute
        isTask
        category {
          id
          name
        }
        assignedTo {
          id
          name
        }
      }
      deletedCategory {
        id
        name
      }
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(itemId: $id) {
      item {
        id
        name
        category { 
         id 
         name 
        }
      }
      deletedCategory {
        id
        name
      }
    }
  }
`;