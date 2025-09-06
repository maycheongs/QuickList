//MainPanel/AddItemBar.tsx
import { useState } from 'react';
import { Box, HStack, Text, IconButton } from '@chakra-ui/react';
import { Editable } from '@chakra-ui/react'
import { Plus } from 'lucide-react';

interface AddItemBarProps {
    onAddItem: (itemName: string) => void;
}


function AddItemBar({ onAddItem }: AddItemBarProps) {
    const [itemName, setItemName] = useState('');



    return (
        <Box
            py={1}
            px={2}
            borderRadius="sm"
            // transition="all 0.2s"
            bg={`whiteAlpha.700`}
            position="fixed"
            bottom={2}
            zIndex='docked'
            width='100%'
        >
            <HStack gap={3}>
                <Editable.Root value={itemName} onValueChange={e => setItemName(e.value)} placeholder="Add Item" onValueCommit={(event) => onAddItem(event.value)}>
                    <Editable.Preview />
                    <Editable.Input />

                </Editable.Root>
                {/* 
                <IconButton variant='ghost'><Plus /></IconButton>
                <Text>Add item</Text> */}
            </HStack>

        </Box>
    )

}

export default AddItemBar;