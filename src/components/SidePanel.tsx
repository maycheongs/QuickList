//src/components/SidePanel.tsx
'use client';

import { VStack, Heading, Box, HStack, Separator, Button, Text, IconButton } from '@chakra-ui/react';
import { useListContext } from '../contexts/ListContext';
import { ListPlus } from 'lucide-react'


export default function SidePanel() {
    const { selectedListId, setSelectedListId, user, lists, loading, error, optimisticAddList } = useListContext();
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <VStack as="nav" gap={1} align="stretch" p={4} height='100%' overflowY="auto" fontSize={'sm'} minWidth={150}>
            <HStack gap={2} justify='space-between' pr={3} pb={2}>
                <Heading size="lg">My Lists</Heading>
                <IconButton display={{ base: "none", sm: "block" }} variant='ghost' aria-label="add-list"><ListPlus /></IconButton>
            </HStack>
            <Box mt={2} display={{ base: "block", sm: "none" }}>
                <Separator />
                <Box px={2} py={2}><HStack justify='space-between'><Text fontWeight='semibold'>Add Item</Text> <ListPlus /></HStack></Box>
                <Separator />
            </Box>
            {lists.map((list) => (
                <Box
                    key={list.id}
                    p={2}
                    pl={3}
                    borderRadius="md"
                    cursor="pointer"
                    data-selected={selectedListId === list.id ? "" : undefined}
                    _selected={{
                        bg: "blue.50",
                        color: "blue.700",
                        fontWeight: "semibold",
                        _hover: {
                            bg: "blue.50",
                        },
                    }}
                    onClick={() => setSelectedListId(list.id)}
                    _hover={{
                        bg: "gray.100"
                    }}
                >
                    {list.name}
                </Box>
            ))}

        </VStack>
    );
}
