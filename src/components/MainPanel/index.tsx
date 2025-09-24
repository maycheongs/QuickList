//components/MainPanel

'use client';
import { useEffect } from 'react';
import { Box, Spinner, Center, Button } from '@chakra-ui/react';
import { useListContext } from '../../contexts/ListContext';
import ItemsContainer from './ItemsContainer';
import ListHeader from './ListHeader';
import { ListDataProvider, useListDataState } from '../../contexts/list-data/ListDataContext';


export default function MainPanel() {
    const { selectedListId, lists, loading, error, listDataMap, setListDataForList } = useListContext();

    // console.log('MainPanel data:', data, 'loading:', loading, 'error:', error, 'selectedListId:', selectedListId);
    if (loading) {
        return (
            <Center height="100%">
                <Spinner size="xl" />
            </Center>
        );
    }
    if (!lists?.length) {
        return (
            <Center height="100%">
                <Button colorScheme="blue">Create List</Button>
            </Center>
        );
    }

    if (error) return <Box>Error loading lists: {error.message}</Box>;

    const listData = selectedListId && listDataMap[selectedListId]

    if (!listData) return <Box>List not found</Box>;

    const listHeaderData = {
        ...(listData.dueDate != null && { dueDate: listData.dueDate }),
        id: listData.id,
        name: listData.name,
        isNew: 'isNew' in listData ? listData.isNew : undefined
    };

    console.log('listData in MainPanel', listData, 'headerData', listHeaderData)



    return (
        <Box as="main" fontSize={14} height='100vh' display="flex" flexDirection="column">
            <ListDataProvider initialState={{ id: selectedListId, name: listData.name, items: listData.items, categories: listData.categories }}>
                <ListHeader key={selectedListId} list={listHeaderData} />
                <ItemsContainer />
                <SyncListDataWithContext listId={selectedListId} />
            </ListDataProvider>
        </Box>
    );
}


// Sync reducer state back to ListContext for per-list persistence
function SyncListDataWithContext({ listId }: { listId: string }) {
    const { setListDataForList } = useListContext();
    const state = useListDataState();

    useEffect(() => {
        setListDataForList(listId, state);
    }, [state, listId, setListDataForList]);

    return null;
}