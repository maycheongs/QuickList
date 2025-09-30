//src/components/SidePanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { VStack, Heading, Box, HStack, Separator, Spacer, IconButton, Menu, Portal } from '@chakra-ui/react';
import { ListPlus, Trash2 } from 'lucide-react'
import { useAppData } from '@/contexts/AppContext';
import { useAddList, useDeleteList } from '@/contexts/AppDataOperations';

interface SidePanelProps {
    lists: { id: string; name: string; dueDate?: Date | null }[];
    selectedListId: string | null;
}


export default function SidePanel({ lists, selectedListId }: SidePanelProps) {
    const { state, error, loading, setSelectedList, isMobile } = useAppData();
    const addList = useAddList()
    const deleteList = useDeleteList()

    const [addDisabled, setAddDisabled] = useState(false)
    //right-click menu
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [menuListId, setMenuListId] = useState<string | null>(null);


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



    const onAddList = async () => {
        setAddDisabled(true)
        const existingNames = lists.map(l => l.name);
        await addList(generateUntitledName(existingNames))
        setAddDisabled(false)
    }

    const handleRightclick = (e: React.MouseEvent, listId: string) => {
        e.preventDefault();
        // console.log('right click on list', listId);
        // Get the bounding rectangle of the clicked element
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate the center of the element
        const centerX = isMobile ? rect.left - 80 : rect.left + rect.width / 2;
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
                <Heading size={isMobile ? "2xl" : "lg"} ml={2}>My Lists</Heading>
                {<IconButton size={isMobile ? "2xl" : "lg"} disabled={addDisabled} variant='ghost' aria-label="add-list" onClick={onAddList}><ListPlus /></IconButton>}
            </HStack>

            {isMobile ? <Separator /> : ''}

            {lists.map((list) => (
                <>
                    <HStack key={list.id} justify="space-between" align='stretch' onContextMenu={(e) => handleRightclick(e, list.id)} onClick={() => setSelectedList(list.id)} fontSize={isMobile ? 16 : 'inherit'}>
                        <Box
                            flex={1}
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

                            _hover={{
                                bg: "gray.100"
                            }}

                        >

                            {list.name}
                        </Box>

                        {isMobile ?
                            <>
                                {/* <Spacer /> */}
                                <IconButton onClick={(e) => { e.stopPropagation(); handleRightclick(e, list.id) }} variant='ghost' size='xs' opacity={0.5} pt={2}><Trash2 /></IconButton>

                            </>
                            : ''}



                    </HStack>
                    {isMobile ? <Separator /> : ''}
                </>

            ))}
            {/* {isMobile ?
                <Box mt={2} >
                    <Separator />
                    <Box px={2} py={2} onClick={onAddList}><HStack justify='space-between'><Text fontWeight='semibold'>Add List</Text> <ListPlus /></HStack></Box>
                    <Separator />
                </Box> : ''} */}

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
