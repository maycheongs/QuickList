//components/MainPanel/ItemsContainer/CategorySection.tsx
'use client';
import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Badge, Separator, Collapsible, Editable, IconButton, Spacer } from '@chakra-ui/react';
import { ChevronDown, PencilLine, Check, X } from 'lucide-react';
import ListItem from './ListItem'
import { Item } from '.';
import { useAppData } from '@/contexts/AppContext';
import { useUpdateCategory } from '@/contexts/AppDataOperations';


type CategorySectionProps = {
    categoryId?: string | null;
    listId?: string;
    items: Item[]
    isLastMinute?: boolean;
    isChecked?: boolean;
    color: string;
    categories: { id: string; name: string }[]
};

function CategorySection({ categoryId, listId, items, isChecked, isLastMinute, color, categories }: CategorySectionProps) {

    const { dispatch, isMobile } = useAppData();
    const updateCategory = useUpdateCategory()
    const [open, setOpen] = useState(true)

    const categoryName = categories.find(c => c.id === categoryId)?.name || null
    const [editable, setEditable] = useState(categoryName || '')

    useEffect(() => {
        if (!categories.length) return
        const category = categories.find(c => c.id === categoryId)
        category && setEditable(category.name)

    }, [categoryId])



    const optimisticDeleteCategoryIfEmpty = (listId: string, categoryId: string, itemId: string) => {
        //check if any items are using this category
        const stillInUse = items.some(item => item.category?.id === categoryId && item.id !== itemId);
        if (!stillInUse) {
            dispatch({ type: "DELETE_CATEGORY", payload: { listId, id: categoryId } })
        }
    }

    const onCategoryChange = async (name: string) => {
        console.log('category change')
        //if invalid or name is unchanged return
        if (!listId || !categoryName || !categoryId || name === categoryName) return
        console.log('gets here 1')
        name = name.trim()
        //if empty revert to original name
        if (!name) {
            setEditable(categoryName)
            return
        }
        //If it is a duplicate add a counter to it
        const existingCategoryNames = categories.map(c => c.name.toUpperCase())
        const baseName = name
        let counter = 1
        while (existingCategoryNames.includes(name.toUpperCase())) {
            name = `${baseName} (${counter})`
            counter++
        }
        setEditable(name)
        const response = await updateCategory(listId, categoryId, { name })
        //If server fails then revert to previous name
        if (!response?.success) {
            dispatch({ type: 'UPDATE_CATEGORY', payload: { listId, id: categoryId, changes: { name: categoryName } } })
        }
    }


    return (
        <Box py={1} color='gray.500'>

            <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                {/**CATEGORY HEADER AND ITEM COUNT */}
                {(categoryName || isChecked || isLastMinute) ?
                    <>
                        <HStack mb={2} onClick={(e) => {
                            // Only toggle if not clicking on the editable area
                            const target = e.target as HTMLElement;
                            if (!isMobile && !target.closest('[data-scope="editable"]')) {
                                setOpen(!open);
                            }
                        }}
                        >
                            <Collapsible.Trigger asChild>
                                <Box
                                    as={ChevronDown}
                                    w="12px"
                                    h="12px"
                                    color="gray.400"
                                    transform={open ? 'rotate(0deg)' : 'rotate(-90deg)'}
                                    transition="transform 0.2s ease"
                                    flexShrink={0}
                                />
                            </Collapsible.Trigger>
                            <HStack gap={1} alignItems='center' w={isMobile ? "90%" : "auto"} onClick={() => {
                                if (isMobile) setOpen(!open); // toggle collapsible on mobile
                            }}>

                                {categoryName ?
                                    <Editable.Root
                                        value={editable}
                                        onValueChange={(e) => setEditable(e.value)}
                                        activationMode={isMobile ? "none" : "dblclick"}
                                        onValueCommit={(e) => onCategoryChange(e.value)}
                                        disabled={categoryId!.startsWith('temp')}
                                    >
                                        <Editable.Preview
                                            fontWeight={'semibold'}
                                            borderLeftWidth="3px"
                                            borderLeftStyle="solid"
                                            borderLeftColor={`${color}.400`}
                                            pl={2}
                                            whiteSpace="nowrap"
                                            display="block"
                                            alignItems="center"
                                            gap={1.5}
                                            _hover={{
                                                '& .edit-icon': {
                                                    opacity: 1,
                                                },
                                            }}
                                            maxW="55vw"
                                            textOverflow="ellipsis"
                                            overflow="hidden"

                                        // pointerEvents={isMobile ? "none" : "auto"}
                                        >
                                            {editable.toUpperCase()}

                                        </Editable.Preview>
                                        <Editable.Input
                                            fontWeight={'semibold'}
                                            borderLeftWidth="3px"
                                            borderLeftStyle="solid"
                                            borderLeftColor={`${color}.400`}
                                            pl={2}
                                            whiteSpace="nowrap"
                                            _focus={{
                                                outline: 'none',
                                                borderBottom: '1px solid',
                                                borderBottomColor: 'blue.500',
                                            }}
                                        />
                                        {isMobile ? <Editable.Control>
                                            <Editable.EditTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <IconButton variant="ghost" size="xs">
                                                    <PencilLine />
                                                </IconButton>
                                            </Editable.EditTrigger>
                                            <Editable.CancelTrigger asChild>
                                                <IconButton variant="outline" size="xs" onClick={(e) => e.stopPropagation()}>
                                                    <X />
                                                </IconButton>
                                            </Editable.CancelTrigger>
                                            <Editable.SubmitTrigger asChild>
                                                <IconButton variant="outline" size="xs" onClick={(e) => e.stopPropagation()}>
                                                    <Check />
                                                </IconButton>
                                            </Editable.SubmitTrigger>
                                        </Editable.Control> : ''}
                                    </Editable.Root> :

                                    <Box
                                        fontWeight={'semibold'}
                                        borderLeftWidth="3px"
                                        borderLeftStyle="solid"
                                        borderLeftColor={`${color}.400`}
                                        pl={2}
                                    > {isLastMinute ? 'LAST MINUTE' : 'COMPLETED'}
                                    </Box>

                                }
                                <Spacer />
                                <Badge size='sm' fontWeight='500' fontSize={11} color='inherit'>
                                    {`${items.length} items`}
                                </Badge>


                            </HStack>

                        </HStack><Separator mb={1} />
                    </> : ''}

                {/**ITEMS */}

                <Collapsible.Content>
                    <VStack as="ul" gap={1} align="stretch" className="group">
                        {items.map(item => (
                            <ListItem
                                key={item.id}
                                item={item}
                                categories={categories}
                                optimisticDeleteCategoryIfEmpty={optimisticDeleteCategoryIfEmpty}
                            />
                        ))}
                    </VStack>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    )

}

export default CategorySection;