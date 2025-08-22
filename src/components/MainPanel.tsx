'use client';

import { Box, Heading, VStack, Checkbox, Spinner, Center, Button } from '@chakra-ui/react';
import { useListContext } from './ListContext';
import { useGetListQuery } from '@/graphql/codegen';


export default function MainPanel() {
    const { selectedListId } = useListContext();

    // Skip query if no list is selected
    const { data, loading, error } = useGetListQuery({
        variables: { id: selectedListId! }, // non-null because we skip below
        skip: !selectedListId,
    });

    console.log('MainPanel data:', data, 'loading:', loading, 'error:', error, 'selectedListId:', selectedListId);

    if (!selectedListId) {
        return (
            <Center height="100%">
                <Button colorScheme="blue">Create List</Button>
            </Center>
        );
    }

    if (loading) {
        return (
            <Center height="100%">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) return <Box>Error loading list: {error.message}</Box>;

    const list = data?.list;
    if (!list) return <Box>List not found</Box>;

    // Sort items: unchecked first, then checked
    const sortedItems = [...list.items].sort((a, b) => Number(a.checked) - Number(b.checked));




    return (
        <Box>
            <Heading size="lg" mb={4}>{list.name}</Heading>
            <VStack align="stretch" gap={2}>
                {sortedItems?.map((item: any) => (
                    <Checkbox.Root
                        checked={item.checked}
                    // onCheckedChange={(e) => setChecked(!!e.checked)}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{item.name} {item.lastMinute && '(Last Minute)'} {item.category || ''}</Checkbox.Label>
                    </Checkbox.Root>

                ))}
            </VStack>
        </Box>
    );
}
