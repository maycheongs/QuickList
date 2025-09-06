import { createContext, useReducer, useContext, ReactNode } from "react";
import { listDataReducer } from "./listDataReducer";
import type { ListDataAction, ListDataState } from "./listDataReducer";

const ListDataStateContext = createContext<ListDataState | undefined>(undefined);
const ListDataDispatchContext = createContext<React.Dispatch<ListDataAction> | undefined>(undefined);

export function ListDataProvider({
    children,
    initialState,
}: {
    children: ReactNode;
    initialState?: ListDataState;
}) {
    const [state, dispatch] = useReducer(listDataReducer, initialState || { items: [], categories: [] });

    return (
        <ListDataStateContext.Provider value={state}>
            <ListDataDispatchContext.Provider value={dispatch}>
                {children}
            </ListDataDispatchContext.Provider>
        </ListDataStateContext.Provider>
    );
}


//Split into state/dispatch Hooks
export function useListDataState() {
    const context = useContext(ListDataStateContext);
    if (!context) throw new Error("useListDataState must be used within a ListDataProvider");
    return context;
}

export function useListDataDispatch() {
    const context = useContext(ListDataDispatchContext);
    if (!context) throw new Error("useListDataDispatch must be used within a ListDataProvider");
    return context;
}

