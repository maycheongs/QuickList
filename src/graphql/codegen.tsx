import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  items: Array<Item>;
  list: List;
  name: Scalars['String']['output'];
};

export type DeleteItemResult = {
  __typename?: 'DeleteItemResult';
  deletedCategory?: Maybe<Category>;
  item: Item;
};

export type Item = {
  __typename?: 'Item';
  assignedTo?: Maybe<User>;
  category?: Maybe<Category>;
  checked: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isTask?: Maybe<Scalars['Boolean']['output']>;
  lastMinute: Scalars['Boolean']['output'];
  list: List;
  name: Scalars['String']['output'];
  recurrence?: Maybe<Scalars['String']['output']>;
  recurrenceEnd?: Maybe<Scalars['String']['output']>;
  reminderAt?: Maybe<Scalars['String']['output']>;
};

export type List = {
  __typename?: 'List';
  categories: Array<Category>;
  createdAt: Scalars['String']['output'];
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<Item>;
  name: Scalars['String']['output'];
  remindersOn?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<ListType>;
  users: Array<User>;
};

export enum ListType {
  Packing = 'PACKING',
  Task = 'TASK'
}

export type Mutation = {
  __typename?: 'Mutation';
  addItemToList: Item;
  addUser: List;
  createCategory: Category;
  createList: List;
  createUser: User;
  deleteItem: DeleteItemResult;
  deleteList: List;
  duplicateList: List;
  toggleReminders: List;
  updateCategory: Category;
  updateItem: UpdateItemPayload;
  updateList: List;
};


export type MutationAddItemToListArgs = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  isTask?: InputMaybe<Scalars['Boolean']['input']>;
  lastMinute?: InputMaybe<Scalars['Boolean']['input']>;
  listId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  recurrence?: InputMaybe<Scalars['String']['input']>;
  recurrenceEnd?: InputMaybe<Scalars['String']['input']>;
  reminderAt?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddUserArgs = {
  listId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  listId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateListArgs = {
  name: Scalars['String']['input'];
  type: ListType;
  userId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteItemArgs = {
  itemId: Scalars['ID']['input'];
};


export type MutationDeleteListArgs = {
  listId: Scalars['ID']['input'];
};


export type MutationDuplicateListArgs = {
  listId: Scalars['ID']['input'];
};


export type MutationToggleRemindersArgs = {
  listId: Scalars['ID']['input'];
  remindersOn?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateItemArgs = {
  ItemId: Scalars['ID']['input'];
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  checked?: InputMaybe<Scalars['Boolean']['input']>;
  isTask?: InputMaybe<Scalars['Boolean']['input']>;
  lastMinute?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Scalars['String']['input']>;
  recurrenceEnd?: InputMaybe<Scalars['String']['input']>;
  reminderAt?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateListArgs = {
  dueDate?: InputMaybe<Scalars['String']['input']>;
  listId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  items: Array<Item>;
  list?: Maybe<List>;
  lists: Array<List>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCategoriesArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateItemPayload = {
  __typename?: 'UpdateItemPayload';
  deletedCategory?: Maybe<Category>;
  item: Item;
};

export type User = {
  __typename?: 'User';
  assignedItems: Array<Item>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lists: Array<List>;
  name: Scalars['String']['output'];
};

export type CreateListMutationVariables = Exact<{
  name: Scalars['String']['input'];
  type: ListType;
  userId: Scalars['ID']['input'];
}>;


export type CreateListMutation = { __typename?: 'Mutation', createList: { __typename?: 'List', id: string, name: string, type?: ListType | null, createdAt: string, dueDate?: string | null, remindersOn?: boolean | null, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> } };

export type DeleteListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type DeleteListMutation = { __typename?: 'Mutation', deleteList: { __typename?: 'List', id: string } };

export type UpdateListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateListMutation = { __typename?: 'Mutation', updateList: { __typename?: 'List', id: string, name: string, dueDate?: string | null, remindersOn?: boolean | null } };

export type AddItemToListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  lastMinute?: InputMaybe<Scalars['Boolean']['input']>;
  isTask?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AddItemToListMutation = { __typename?: 'Mutation', addItemToList: { __typename?: 'Item', id: string, name: string, lastMinute: boolean, checked: boolean, category?: { __typename?: 'Category', id: string, name: string } | null } };

export type ToggleRemindersMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  remindersOn: Scalars['Boolean']['input'];
}>;


export type ToggleRemindersMutation = { __typename?: 'Mutation', toggleReminders: { __typename?: 'List', id: string, name: string, remindersOn?: boolean | null } };

export type DuplicateListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type DuplicateListMutation = { __typename?: 'Mutation', duplicateList: { __typename?: 'List', id: string, name: string, categories: Array<{ __typename?: 'Category', id: string, name: string }> } };

export type CreateCategoryMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string, name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string } };

export type UpdateItemMutationVariables = Exact<{
  itemId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  checked?: InputMaybe<Scalars['Boolean']['input']>;
  lastMinute?: InputMaybe<Scalars['Boolean']['input']>;
  isTask?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', updateItem: { __typename?: 'UpdateItemPayload', item: { __typename?: 'Item', id: string, name: string, checked: boolean, lastMinute: boolean, isTask?: boolean | null, category?: { __typename?: 'Category', id: string, name: string } | null, assignedTo?: { __typename?: 'User', id: string, name: string } | null }, deletedCategory?: { __typename?: 'Category', id: string, name: string } | null } };

export type DeleteItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem: { __typename?: 'DeleteItemResult', item: { __typename?: 'Item', id: string, name: string, category?: { __typename?: 'Category', id: string, name: string } | null }, deletedCategory?: { __typename?: 'Category', id: string, name: string } | null } };

export type ListsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListsQuery = { __typename?: 'Query', lists: Array<{ __typename?: 'List', id: string, name: string }> };

export type ListsByUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type ListsByUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string, lists: Array<{ __typename?: 'List', id: string, name: string, dueDate?: string | null, remindersOn?: boolean | null, createdAt: string, categories: Array<{ __typename?: 'Category', id: string, name: string }>, items: Array<{ __typename?: 'Item', id: string, name: string, checked: boolean, lastMinute: boolean, createdAt: string, assignedTo?: { __typename?: 'User', id: string, name: string, email: string } | null, category?: { __typename?: 'Category', id: string, name: string } | null }>, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> }> } | null };

