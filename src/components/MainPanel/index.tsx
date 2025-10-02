'use client';

import { Box, Center, Button, HStack } from '@chakra-ui/react';
import { useAppData } from '../../contexts/AppContext';
import ItemsContainer from './ItemsContainer';
import ListHeader from './ListHeader';
import { OptimisticList } from '@/contexts/types'
import { MoveLeft } from 'lucide-react';

interface MainPanelProps {
    list: OptimisticList | null;
}

export default function MainPanel({ list }: MainPanelProps) {
    const { isMobile, setSelectedList } = useAppData()


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
        <Box as="main" fontSize={isMobile ? 16 : 14} height={["100dvh", "100vh"]} display="flex" flexDirection="column" w="100%">
            {isMobile ? <HStack mt={1} ml={2} alignSelf="flex-start" onClick={() => setSelectedList(null)}><MoveLeft /> </HStack> : ''}
            <ListHeader list={listHeaderData} key={list.id} />
            <ItemsContainer list={list} />
        </Box>
    );
}
