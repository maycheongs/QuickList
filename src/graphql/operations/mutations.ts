import { gql } from '@apollo/client';

// Create a new list
export const CREATE_LIST = gql`
  mutation CreateList($name: String!, $type: ListType!, $userId: Int!) {
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
    $listId: Int!
    $name: String!
    $lastMinute: Boolean
    $isTask: Boolean
    $categoryId: Int
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
  mutation ToggleReminders($listId: Int!, $remindersOn: Boolean!) {
    toggleReminders(listId: $listId, remindersOn: $remindersOn) {
      id
      name
      remindersOn
    }
  }
`;

// Duplicate a list
export const DUPLICATE_LIST = gql`
  mutation DuplicateList($listId: Int!) {
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

// Optional: create category
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($listId: Int!, $name: String!) {
    createCategory(listId: $listId, name: $name,) {
      id
      name
    }
  }
`;


// Update item in a list
export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem(
    $itemId: Int!
    $name: String
    $checked: Boolean
    $lastMinute: Boolean
    $isTask: Boolean
    $categoryId: Int
    $assignedToId: Int
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
  }
`;