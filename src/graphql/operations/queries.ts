import { gql } from '@apollo/client';

// Get all lists (for side panel)
export const GET_LISTS = gql`
  query Lists {
    lists {
      id
      name
    }
  }
`;

// Get lists by user ID
export const GET_LISTS_BY_USER = gql`
  query ListsByUser($userId: ID!) {
    user(id: $userId) {
      id
      name
      lists {
        id
        name
      }
    }
  }
`;

// Get a single list by ID (for main panel)
export const GET_LIST_BY_ID = gql`
  query GetList($id: ID!) {
    list(id: $id) {
      id
      name
      dueDate
      remindersOn
      categories {
        id
        name
      }
      items {
        id
        name
        checked
        lastMinute
        category {
          id
          name
        }
      }
      users {
        id
        name
        email
      }
    }
  }
`;
