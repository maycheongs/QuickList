// ListContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useListsByUserQuery, ListsByUserQuery } from '@/graphql/codegen';


type ListContextType = {
    lists: NonNullable<ListsByUserQuery['user']>['lists'];
    selectedListId: number | null;
    setSelectedListId: (id: number) => void;
    loading: boolean;
    error: Error | undefined;
    user: ListsByUserQuery['user'];
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { data, loading, error } = useListsByUserQuery({ variables: { userId: 1 } }); // Replace with actual user ID or context
    const [selectedListId, setSelectedListId] = useState<number | null>(() => {
        // Initialize from localStorage if available
        const saved = localStorage.getItem('selectedListId');
        return saved ? Number(saved) : null;
    });

    const changeSelectedListId = (id: number) => {
        localStorage.setItem('selectedListId', id.toString());
        setSelectedListId(id);
    };

    useEffect(() => {
        if (data?.user?.lists?.length && !selectedListId) {
            changeSelectedListId(data.user.lists[0].id); // default to first list
        }
    }, [data, selectedListId]);

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
