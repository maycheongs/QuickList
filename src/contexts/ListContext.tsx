//src/components/ListContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useListsByUserQuery, ListsByUserQuery, List, User } from '@/graphql/codegen';


type ListContextType = {
    lists: NonNullable<ListsByUserQuery['user']>['lists'];
    selectedListId: List['id'] | null;
    setSelectedListId: (id: List['id']) => void;
    loading: boolean;
    error: Error | undefined;
    user: ListsByUserQuery['user'];
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { data, loading, error } = useListsByUserQuery({ variables: { userId: "test-id" } }); // Replace with actual user ID or context
    const [selectedListId, setSelectedListId] = useState<List['id'] | null>(null);

    const changeSelectedListId = (id: List['id']) => {
        localStorage.setItem('selectedListId', id.toString());
        setSelectedListId(id);
    };

    // Set default selected list to first one if there isn't one in localStorage
    useEffect(() => {
        if (!(data?.user?.lists.length)) return // only matters if there are lists
        // Read from localStorage on client
        const saved = localStorage.getItem('selectedListId');
        const listIds = data.user?.lists?.map(list => list.id) || [];
        if (saved && saved in listIds) setSelectedListId(saved);
        else {
            // Default to first list if nothing in localStorage or id in localStorage does not exist in lists
            setSelectedListId(data.user.lists[0].id);
        }
    }, [data]);

    return (
        <ListContext.Provider
            value={{
                user: data?.user,
                lists: data?.user?.lists ?? [],
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
