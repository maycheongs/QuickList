'use client';

import { VStack, Heading, Box } from '@chakra-ui/react';
import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import { useListContext } from './ListContext';

const GET_LISTS = gql`
  query GetLists {
    lists {
      id
      name
    }
  }
`;

export default function SidePanel() {
    const { selectedListId, setSelectedListId } = useListContext();
    const { data, loading, error } = useQuery(GET_LISTS);

    // Set default selected list to first one
    useEffect(() => {
        if (!selectedListId && data?.lists?.length > 0) {
            console.log('setting default list', data.lists[0]);
            setSelectedListId(data.lists[0].id);
        }
    }, [data, selectedListId, setSelectedListId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <VStack gap={2} align="stretch" p={4}>
            <Heading size="md">My Lists</Heading>
            {data.lists.length === 0 && <Box>No lists. Create one!</Box>}
            {data.lists.map((list: any) => (
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
