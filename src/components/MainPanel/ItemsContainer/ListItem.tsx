
import React, { useState, useRef } from 'react';
import { Box, HStack, Text, Checkbox, Badge, Button, IconButton, Menu, Icon, Input } from '@chakra-ui/react';
import { Settings, Zap, Trash } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useDeleteItem, useUpdateItem, useAddCategory } from '@/contexts/AppDataOperations';


import { Item, Category } from '.';

import { useAppData } from '@/contexts/AppContext';


interface ListItemProps {
    item: Item;
    categories: Category[];
    optimisticDeleteCategoryIfEmpty: (listId: string, categoryId: string, itemId: string) => void;
}


const ListItem = ({ item, categories, optimisticDeleteCategoryIfEmpty }: ListItemProps) => {
    const deleteItem = useDeleteItem()
    const updateItem = useUpdateItem()
    const addCategory = useAddCategory()
    const { state, dispatch, isMobile } = useAppData()
    const { selectedListId: listId } = state

    const [open, setOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('')
    const categoryInputRef = useRef<HTMLInputElement>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null); //access DOM elements directly
    const menuRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    if (!listId) return null



    const handleMouseLeaveMenu = (event: React.MouseEvent) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            const triggerHover = triggerRef.current?.matches(":hover");
            const menuHover = menuRef.current?.matches(":hover");
            if (!triggerHover && !menuHover) {
                setOpen(false);
            }
        }, 300)
    }

    const handleDeleteItem = async () => {
        console.log('deleting item', item.name)
        await deleteItem(listId, item.id)
    }

    const toggleCheck = (checked: boolean, itemId: Item['id']) => {
        updateItem(listId, itemId, { checked })
    }

    const toggleLastMinute = (lastMinute: boolean, itemId: Item['id']) => {
        updateItem(listId, itemId, { lastMinute: !lastMinute })
    }

    const onSetCategory = (category: Category | null, itemId: Item['id']) => {
        console.log('setting category', category)
        updateItem(listId, itemId, { category })
    }

    const createCategory = async (category: string) => {
        if (!listId) return
        return await addCategory(category, listId)
    }

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault()

        const category = newCategory.trim()
        if (category === item.category?.name) return //no change
        setOpen(false)
        if (!category || !listId) return
        const existingCategory = categories.find(c => c.name.trim() === category)
        if (existingCategory) updateItem(listId, item.id, { category: existingCategory })
        else {
            const prevItem = { ...item }
            //optimistically delete old category if there are no items using it
            if (prevItem.category) optimisticDeleteCategoryIfEmpty(listId, prevItem.category.id, item.id)

            //optimically update item with new category
            dispatch({ type: "UPDATE_ITEM", payload: { listId, id: item.id, changes: { category: { id: `temp-${Date.now()}`, name: category } } } })
            //wait for the real category to create then actually update the item
            try {
                const createdCategory = await createCategory(category)
                if (createdCategory?.id) {
                    const result = await updateItem(listId, item.id, { category: createdCategory })
                    if (!result.success) throw new Error
                }
            } catch {
                dispatch({ type: "ADD_CATEGORY", payload: { listId, category: prevItem.category! } }) //re-add old category if it existed               
            }
        }
    }

    const handleTypeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const typed = e.target.value
        const match = typed.length && categories.find(c => c.name.toLowerCase().startsWith(typed.toLowerCase()))

        if (match && match.name.length > typed.length) {
            console.log('dpes this')
            setNewCategory(match.name)
            requestAnimationFrame(() => {
                e.target.setSelectionRange(typed.length, match.name.length)
            })
        } else setNewCategory(typed)
    }

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (!newCategory) return
        const caretPos = e.currentTarget.selectionStart
        setNewCategory(prev => prev.slice(0, (caretPos || 1) - 1))
    }



    return (
        <Box
            as="li"
            py={1}
            px={2}
            borderRadius="sm"
            _hover={{ bg: `gray.100` }}
            transition="all 0.2s"
            borderLeft={(item.lastMinute && !item.checked) ? "3px solid" : undefined}
            borderLeftColor={(item.lastMinute && !item.checked) ? "yellow.400" : undefined}
            bg={(item.lastMinute && !item.checked) ? "yellow.50" : "inherit"}
            opacity={item.checked ? 0.6 : 1}
        >
            <HStack gap={2}>
                <Checkbox.Root
                    checked={item.checked}
                    onCheckedChange={(details) => toggleCheck(details.checked === true, item.id)}
                    size="sm"
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control bg={item.checked ? '' : 'white'} borderWidth={2} />

                </Checkbox.Root>

                <Text
                    flex={1}
                    textDecoration={item.checked ? 'line-through' : 'none'}
                    color={item.checked ? 'gray.500' : 'inherit'}
                >
                    {item.name}
                </Text>

                <Menu.Root open={open} onOpenChange={e => setOpen(e.open)} onHighlightChange={({ highlightedValue }) => { if (highlightedValue && categories.map(c => c.name).includes(highlightedValue)) setNewCategory(highlightedValue) }}>

                    <Menu.Trigger asChild ref={triggerRef} onMouseLeave={handleMouseLeaveMenu} >
                        <Badge colorPalette={item.color} variant="subtle"
                            maxW={isMobile ? "70px" : "150px"} overflow="hidden" textOverflow="ellipsis"
                            display="inline-block"
                        >
                            {item.category ? item.category.name : 'Category'}
                        </Badge>
                    </Menu.Trigger>

                    <Menu.Positioner>
                        <Menu.Content ref={menuRef} onMouseLeave={handleMouseLeaveMenu}>
                            <Menu.Item disabled value='set-category'>
                                <Box as="form" px={2} py={1} onSubmit={handleSubmitCategory}>
                                    <Input
                                        size="sm"
                                        placeholder="Type or pick a category"
                                        value={newCategory}
                                        onChange={(e) => handleTypeCategory(e)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSubmitCategory(e);
                                            if (e.key === "Backspace") handleBackspace(e)
                                            if (e.key === " ") {
                                                e.stopPropagation() // Prevent menu from closing or other interference
                                            }

                                        }}
                                    />
                                </Box>
                            </Menu.Item>
                            <Menu.Separator />
                            {categories.filter(cat => cat.id !== item.category?.id).map(category => (
                                <Menu.Item
                                    key={category.id}
                                    value={category.name}
                                    onClick={() => onSetCategory(category, item.id)}
                                >
                                    {category.name}
                                </Menu.Item>
                            ))}
                            <Menu.Separator />
                            <Menu.Item value='remove-category' onClick={() => onSetCategory(null, item.id)}>
                                Remove category
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Menu.Root>
                <HStack gap={1} opacity={isMobile ? 1 : 0} _groupHover={{ opacity: 1 }}>

                    {/** LAST MINUTE TOGGLE */}
                    <Tooltip content={!item.lastMinute ? "Mark as last minute" : "Unmark last minute"} >
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => toggleLastMinute(item.lastMinute, item.id)}
                            _hover={{ bg: 'transparent' }}
                            p={0}
                        >
                            <Icon fill={item.lastMinute ? 'inherit' : 'none'}><Zap /></Icon>
                        </Button>
                    </Tooltip>

                    {/** DELETE ITEM */}
                    <Tooltip content="Delete Item">
                        <IconButton size="xs"
                            variant="ghost"
                            _hover={{ bg: 'transparent' }}
                            onClick={handleDeleteItem}
                            p={0}
                        >
                            <Trash />
                        </IconButton>
                    </Tooltip>
                </HStack>
            </HStack>
        </Box>
    );
};

export default ListItem;