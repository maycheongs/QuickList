//src/components/SidePanel.tsx
'use client';

import { VStack, Heading, Box } from '@chakra-ui/react';
import { useListContext } from './ListContext';


export default function SidePanel() {
    const { selectedListId, setSelectedListId, user, lists, loading, error } = useListContext();
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <VStack as="nav" gap={2} align="stretch" p={4}>
            <Heading size="md">My Lists</Heading>
            {lists.length === 0 && <Box>No lists. Create one!</Box>}
            {lists.map((list) => (
                <Box
                    key={list.id}
                    p={2}
                    border="1px solid lightgray"
                    borderRadius="md"
                    cursor="pointer"
                    bg={selectedListId === list.id ? 'gray.100' : 'white'}
                    onClick={() => setSelectedListId(list.id)}
                >
                    {list.name}
                </Box>
            ))}
        </VStack>
    );
}
