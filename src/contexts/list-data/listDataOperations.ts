
import { ADD_ITEM_TO_LIST, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION } from '@/graphql/operations/mutations';
import { useMutation } from '@apollo/client';
import { useAddItemToListMutation, useUpdateItemMutation, useDeleteItemMutation } from "@/graphql/codegen";
import { Item, Category, List } from "../../components/MainPanel/ItemsContainer";
import { useListDataDispatch } from "./ListDataContext";


// ----- GraphQL helpers -----
export function useAddItem() {
    const dispatch = useListDataDispatch();
    const [addItemMutation] = useAddItemToListMutation();

    return async (item: Omit<Item, 'id'>, listId: List['id']) => {
        //wait for backend response
        try {
            const { data, errors } = await addItemMutation({ variables: { listId, ...item } });
            if (errors?.length) { throw new Error(errors.map(e => e.message).join(", ")); };
            if (!data?.addItemToList) { throw new Error("No data returned from addItemToList"); }
            dispatch({ type: "ADD_ITEM", item: data.addItemToList }); //change to actual response data
        } catch (err) {
            console.error('Failed to add item', err);
        }
    };
}

export function useUpdateItem() {
    const dispatch = useListDataDispatch();
    const [updateItemMutation] = useUpdateItemMutation();

    return async (id: Item['id'], changes: Partial<Item>) => {
        dispatch({ type: "UPDATE_ITEM", id, changes });

        try {
            await updateItemMutation({ variables: { itemId: id, ...changes } });
        } catch (err) {
            console.error(err);
        }
    };
}

export function useDeleteItem() {
    const dispatch = useListDataDispatch();
    const [deleteItemMutation] = useDeleteItemMutation();

    return async (id: Item['id']) => {
        dispatch({ type: "DELETE_ITEM", id });

        try {
            const { data } = await deleteItemMutation({ variables: { id } });
            if (data?.deleteItem?.deletedCategory) {
                dispatch({ type: "DELETE_CATEGORY", id: data.deleteItem.deletedCategory.id });
            }
        } catch (err) {
            console.error(err);
        }
    };
}