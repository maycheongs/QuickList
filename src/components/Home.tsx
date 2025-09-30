//src/components/Home.tsx
import { useAppData } from '@/contexts/AppContext';
import { Spinner, Center, Box, HStack, useBreakpointValue } from '@chakra-ui/react';
import SidePanel from './SidePanel';
import MainPanel from './MainPanel';
import type { List } from '@/contexts/types'

function HomeContent() {
    const isMobile = useBreakpointValue({ base: true, md: false })
    const { loading, state, setSelectedList } = useAppData();
    const { selectedListId, lists } = state;

    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    console.log('LISTS', Object.values(lists).map(l => ({ name: l.name, isNew: l.isNew || null })))
    const listData = selectedListId ? lists[selectedListId] : null;
    const listNavData = Object.values(lists).map((list: List) => ({ id: list.id, name: list.name, dueDate: list.dueDate }))

    return (
        <HStack align="stretch" gap={0} height="100vh" >
            {!isMobile || selectedListId === null ?
                <Box w={isMobile ? "100%" : "300px"} borderRight="1px solid lightgray" >
                    <SidePanel lists={listNavData} selectedListId={selectedListId} />
                </Box> : ''}
            {selectedListId === null ? '' :
                <Box flex={1}>
                    <MainPanel list={listData} />
                </Box>}
        </HStack>
    );
}

export default HomeContent