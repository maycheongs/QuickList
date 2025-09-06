//src/components/Home.tsx
import { useListContext } from '../contexts/ListContext';
import { Spinner, Center, Box, HStack } from '@chakra-ui/react';
import SidePanel from './SidePanel';
import MainPanel from './MainPanel';

function HomeContent() {
    const { loading } = useListContext();

    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <HStack align="stretch" gap={0} height="100vh">
            <Box w="300px" borderRight="1px solid lightgray">
                <SidePanel />
            </Box>
            <Box flex={1}>
                <MainPanel />
            </Box>
        </HStack>
    );
}

export default HomeContent