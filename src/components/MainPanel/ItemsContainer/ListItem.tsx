
import { useState, useRef } from 'react';
import { Box, HStack, Text, Checkbox, Badge, Button, IconButton, Menu, Icon } from '@chakra-ui/react';
import { Settings, Zap } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

import { Item } from '.';
import { clear } from 'console';

interface ListItemProps {
    item: Item;
    onToggleCheck: (itemId: number) => void;
    onToggleLastMinute: (itemId: number) => void;
    onSetCategory: (itemId: number, category: string | null) => void;
    categories: { id: number; name: string }[];
    color?: string;
}


const ListItem = ({ item, onToggleCheck, onToggleLastMinute, onSetCategory, categories, color }: ListItemProps) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null); //access DOM elements directly
    const menuRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);



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




    return (
        <Box
            as="li"
            py={1}
            px={2}
            borderRadius="sm"
            _hover={{ bg: `whiteAlpha.800` }}
            transition="all 0.2s"
            bg={`whiteAlpha.700`}
        >
            <HStack gap={3}>
                <Checkbox.Root
                    checked={item.checked}
                    onCheckedChange={() => onToggleCheck(item.id)}
                    size="sm"
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control bg={item.checked ? '' : 'white'} borderWidth={2} />

                </Checkbox.Root>

                <Text
                    flex={1}
                    textDecoration={item.checked ? 'line-through' : 'none'}
                    color={item.checked ? 'gray.500' : 'gray.900'}
                >
                    {item.name}
                </Text>

                {(item.category && (item.checked || item.lastMinute)) ? (
                    <Badge colorPalette={item.color} variant="subtle">
                        {item.category.name}
                    </Badge>
                ) : ''}

                <HStack gap={1} opacity={0} _groupHover={{ opacity: 1 }}>
                    <Tooltip content={!item.lastMinute ? "Mark as last minute" : "Unmark last minute"} >

                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => onToggleLastMinute(item.id)}
                            _hover={{ bg: 'transparent' }}
                        >
                            <Icon fill={item.lastMinute ? 'inherit' : 'none'}><Zap /></Icon>
                        </Button>

                    </Tooltip>

                    <Menu.Root open={open} onOpenChange={e => setOpen(e.open)}>

                        <Menu.Trigger asChild ref={triggerRef} onMouseLeave={handleMouseLeaveMenu} >
                            <IconButton variant="ghost" size="xs" _hover={{ bg: 'transparent' }} _expanded={{ bg: 'transparent' }}>
                                <Icon ><Settings /></Icon>
                            </IconButton>
                        </Menu.Trigger>
                        <Menu.Positioner>
                            <Menu.Content ref={menuRef} onMouseLeave={handleMouseLeaveMenu}>
                                <Menu.Item disabled value='set-category'>
                                    <Text fontSize="xs" fontWeight="medium" color="gray.500">
                                        Set Category
                                    </Text>
                                </Menu.Item>
                                <Menu.Separator />
                                {categories.map(category => (
                                    <Menu.Item
                                        value={category.name}
                                        onClick={() => onSetCategory(item.id, category.name)}
                                    >
                                        {category.name}
                                    </Menu.Item>
                                ))}
                                <Menu.Separator />
                                <Menu.Item value='remove-category' onClick={() => onSetCategory(item.id, null)}>
                                    Remove category
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>

                    </Menu.Root>
                </HStack>
            </HStack>
        </Box>
    );
};

export default ListItem;