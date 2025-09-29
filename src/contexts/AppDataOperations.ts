import {
    useAddItemToListMutation,
    useUpdateItemMutation,
    UpdateItemMutationVariables,
    useDeleteItemMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useUpdateListMutation,
    useDeleteListMutation,
    useCreateListMutation,
    ListType

} from "@/graphql/codegen";
import { ListItem, ListCategory, List, ListDataState } from "@/contexts/types";
import { useAppData, seedUser } from "./AppContext";

//LLIST OPERATIONS
export function useAddList() {

    const { dispatch } = useAppData();
    const [createList] = useCreateListMutation();

    return async (name: string) => {
        try {
            const { data } = await createList({ variables: { name, userId: seedUser.id, type: ListType.Packing } });
            if (!data?.createList) { throw new Error("No data returned from createList"); }
            const listData = { ...data.createList, items: [], categories: [], isNew: true }
            dispatch({ type: 'ADD_LIST', payload: listData });
            localStorage.setItem(`selectedListId:${seedUser.id}`, listData.id)
            return { success: true, list: listData }
        } catch (err) {
            console.error('Error creating list', err);
            return {
                success: false, list: null
            }

        }
    }
}

export function useDeleteList() {
    const { dispatch } = useAppData();
    const [deleteList] = useDeleteListMutation()

    return async (listId: List['id']) => {
        dispatch({ type: 'REMOVE_LIST', payload: { listId } });

        try {
            const response = await deleteList({ variables: { listId } })
            if (response.errors) throw new Error("Delete List mutation failed");
        } catch (err) {
            console.log('Error deleting list', err)
            // Optionally, you could re-fetch lists from the server here to ensure consistency
        }
    }
}

export function useUpdateList() {
    const { dispatch, state } = useAppData();
    const [updateListMutation] = useUpdateListMutation();

    return async (listId: List['id'], changes: Partial<ListDataState>) => {
        const prevList = state.lists[listId]
        const { name, dueDate } = changes
        if (!name && !dueDate) return; //nothing to update
        dispatch({ type: "UPDATE_LIST", payload: { listId, changes } });

        try {
            const { data, errors } = await updateListMutation({ variables: { listId, ...changes } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            console.log('update list operation data', data)
            return { success: true }
        } catch (err) {
            console.error(err, 'attempting to roll back dispatch update');
            dispatch({ type: "UPDATE_LIST", payload: { listId, changes: { name: prevList.name, dueDate: prevList.dueDate } } });
            return { success: false }
        }
    }
}

//ITEM OPERATIONS

// type ListItem = {
//     __typename?: "Item";
//     id: string;
//     name: string;
//     checked: boolean;
//     lastMinute: boolean;
//     createdAt: string;
//     assignedTo?: {
//         __typename?: "User";
//         id: string;
//         name: string;
//         email: string;
//     } | null;

export function useAddItem() {
    const { dispatch } = useAppData();
    const [addItem] = useAddItemToListMutation();

    type AddItemInput = {
        name: ListItem['name'],
        lastMinute?: ListItem['lastMinute'],
        categoryId?: ListCategory['id'],
    }

    return async (listId: List['id'], item: AddItemInput) => {
        //Update UI
        const tempId = `temp-${Date.now()}`
        const tempItem: Partial<ListItem> = {
            id: tempId,
            name: item.name,
            checked: false,
            lastMinute: item.lastMinute ?? false,
        }

        dispatch({
            type: "ADD_ITEM", payload: {
                listId,
                item: tempItem as ListItem
            }
        })

        try {
            const { data, errors } = await addItem({ variables: { listId, ...item } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); }
            if (!data?.addItemToList) { throw new Error("No data returned from addItemToList"); }

            dispatch({ type: "UPDATE_ITEM", payload: { listId, id: tempId, changes: data.addItemToList } }); //change to actual response data

        } catch (err) {
            console.error('Failed to add item', err);

            dispatch({ type: "DELETE_ITEM", payload: { listId, id: tempId } })

        }
    }
}

export function useUpdateItem() {
    const { dispatch, state } = useAppData();
    const [updateItemMutation] = useUpdateItemMutation();
    const { lists } = state


    return async (listId: List['id'], id: ListItem['id'], changes: Partial<ListItem>) => {
        const listItems = lists[listId].items;
        const prevItem = listItems.find(item => item.id === id)
        dispatch({ type: "UPDATE_ITEM", payload: { listId, id, changes } });

        const { category, assignedTo, ...rest } = changes
        const variables: UpdateItemMutationVariables = { itemId: id, ...rest }
        if (category || category === null) variables["categoryId"] = category ? category.id : null
        if (assignedTo || assignedTo === null) variables['assignedToId'] = assignedTo ? assignedTo.id : null


        try {
            const { data, errors } = await updateItemMutation({ variables });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };

            return { success: true }
        } catch (err) {
            console.error(err, 'attempting to roll back dispatch update');
            if (prevItem) {
                dispatch({ type: "UPDATE_ITEM", payload: { listId, id, changes: prevItem } })
            }
            return { success: false }
        }
    };
}

export function useDeleteItem() {
    const { dispatch } = useAppData();
    const [deleteItemMutation] = useDeleteItemMutation();

    return async (listId: List['id'], id: ListItem['id']) => {
        dispatch({ type: "DELETE_ITEM", payload: { listId, id } });

        try {
            const { data, errors } = await deleteItemMutation({ variables: { id } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
        } catch (err) {
            console.error('Failed to delete item', err);
            // Optionally, you could re-fetch items from the server here to ensure consistency
        }
    };
}

export function useAddCategory() {
    const { dispatch } = useAppData();
    const [createCategoryMutation] = useCreateCategoryMutation();

    return async (name: ListCategory['name'], listId: List['id']) => {
        //optimistically update UI
        const tempId = `temp-${Date.now()}`

        dispatch({ type: "ADD_CATEGORY", payload: { listId, category: { id: tempId, name } } })

        try {
            const { data, errors } = await createCategoryMutation({ variables: { name, listId } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); }
            if (!data?.createCategory) { throw new Error("No data returned from createCategory"); }

            dispatch({ type: "UPDATE_CATEGORY", payload: { listId, id: tempId, changes: data.createCategory } }); //change to actual response data
            return data.createCategory
        } catch (err) {
            console.error('Failed to create category', err);
            dispatch({ type: "DELETE_CATEGORY", payload: { listId, id: tempId } })
        }
    }
}