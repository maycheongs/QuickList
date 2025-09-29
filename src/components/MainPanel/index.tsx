'use client';
import { Box, Spinner, Center, Button } from '@chakra-ui/react';
import { useAppData } from '../../contexts/AppContext';
import ItemsContainer from './ItemsContainer';
import ListHeader from './ListHeader';
import { List, OptimisticList } from '@/contexts/types'

interface MainPanelProps {
    list: OptimisticList | null;
}

export default function MainPanel({ list }: MainPanelProps) {




    if (!list) {
        return (
            <Center height="100%">
                <Button colorScheme="blue">Create List</Button>
            </Center>
        );
    }

    const listHeaderData = list ? { id: list.id, name: list.name, dueDate: list.dueDate, isNew: list.isNew } : null;
    console.log('Rendering main panel CATEGORIES', list.categories)

    return (
        <Box as="main" fontSize={14} height="100vh" display="flex" flexDirection="column">
            <ListHeader list={listHeaderData} key={list.id} />
            <ItemsContainer list={list} />
        </Box>
    );
}