export type GetListQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetListQuery = { __typename?: 'Query', list?: { __typename?: 'List', id: string, name: string, dueDate?: string | null, remindersOn?: boolean | null, categories: Array<{ __typename?: 'Category', id: string, name: string }>, items: Array<{ __typename?: 'Item', id: string, name: string, checked: boolean, lastMinute: boolean, assignedTo?: { __typename?: 'User', id: string, email: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string } | null }>, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> } | null };


export const CreateListDocument = gql`
    mutation CreateList($name: String!, $type: ListType!, $userId: ID!) {
  createList(name: $name, type: $type, userId: $userId) {
    id
    name
    type
    users {
      id
      name
      email
    }
    createdAt
    dueDate
    remindersOn
  }
}
    `;
export type CreateListMutationFn = Apollo.MutationFunction<CreateListMutation, CreateListMutationVariables>;
export function useCreateListMutation(baseOptions?: Apollo.MutationHookOptions<CreateListMutation, CreateListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateListMutation, CreateListMutationVariables>(CreateListDocument, options);
      }
export type CreateListMutationHookResult = ReturnType<typeof useCreateListMutation>;
export type CreateListMutationResult = Apollo.MutationResult<CreateListMutation>;
export type CreateListMutationOptions = Apollo.BaseMutationOptions<CreateListMutation, CreateListMutationVariables>;
export const DeleteListDocument = gql`
    mutation DeleteList($listId: ID!) {
  deleteList(listId: $listId) {
    id
  }
}
    `;
export type DeleteListMutationFn = Apollo.MutationFunction<DeleteListMutation, DeleteListMutationVariables>;
export function useDeleteListMutation(baseOptions?: Apollo.MutationHookOptions<DeleteListMutation, DeleteListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteListMutation, DeleteListMutationVariables>(DeleteListDocument, options);
      }
