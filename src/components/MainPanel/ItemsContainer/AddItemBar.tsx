//MainPanel/AddItemBar.tsx
import { use, useState } from 'react';
import { Box, HStack, Text, IconButton, ForProps, useListCollection } from '@chakra-ui/react';
import { Editable } from '@chakra-ui/react'
import { Plus } from 'lucide-react';
import { Category } from '.'
import { useAddItem } from '@/contexts/AppDataOperations';
import { BiTrim } from 'react-icons/bi';


interface AddItemBarProps {
    categories?: Category[],
}


function AddItemBar({ categories }: AddItemBarProps) {

    const addItem = useAddItem()
    const [itemName, setItemName] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null)
    const [isLastMinute, setIsLastMinute] = useState(false)


    async function handleAddItem(value: string) {
        if (!selectedListId || !value.trim()) return
        console.log('adding item', value)
        setItemName('')
        addItem({ name: value }, selectedListId)

    }

    async function handleHitEnter(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddItem(itemName)
        }
    }


    return (
        <Box
            position="sticky"
            bottom={2}
            zIndex='docked'
            pt={2}
            mr={3}

        >
            <Box
                borderRadius="sm"
                bg={`gray.50`}
                px={2}
                py={1}
                border={"2px dotted"}
                borderColor='gray.200'
            >
                <HStack gap={3}>
                    <Editable.Root submitMode='none' value={itemName} onValueChange={(e) => setItemName(e.value)} placeholder="Add Item" onKeyDown={(e) => handleHitEnter(e)}
                        onInteractOutside={(e) => e.preventDefault()}
                    >
                        <Editable.Preview />
                        <Editable.Input />
                    </Editable.Root>

                    {/* 
                <IconButton variant='ghost'><Plus /></IconButton>
                <Text>Add item</Text> */}
                </HStack>
            </Box>

        </Box>
    )

}

export default AddItemBar;