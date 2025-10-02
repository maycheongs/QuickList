//MainPanel/AddItemBar.tsx
import { useState } from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { Editable } from '@chakra-ui/react'
import { Category } from '.'
import { useAddItem } from '@/contexts/AppDataOperations';
import { Check } from 'lucide-react'


interface AddItemBarProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    categories?: Category[];
    listId?: string;
}


function AddItemBar({ containerRef, listId }: AddItemBarProps) {

    const addItem = useAddItem()
    const [itemName, setItemName] = useState('');
    // const [currentCategory, setCurrentCategory] = useState(null)
    // const [isLastMinute, setIsLastMinute] = useState(false)


    async function handleAddItem(value: string) {
        if (!listId || !value.trim()) return
        console.log('adding item', value)
        setItemName('')
        addItem(listId, { name: value })
        //go to top of list
        window.scrollTo(0, 0);
        containerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleHitEnter(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddItem(itemName)
        }
    }

    const handleOnFocus = () => {


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
                    <Editable.Root fontSize='inherit' submitMode='none' value={itemName} onValueChange={(e) => setItemName(e.value)} placeholder="Add a new item to the list" onKeyDown={(e) => handleHitEnter(e)}
                        onInteractOutside={(e) => e.preventDefault()} onFocus={handleOnFocus}
                    >
                        <Editable.Preview fontSize='inherit' width="full" />
                        <Editable.Input fontSize='inherit' />
                        <Editable.Control>
                            <Editable.SubmitTrigger asChild>
                                <IconButton variant="outline" size="xs" onClick={(e) => e.stopPropagation()}>
                                    <Check />
                                </IconButton>
                            </Editable.SubmitTrigger>
                        </Editable.Control>
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