//src/components/SidePanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { VStack, Heading, Box, HStack, Separator, Button, Text, IconButton, Menu, Portal } from '@chakra-ui/react';
import { ListPlus } from 'lucide-react'
import { useAppData } from '@/contexts/AppContext';
import { useAddList, useDeleteList } from '@/contexts/AppDataOperations';

interface SidePanelProps {
    lists: { id: string; name: string; dueDate?: string | null }[];
    selectedListId: string | null;
}


export default function SidePanel({ lists, selectedListId }: SidePanelProps) {
    const { state, error, loading, setSelectedList } = useAppData();
    const [addDisabled, setAddDisabled] = useState(false)
    //right-click menu
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [menuListId, setMenuListId] = useState<string | null>(null);


    const addList = useAddList()
    const deleteList = useDeleteList()
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const generateUntitledName = (existingNames: string[]) => {
        const baseName = "Untitled";
        if (!existingNames.includes(baseName)) return baseName;

        let counter = 1;
        let newName = `${baseName} (${counter})`;
        while (existingNames.includes(newName)) {
            counter++;
            newName = `${baseName} (${counter})`;
        }
        return newName;
    };

    // Prevent scrolling when the menu is open
    useEffect(() => {
        const preventScroll = (e: WheelEvent) => {
            if (menuPosition) {
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        return () => {
            window.removeEventListener('wheel', preventScroll);
        };
    }, [menuPosition]);

    const onAddList = async () => {
        setAddDisabled(true)
        const existingNames = lists.map(l => l.name);
        const response = await addList(generateUntitledName(existingNames))
        setAddDisabled(false)
    }

    const handleRightclick = (e: React.MouseEvent, listId: string) => {
        e.preventDefault();
        // console.log('right click on list', listId);
        // Get the bounding rectangle of the clicked element
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate the center of the element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + 5;
        setMenuPosition({ x: centerX, y: centerY });
        setMenuListId(listId);
    }

    const handleRightClickClose = () => {
        setMenuPosition(null);
        setMenuListId(null);
    }

    const handleDeleteList = () => {
        console.log('delete list', menuListId);
        menuListId && deleteList(menuListId)
    }

    return (
        <VStack as="nav" gap={1} align="stretch" p={4} height='100%' overflowY="auto" fontSize={'sm'} minWidth={150}>
            <HStack gap={2} justify='space-between' pr={3} pb={2}>
                <Heading size="lg">My Lists</Heading>
                <IconButton disabled={addDisabled} display={{ base: "none", sm: "block" }} variant='ghost' aria-label="add-list" onClick={onAddList}><ListPlus /></IconButton>
            </HStack>
            <Box mt={2} display={{ base: "block", sm: "none" }}>
                <Separator />
                <Box px={2} py={2}><HStack justify='space-between'><Text fontWeight='semibold'>Add Item</Text> <ListPlus /></HStack></Box>
                <Separator />
            </Box>
            {lists.map((list) => (
                <Box
                    key={list.id}
                    p={2}
                    pl={3}
                    borderRadius="md"
                    cursor="pointer"
                    data-selected={selectedListId === list.id ? "" : undefined}
                    _selected={{
                        bg: "blue.50",
                        color: "blue.700",
                        fontWeight: "semibold",
                        _hover: {
                            bg: "blue.50",
                        },
                    }}
                    onClick={() => setSelectedList(list.id)}
                    onContextMenu={(e) => handleRightclick(e, list.id)}
                    _hover={{
                        bg: "gray.100"
                    }}
                >
                    {list.name}
                </Box>
            ))}

            {menuPosition && menuListId && (

                <Portal>
                    <Menu.Root
                        open={true}
                        onOpenChange={(details) => {
                            if (!details.open) {
                                handleRightClickClose();
                            }
                        }}
                    >
                        <Menu.Positioner>
                            <Menu.Content
                                style={{
                                    position: 'fixed',
                                    top: `${menuPosition.y}px`,
                                    left: `${menuPosition.x}px`,
                                }}
                            >
                                <Menu.Item onClick={handleDeleteList} value={`delete-${menuListId}`}>
                                    Delete List
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Menu.Root>
                </Portal>

            )}

        </VStack>
    );
}
