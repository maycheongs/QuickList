import { ListsByUserQuery } from "@/graphql/codegen";

type GqlList = NonNullable<ListsByUserQuery['user']>['lists'][0]
export type OptimisticList = Partial<GqlList> & {
    id: GqlList['id'];  // always required
    items: GqlList['items']; // always required
    categories: GqlList['categories']; // always required
    dueDate?: GqlList['dueDate'];
    name: GqlList['name'];
    users: GqlList['users'];
    isNew?: true;
    synced?: boolean; // indicates if the optimistic update has been synced with the backend
};
export type List = GqlList | OptimisticList

export type ListItem = NonNullable<ListsByUserQuery['user']>['lists'][0]['items'][0] & { color?: string };

export type ListCategory = {
    id: string;
    name: string;
};

export type ListDataState = {
    id: List['id'];
    name: string;
    dueDate?: Date | null;
    items: ListItem[];
    categories: ListCategory[];
    isNew?: true;
    users: { id: string; name: string; email: string }[];
};

export type ListsMap = Record<string, ListDataState>;

export type AppState = {
    lists: ListsMap;
    selectedListId: List['id'] | null;
};

export type AppAction =
    | { type: 'SET_ALL_LISTS'; payload: ListsMap }
    | { type: 'SET_SELECTED_LIST'; payload: string | null }
    | { type: 'UPDATE_LIST'; payload: { listId: List['id']; changes: Partial<List> } }
    | { type: 'ADD_ITEM'; payload: { listId: List['id'] | string; item: ListItem } }
    | { type: "UPDATE_ITEM"; payload: { listId: List['id'], id: ListItem['id']; changes: Partial<ListItem> } }
    | { type: "DELETE_ITEM"; payload: { listId: List['id'], id: ListItem['id'] } }
    | { type: "ADD_CATEGORY"; payload: { listId: List['id'], category: ListCategory } }
    | { type: "UPDATE_CATEGORY"; payload: { listId: List['id'], id: ListCategory['id']; changes: Partial<ListCategory> } }
    | { type: "DELETE_CATEGORY"; payload: { listId: List['id'], id: ListCategory['id'] } }
    | { type: 'ADD_LIST'; payload: List }
    | { type: 'REPLACE_LIST'; payload: { tempId: List['id'], newList: List } }
    | { type: 'REMOVE_LIST'; payload: { listId: List['id'], replaceWith?: List['id'] } };
