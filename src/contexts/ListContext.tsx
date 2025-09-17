//src/components/ListContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useListsByUserQuery, ListsByUserQuery, User } from '@/graphql/codegen';
import { ListDataState } from './list-data/listDataReducer';


type ListContextType = {
    lists: { id: List['id'], name: List['name'], dueDate?: List['dueDate'] }[];
    selectedListId: List['id'] | null;
    setSelectedListId: (id: List['id']) => void;
    loading: boolean;
    error: Error | undefined;
    user: ListsByUserQuery['user'];
    listDataMap: ListDataMap;
    setListDataForList: (listId: List['id'], state: ListDataState) => void
};

type List = NonNullable<ListsByUserQuery['user']>['lists'][0]
type ListDataMap = Record<string, List>

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { data, loading, error } = useListsByUserQuery({ variables: { userId: "test-id" } }); // Replace with actual user ID or context
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

    return (
        <ListContext.Provider
            value={{
                user: data?.user,
                lists: data?.user?.lists.map(list => ({ id: list.id, name: list.name, itemCount: list.items.length })) ?? [],
                listDataMap,
                setListDataForList,
                selectedListId,
                setSelectedListId: changeSelectedListId,
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
