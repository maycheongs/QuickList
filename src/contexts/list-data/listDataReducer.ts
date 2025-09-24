//contexts/list-data/listDataReducer.ts
'use client';


import CategorySection from "@/components/MainPanel/ItemsContainer/CategorySection";
import { Item, Category, List } from "../../components/MainPanel/ItemsContainer";

// Full state
export type ListDataState = {
    id: List['id'],
    name: List['name'],
    categories: Category[];
    items: Item[]; //indicates if this is a new unsaved list
} | null;

// Actions
export type ListDataAction =
    | { type: "SET_DATA"; payload: ListDataState }
    | { type: "ADD_ITEM"; item: Item }
    | { type: "UPDATE_ITEM"; id: Item['id']; changes: Partial<Item> }
    | { type: "DELETE_ITEM"; id: Item['id'] }
    | { type: "ADD_CATEGORY"; category: Category }
    | { type: "UPDATE_CATEGORY"; id: Category['id']; changes: Partial<Category> }
    | { type: "DELETE_CATEGORY"; id: Category['id'] };

// Reducer 
export function listDataReducer(state: ListDataState, action: ListDataAction): ListDataState {
    if (!state && action.type !== 'SET_DATA') {
        // prevent errors on null state
        return state;
    }
    switch (action.type) {
        case 'SET_DATA':
            return action.payload ? { ...action.payload } : state;
        case "ADD_ITEM":
            return { ...state!, items: [action.item, ...state!.items] };

        case "UPDATE_ITEM":
            return {
                ...state!,
                items: state!.items.map(item =>
                    item.id === action.id ? { ...item, ...action.changes } : item
                ),
            };

        case "DELETE_ITEM":
            return { ...state!, items: state!.items.filter(item => item.id !== action.id) };

        case "ADD_CATEGORY":
            return { ...state!, categories: [...state!.categories, action.category] };

        case "UPDATE_CATEGORY":
            return {
                ...state!,
                categories: state!.categories.map(cat =>
                    cat.id === action.id ? { ...cat, ...action.changes } : cat
                ),
                items: state!.items.map(item =>
                    item.category?.id === action.id ? { ...item, category: { ...item.category, ...action.changes } } : item
                )
            };

        case "DELETE_CATEGORY":
            return {
                ...state!,
                categories: state!.categories.filter(cat => cat.id !== action.id),
                items: state!.items.map(item =>
                    item.category?.id === action.id ? { ...item, category: null } : item
                ),
            };

        default:
            return state;
    }
}