export type DeleteListMutationHookResult = ReturnType<typeof useDeleteListMutation>;
export type DeleteListMutationResult = Apollo.MutationResult<DeleteListMutation>;
export type DeleteListMutationOptions = Apollo.BaseMutationOptions<DeleteListMutation, DeleteListMutationVariables>;
export const UpdateListDocument = gql`
    mutation UpdateList($listId: ID!, $name: String, $dueDate: String) {
  updateList(listId: $listId, name: $name, dueDate: $dueDate) {
    id
    name
    dueDate
    remindersOn
  }
}
    `;
export type UpdateListMutationFn = Apollo.MutationFunction<UpdateListMutation, UpdateListMutationVariables>;
export function useUpdateListMutation(baseOptions?: Apollo.MutationHookOptions<UpdateListMutation, UpdateListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateListMutation, UpdateListMutationVariables>(UpdateListDocument, options);
      }
export type UpdateListMutationHookResult = ReturnType<typeof useUpdateListMutation>;
export type UpdateListMutationResult = Apollo.MutationResult<UpdateListMutation>;
export type UpdateListMutationOptions = Apollo.BaseMutationOptions<UpdateListMutation, UpdateListMutationVariables>;
export const AddItemToListDocument = gql`
    mutation AddItemToList($listId: ID!, $name: String!, $lastMinute: Boolean, $isTask: Boolean, $categoryId: ID) {
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
export type AddItemToListMutationFn = Apollo.MutationFunction<AddItemToListMutation, AddItemToListMutationVariables>;
export function useAddItemToListMutation(baseOptions?: Apollo.MutationHookOptions<AddItemToListMutation, AddItemToListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddItemToListMutation, AddItemToListMutationVariables>(AddItemToListDocument, options);
      }
export type AddItemToListMutationHookResult = ReturnType<typeof useAddItemToListMutation>;
export type AddItemToListMutationResult = Apollo.MutationResult<AddItemToListMutation>;
export type AddItemToListMutationOptions = Apollo.BaseMutationOptions<AddItemToListMutation, AddItemToListMutationVariables>;
export const ToggleRemindersDocument = gql`
    mutation ToggleReminders($listId: ID!, $remindersOn: Boolean!) {
  toggleReminders(listId: $listId, remindersOn: $remindersOn) {
    id
    name
    remindersOn
  }
}
    `;
export type ToggleRemindersMutationFn = Apollo.MutationFunction<ToggleRemindersMutation, ToggleRemindersMutationVariables>;
export function useToggleRemindersMutation(baseOptions?: Apollo.MutationHookOptions<ToggleRemindersMutation, ToggleRemindersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleRemindersMutation, ToggleRemindersMutationVariables>(ToggleRemindersDocument, options);
      }
export type ToggleRemindersMutationHookResult = ReturnType<typeof useToggleRemindersMutation>;
export type ToggleRemindersMutationResult = Apollo.MutationResult<ToggleRemindersMutation>;
export type ToggleRemindersMutationOptions = Apollo.BaseMutationOptions<ToggleRemindersMutation, ToggleRemindersMutationVariables>;
export const DuplicateListDocument = gql`
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
export type DuplicateListMutationFn = Apollo.MutationFunction<DuplicateListMutation, DuplicateListMutationVariables>;
export function useDuplicateListMutation(baseOptions?: Apollo.MutationHookOptions<DuplicateListMutation, DuplicateListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicateListMutation, DuplicateListMutationVariables>(DuplicateListDocument, options);
      }
