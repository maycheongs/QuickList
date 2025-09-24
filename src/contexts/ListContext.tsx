//src/components/ListContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useListsByUserQuery, ListsByUserQuery, User, useCreateListMutation, ListType, } from '@/graphql/codegen';
import { ListDataState } from './list-data/listDataReducer';

//test user

const seedUser = { name: "Alice", email: "alice@example.com", id: "test-id" }
type ListContextType = {
    lists: { id: List['id'], name: List['name'], dueDate?: List['dueDate'] }[];
    selectedListId: List['id'] | null;
    setSelectedListId: (id: List['id']) => void;
    loading: boolean;
    error: Error | undefined;
    user: ListsByUserQuery['user'];
    listDataMap: ListDataMap;
    setListDataForList: (listId: List['id'], state: ListDataState) => void;
    optimisticAddList: (name: List['name']) => Promise<void>;
    onConfirmAddList: (name: List['name'], tempId: string) => Promise<void>;
};
type GqlList = NonNullable<ListsByUserQuery['user']>['lists'][0]
type OptimisticList = Partial<GqlList> & {
    id: GqlList['id'];  // always required
    items: GqlList['items']; // always required
    categories: GqlList['categories']; // always required
    dueDate: GqlList['dueDate'];
    name: GqlList['name'];
    users: GqlList['users'];
    isNew?: true;
};
type List = GqlList | OptimisticList
type ListDataMap = Record<string, List>

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { data, loading, error } = useListsByUserQuery({ variables: { userId: seedUser.id } }); // Replace with actual user ID or context
    const [createList] = useCreateListMutation()
    const [selectedListId, setSelectedListId] = useState<List['id'] | null>(null);
    const [listDataMap, setListDataMap] = useState<ListDataMap>({})

    const setListDataForList = (listId: List['id'], state: ListDataState) => {
        setListDataMap(prev => {
            const current = prev[listId];
            if (
                current &&
                current.items === state.items &&
                current.categories === state.categories
            ) {
                return prev; //nothing changed, don't trigger re-render
            }
            return {
                ...prev,
                [listId]: {
                    ...current,
                    items: state.items as List['items'],
                    categories: state.categories,
                },
            };
        });
    };


    const changeSelectedListId = (id: List['id']) => {
        localStorage.setItem(`selectedListId: ${data?.user?.id}`, id.toString());
        setSelectedListId(id);
    };

    console.log('fetched data for user', data)

    // Set default selected list to first one if there isn't one in localStorage
    useEffect(() => {
        if (!(data?.user?.lists.length)) return // only matters if there are lists
        // Read from localStorage on client
        const saved = localStorage.getItem(`selectedListId: ${data.user.id}`);
        const initialMap: ListDataMap = {}
        data.user.lists.forEach(list => {
            initialMap[list.id] = { ...list }
        })
        setListDataMap(initialMap)
        if (saved && saved in initialMap) setSelectedListId(saved)
        else {
            // Default to first list if nothing in localStorage or id in localStorage does not exist in lists
            setSelectedListId(data.user.lists[0].id);
        }
    }, [data?.user?.id]);


    const optimisticAddList = async (name: List['name']) => {
        const tempId = `temp-${Date.now()}`
        const optimisticList: List = { id: tempId, name: 'New List', dueDate: null, items: [], isNew: true, categories: [], users: [seedUser] }
        setListDataMap(prev => ({ ...prev, [tempId]: optimisticList }))
        setSelectedListId(tempId)
    }

    const onConfirmAddList = async (name: List['name'], tempId: string) => {
        // optimistic UI update with new list name if different from default
        // create and fetch list id from server
        // add into listDataMap, remove temp list
        // set selectedListId to new list id
        // if error remove the temp list 
    }

    return (
        <ListContext.Provider
            value={{
                user: data?.user,
                lists: data?.user?.lists.map(list => ({ id: list.id, name: list.name, itemCount: list.items.length })) ?? [],
                listDataMap,
                setListDataForList,
                selectedListId,
                setSelectedListId: changeSelectedListId,
                optimisticAddList,
                onConfirmAddList,
                loading,
                error
            }}
        >
            {children}
        </ListContext.Provider>
    );
}

export function useListContext() {
    const context = useContext(ListContext);
    if (!context) throw new Error('useListContext must be used within a ListProvider');
    return context;
}
