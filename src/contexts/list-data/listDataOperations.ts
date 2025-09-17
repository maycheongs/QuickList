//contexts/list-data/listDataOperations.ts
'use client';

import {
    useAddItemToListMutation, useUpdateItemMutation, useDeleteItemMutation, UpdateItemMutationVariables,
    useCreateCategoryMutation, useUpdateCategoryMutation,
    useCreateListMutation

} from "@/graphql/codegen";
import { Item, Category, List } from "../../components/MainPanel/ItemsContainer";
import { useListDataDispatch, useListDataState } from "./ListDataContext";


// ----- GraphQL helpers -----
export function useAddItem() {
    const dispatch = useListDataDispatch();
    const [addItemMutation] = useAddItemToListMutation();

    type AddItemInput = {
        name: Item['name'],
        lastMinute?: Item['lastMinute'],
        categoryId?: Category['id'],
    }

    return async (item: AddItemInput, listId: List['id']) => {

        //update UI
        const tempId = `temp-${Date.now()}`

        dispatch({
            type: "ADD_ITEM",
            item: {
                ...item,
                checked: false,
                lastMinute: item.lastMinute ?? false,
                id: tempId
            }
        })
        //wait for backend response
        try {
            const { data, errors } = await addItemMutation({ variables: { listId, ...item } });
            console.log('add item operation data', data)
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            if (!data?.addItemToList) { throw new Error("No data returned from addItemToList"); }

            dispatch({ type: "UPDATE_ITEM", id: tempId, changes: data.addItemToList }); //change to actual response data
        } catch (err) {
            console.error('Failed to add item', err);

            dispatch({ type: "DELETE_ITEM", id: tempId })
        }
    };
}

export function useUpdateItem() {
    const dispatch = useListDataDispatch();
    const [updateItemMutation] = useUpdateItemMutation();
    const { items } = useListDataState()

    return async (id: Item['id'], changes: Partial<Item>) => {
        const prevItem = items.find(item => item.id === id)
        dispatch({ type: "UPDATE_ITEM", id, changes });

        const { category, assignedTo, ...rest } = changes
        const variables: UpdateItemMutationVariables = { itemId: id, ...rest }
        if (category || category === null) variables["categoryId"] = category ? category.id : null
        if (assignedTo || assignedTo === null) variables['assignedToId'] = assignedTo ? assignedTo.id : null


        try {
            const { data, errors } = await updateItemMutation({ variables });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            if (data?.updateItem.deletedCategory) {
                dispatch({ type: "DELETE_CATEGORY", id: data.updateItem.deletedCategory.id })
            }
            console.log('update item operation data', data)
            return { success: true }
        } catch (err) {
            console.error(err, 'attempting to roll back dispatch update');
            if (prevItem) {
                dispatch({ type: "UPDATE_ITEM", id, changes: prevItem })
            }
            return { success: false }
        }
    };
}

export function useDeleteItem() {
    const dispatch = useListDataDispatch();
    const [deleteItemMutation] = useDeleteItemMutation();
    const { items } = useListDataState()

    return async (id: Item['id']) => {
        const prevItem = items.find(item => item.id === id)
        dispatch({ type: "DELETE_ITEM", id });

        try {
            const { data, errors } = await deleteItemMutation({ variables: { id } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            console.log('delete item operation data', data)
            if (data?.deleteItem?.deletedCategory) {
                dispatch({ type: "DELETE_CATEGORY", id: data.deleteItem.deletedCategory.id });
            }
        } catch (err) {
            console.error(err, 'attempting to roll back dispatch delete');
            if (prevItem) dispatch({ type: "ADD_ITEM", item: prevItem })
        }
    };
}

export function useAddCategory() {
    const dispatch = useListDataDispatch()
    const [createCategoryMutation] = useCreateCategoryMutation()

    return async (category: Category['name'], listId: List['id']) => {
        const tempId = `temp-${Date.now()}`
        // hot update UI
        dispatch({
            type: 'ADD_CATEGORY',
            category: { id: tempId, name: category }
        })

        try {
            const { data, errors } = await createCategoryMutation({ variables: { name: category, listId } })

            console.log('add category operation data', data)
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            if (!data?.createCategory) { throw new Error("No data returned from addCategory"); }

            dispatch({ type: "UPDATE_CATEGORY", id: tempId, changes: data.createCategory }); //change to actual response data
            return data.createCategory

        } catch (errors) {
            console.error('failed to add category', category, errors)
        }


    }
}