export type DuplicateListMutationHookResult = ReturnType<typeof useDuplicateListMutation>;
export type DuplicateListMutationResult = Apollo.MutationResult<DuplicateListMutation>;
export type DuplicateListMutationOptions = Apollo.BaseMutationOptions<DuplicateListMutation, DuplicateListMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($listId: ID!, $name: String!) {
  createCategory(listId: $listId, name: $name) {
    id
    name
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($categoryId: ID!, $name: String!) {
  updateCategory(categoryId: $categoryId, name: $name) {
    id
    name
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const UpdateItemDocument = gql`
    mutation UpdateItem($itemId: ID!, $name: String, $checked: Boolean, $lastMinute: Boolean, $isTask: Boolean, $categoryId: ID, $assignedToId: ID) {
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
export type UpdateItemMutationFn = Apollo.MutationFunction<UpdateItemMutation, UpdateItemMutationVariables>;
export function useUpdateItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemMutation, UpdateItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemMutation, UpdateItemMutationVariables>(UpdateItemDocument, options);
      }
export type UpdateItemMutationHookResult = ReturnType<typeof useUpdateItemMutation>;
export type UpdateItemMutationResult = Apollo.MutationResult<UpdateItemMutation>;
export type UpdateItemMutationOptions = Apollo.BaseMutationOptions<UpdateItemMutation, UpdateItemMutationVariables>;
export const DeleteItemDocument = gql`
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
export type DeleteItemMutationFn = Apollo.MutationFunction<DeleteItemMutation, DeleteItemMutationVariables>;
export function useDeleteItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteItemMutation, DeleteItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteItemMutation, DeleteItemMutationVariables>(DeleteItemDocument, options);
      }
export type DeleteItemMutationHookResult = ReturnType<typeof useDeleteItemMutation>;
export type DeleteItemMutationResult = Apollo.MutationResult<DeleteItemMutation>;
export type DeleteItemMutationOptions = Apollo.BaseMutationOptions<DeleteItemMutation, DeleteItemMutationVariables>;
export const ListsDocument = gql`
    query Lists {
  lists {
    id
    name
  }
}
    `;
export function useListsQuery(baseOptions?: Apollo.QueryHookOptions<ListsQuery, ListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListsQuery, ListsQueryVariables>(ListsDocument, options);
      }
export function useListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListsQuery, ListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListsQuery, ListsQueryVariables>(ListsDocument, options);
        }
export function useListsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListsQuery, ListsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListsQuery, ListsQueryVariables>(ListsDocument, options);
        }
export type ListsQueryHookResult = ReturnType<typeof useListsQuery>;
export type ListsLazyQueryHookResult = ReturnType<typeof useListsLazyQuery>;
export type ListsSuspenseQueryHookResult = ReturnType<typeof useListsSuspenseQuery>;
export type ListsQueryResult = Apollo.QueryResult<ListsQuery, ListsQueryVariables>;
export const ListsByUserDocument = gql`
    query ListsByUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    lists {
      id
      name
      dueDate
      remindersOn
      createdAt
      categories {
        id
        name
      }
      items {
        id
        name
        checked
        lastMinute
        createdAt
        assignedTo {
          id
          name
          email
        }
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
}
    `;
export function useListsByUserQuery(baseOptions: Apollo.QueryHookOptions<ListsByUserQuery, ListsByUserQueryVariables> & ({ variables: ListsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListsByUserQuery, ListsByUserQueryVariables>(ListsByUserDocument, options);
      }
export function useListsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListsByUserQuery, ListsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListsByUserQuery, ListsByUserQueryVariables>(ListsByUserDocument, options);
        }
export function useListsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListsByUserQuery, ListsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListsByUserQuery, ListsByUserQueryVariables>(ListsByUserDocument, options);
        }
export type ListsByUserQueryHookResult = ReturnType<typeof useListsByUserQuery>;
export type ListsByUserLazyQueryHookResult = ReturnType<typeof useListsByUserLazyQuery>;
export type ListsByUserSuspenseQueryHookResult = ReturnType<typeof useListsByUserSuspenseQuery>;
export type ListsByUserQueryResult = Apollo.QueryResult<ListsByUserQuery, ListsByUserQueryVariables>;
export const GetListDocument = gql`
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
      assignedTo {
        id
        email
        name
      }
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
export function useGetListQuery(baseOptions: Apollo.QueryHookOptions<GetListQuery, GetListQueryVariables> & ({ variables: GetListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
      }
export function useGetListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
        }
export function useGetListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
        }
export type GetListQueryHookResult = ReturnType<typeof useGetListQuery>;
export type GetListLazyQueryHookResult = ReturnType<typeof useGetListLazyQuery>;
export type GetListSuspenseQueryHookResult = ReturnType<typeof useGetListSuspenseQuery>;
export type GetListQueryResult = Apollo.QueryResult<GetListQuery, GetListQueryVariables>;