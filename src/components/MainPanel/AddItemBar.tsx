
import { Box, HStack } from '@chakra-ui/react';

interface AddItemBarProps {
    onAddItem: (itemName: string) => void;
}


function addItemBar({ }: AddItemBarProps) {

    return (
        <Box
            as="li"
            py={1}
            px={2}
            borderRadius="sm"
            // transition="all 0.2s"
            bg={`whiteAlpha.700`}
        >
            <HStack gap={3}>
                Add an Item
            </HStack>

        </Box>
    )

}