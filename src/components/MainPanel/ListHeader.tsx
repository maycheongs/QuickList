//src/components/MainPanel/ListHeader.tsx

import { useState, useEffect, forwardRef } from 'react';
import { OptimisticList } from '@/contexts/types'
import { Box, HStack, VStack, IconButton, Text, Editable } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { useUpdateList } from '@/contexts/AppDataOperations';
import { useAppData } from '@/contexts/AppContext';
import 'react-datepicker/dist/react-datepicker.css';


const MAX_LENGTH = 80 // MAX LENGTH OF A TITLE

interface ListHeaderProps {
    list: Partial<OptimisticList> | null;
}

interface CustomInputProps {
    value?: string;
    onClick?: () => void;
    onClear: () => void;
}


const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(function CustomInput({ value, onClick, onClear }, ref) {
    if (!value) {
        // No date yet → show icon with tooltip
        return (
            <Tooltip content="Set a due date & time" showArrow>
                <IconButton
                    aria-label="Select date"
                    onClick={onClick}
                    ref={ref}
                    variant="outline"
                    size="sm"
                > <CalendarDays />
                </IconButton>
            </Tooltip>
        );
    }

    // Date selected → show inline text
    return (
        <HStack gap={1}>
            <Text
                onClick={onClick}
                ref={ref as React.Ref<HTMLParagraphElement>}
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                color='gray.600'
            >
                <span style={{ display: "inline-flex", verticalAlign: "bottom" }}><CalendarDays /></span> Due: {value}
            </Text>
            <IconButton
                aria-label="Clear date"
                size="xs"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation(); // prevent opening datepicker
                    onClear();
                }}
            ><span>x</span></IconButton>
        </HStack>
    );
});

const ListHeader = ({ list }: ListHeaderProps) => {
    const updateList = useUpdateList()
    const { state } = useAppData();
    const [title, setTitle] = useState(list?.name || '');
    const [isEditing, setIsEditing] = useState(list?.isNew || false);
    console.log('duedate', list?.dueDate)
    const [listDueDate, setDueDate] = useState<Date | null>(list?.dueDate ? new Date(list.dueDate) : null);

    useEffect(() => {

        console.log('list changed, list.IsNew: ', list?.isNew);
        setIsEditing(list?.isNew || false);

        return () => {
            setIsEditing(false);
        }

    }, [list?.id, list?.isNew])


    const changeDueDate = (date: Date | null) => {
        if (!list?.id) return
        setDueDate(date);
        updateList(list.id, { dueDate: date || null })
    };

    // console.log('duedate', list.dueDate);
    const handleSetTitle = (newTitle: string) => {
        if (!list || !list.id) return;
        setIsEditing(false);
        //if empty reset to previous name
        if (!newTitle.trim()) {
            setTitle(list?.name || '');
            return;
        }
        //if no change, do nothing
        if (newTitle.trim() === list?.name) {
            return;
        }
        //if new name is a duplicate, append (1)
        const existingNames = Object.values(state.lists).map(l => l.name);
        if (existingNames.includes(newTitle.trim())) {
            const baseName = newTitle.trim();
            let name = baseName;
            let counter = 1;
            while (existingNames.includes(name)) {
                name = `${baseName} (${counter})`;
                counter++;
            }
            newTitle = name;
        }
        setTitle(newTitle.trim());
        updateList(list.id, { name: newTitle.trim() });
    }

    const handleValueChange = (value: string) => {

        if (value.length <= MAX_LENGTH) {
            setTitle(value)
        }
    }

    const handleValuePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault(); // prevent default paste
        const paste = e.clipboardData.getData('text');
        const allowedPaste = paste.slice(0, MAX_LENGTH - title.length); // only allow up to max
        handleValueChange(title + allowedPaste)
    }



    return (
        <Box py={3} px={6} borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} bg="background" zIndex='docked' opacity='0.98'>
            <VStack gap={2} align="start">

                <Editable.Root
                    value={title}
                    onValueChange={(e) => handleValueChange(e.value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            handleSetTitle(title);
                        }
                    }}
                    onBlur={() => handleSetTitle(title)}
                    onFocus={() => console.log('editable focus', title)}
                    edit={isEditing}
                    placeholder="List Name"

                >
                    <Editable.Preview fontSize='2xl' fontWeight={'bold'} onClick={() => setIsEditing(true)} />
                    <Editable.Input fontSize='2xl' fontWeight={'bold'} value={title} onPaste={(e) => handleValuePaste(e)} />
                </Editable.Root>

                <DatePicker
                    selected={listDueDate}
                    onChange={changeDueDate}
                    customInput={<CustomInput onClear={() => setDueDate(null)} />}
                    dateFormat="Pp"
                    showTimeSelect
                    popperPlacement={'bottom-start'}

                />

            </VStack>
        </Box>
    )

}

export default ListHeader;