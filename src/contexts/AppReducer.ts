import type { AppState, AppAction } from "./types";

export function appDataReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case "SET_ALL_LISTS":
            console.log('SETTING ALL LISTS', action.payload)
            return { ...state, lists: action.payload };

        case "SET_SELECTED_LIST":
            console.log('SETTING SELECTED LIST', action.payload)
            //remove isNew from all lists except the selected one
            const updatedLists = Object.fromEntries(
                Object.entries(state.lists).map(([id, list]) => {
                    if (id === action.payload) return [id, list]; // leave this one as is
                    if ('isNew' in list) {
                        // remove isNew by returning a shallow copy without it
                        const { isNew, ...rest } = list;
                        return [id, rest];
                    }
                    return [id, list];
                })
            );

            return { ...state, selectedListId: action.payload, lists: updatedLists };

        // ---------- List actions ----------
        case "ADD_LIST":

            //Generate a default name if none provided
            if (!action.payload.name || action.payload.name.trim() === "") {
                let baseName = "Untitled";
                let name = baseName
                let counter = 1;
                const existingNames = new Set(Object.values(state.lists).map(l => l.name));
                while (existingNames.has(name)) {
                    name = `${baseName} (${counter})`;
                    counter++;
                }
                action.payload.name = name;
            }
            console.log('ADDING LIST', action.payload.name)
            return {
                ...state,
                selectedListId: action.payload.id,
                lists: { ...state.lists, [action.payload.id]: action.payload },
            };

        case "REMOVE_LIST": {
            const { [action.payload.listId]: _, ...rest } = state.lists;
            let newSelected = state.selectedListId;
            //If currently selected list is deleted, select the first list
            if (state.selectedListId === action.payload.listId) {
                newSelected = Object.keys(rest)[0] || null;
            }
            return { ...state, lists: rest, selectedListId: newSelected };
        };

        case "REPLACE_LIST": {
            const { tempId, newList } = action.payload;
            const { [tempId]: _, ...rest } = state.lists;
            return {
                ...state,
                lists: { ...rest, [newList.id]: newList },
                selectedListId: state.selectedListId === tempId ? newList.id : state.selectedListId,
            };
        };



        case "UPDATE_LIST": {
            const { listId, changes } = action.payload;
            const list = state.lists[listId];
            if (!list) return state;

            const updatedList = { ...list, ...changes };
            // Ensure we do not keep isNew if name or dueDate is updated
            if (list.isNew) {
                delete updatedList.isNew;
            }
            return {
                ...state,
                lists: { ...state.lists, [listId]: updatedList },
            };
        }

        // ---------- Item actions ----------
        case "ADD_ITEM": {
            const { listId, item } = action.payload;
            const list = state.lists[listId];
            if (!list) return state;
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: { ...list, items: [item, ...list.items] },
                },
            };
        }

        case "UPDATE_ITEM": {
            const { listId, id, changes } = action.payload;
            const list = state.lists[listId];
            // console.log('UPDATE ITEM PAYLOAD', action.payload.changes, 'Categories:', list?.categories)
            if (!list) return state;
            const updateState = {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...list,
                        items: list.items.map((i) =>
                            i.id === id ? { ...i, ...changes } : i
                        ),
                    },
                }
            }
            console.log('UPDATE ITEM PAYLOAD:', changes, 'CATEGORIES', updateState.lists[listId].categories)
            return updateState;
        }

        case "DELETE_ITEM": {
            const { listId, id } = action.payload;
            const list = state.lists[listId];
            if (!list) return state;
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...list,
                        items: list.items.filter((i) => i.id !== id),
                    },
                },
            };
        }

        // ---------- Category actions ----------
        case "ADD_CATEGORY": {
            const { listId, category } = action.payload;
            const list = state.lists[listId];
            console.log('ADDING CATEGORY', category)
            if (!list) return state;
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: { ...list, categories: [...list.categories, category] },
                },
            };
        }

        case "UPDATE_CATEGORY": {
            const { listId, id, changes } = action.payload;
            const list = state.lists[listId];
            console.log('updating category', id, changes, 'current list', list)
            if (!list) return state;
            const updatedCategories = { ...list }.categories.map(c => c.id === id ? { ...c, ...changes } : c)
            const updatedItems = { ...list }.items.map(item => item.category?.id === id ? { ...item, category: { ...item.category, ...changes } } : item)
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...list,
                        categories: updatedCategories,
                        items: updatedItems,
                    },
                },
            };
        }

        case "DELETE_CATEGORY": {
            const { listId, id } = action.payload;
            const list = state.lists[listId];
            if (!list) return state;
            console.log('deleting category', id, 'current list', list.categories)
            const newState = {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...list,
                        categories: list.categories.filter((c) => c.id !== id),
                    },
                },
            }

            console.log('new state after delete category', newState.lists[listId].categories)
            return newState
        }

        default:
            return state;
    }
}
