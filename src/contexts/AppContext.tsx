//contexts/AppContext.tsx
'use client';

import { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { appDataReducer } from "./AppReducer";
import type { AppAction, AppState, ListsMap, List } from "./types";
import { ListType, useListsByUserQuery } from "@/graphql/codegen";
import { useCreateListMutation } from "@/graphql/codegen";

//test user
export const seedUser = { name: "Alice", email: "alice@example.com", id: "test-id" }

type AppDataContextType = {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    loading: boolean;
    error?: Error;
    setSelectedList: (id: string) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);


export function AppDataProvider({
    children,

}: {
    children: ReactNode;
}) {
    const { data, loading, error } = useListsByUserQuery({ variables: { userId: seedUser.id } }) //get initial state from ListContext
    const [state, dispatch] = useReducer(appDataReducer, { lists: {}, selectedListId: null });
    // const [createList] = useCreateListMutation()

    // Load initial lists from server
    useEffect(() => {
        if (!data?.user?.lists?.length) return;



        const initialMap: ListsMap = data.user.lists.reduce((acc, list) => {
            acc[list.id] = {
                ...list,
                items: list.items || [],
                categories: list.categories || []
            };
            return acc;
        }, {} as ListsMap);

        dispatch({ type: 'SET_ALL_LISTS', payload: initialMap });

        const saved = localStorage.getItem(`selectedListId:${seedUser.id}`);
        if (saved && saved in initialMap) {
            dispatch({ type: 'SET_SELECTED_LIST', payload: saved });
        } else {
            dispatch({ type: 'SET_SELECTED_LIST', payload: data.user.lists[0].id });
        }
    }, [data?.user?.id]);

    // Helper to set selected list and persist to localStorage
    const setSelectedList = (id: string) => {
        dispatch({ type: 'SET_SELECTED_LIST', payload: id });
        localStorage.setItem(`selectedListId:${seedUser.id}`, id);
    };

    return (
        <AppDataContext.Provider value={{ state, dispatch, loading, error, setSelectedList }
        }>
            {children}
        </AppDataContext.Provider>
    );

};


//Split into state/dispatch Hooks
export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppData must be used within a AppDataProvider");
    return context;
}


