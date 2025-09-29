//src/components/MainPanel/ListHeader.tsx

import { useState, useEffect, forwardRef, useRef } from 'react';
import { OptimisticList } from '@/contexts/types'
import { Box, Heading, HStack, VStack, IconButton, Text, Editable } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { useUpdateList } from '@/contexts/AppDataOperations';
import { useAppData } from '@/contexts/AppContext';
import 'react-datepicker/dist/react-datepicker.css';


interface ListHeaderProps {
    list: Partial<OptimisticList> | null;
}


const CustomInput = forwardRef(({ value, onClick, onClear }: any, ref: any) => {
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
                ref={ref}
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
    const [listDueDate, setDueDate] = useState<Date | null>(list?.dueDate ? (new Date(Number(list.dueDate)) || null) : null);

    useEffect(() => {

        console.log('list changed, list.IsNew: ', list?.isNew);
        setIsEditing(list?.isNew || false);

        return () => {
            setIsEditing(false);
        }

    }, [list?.id])


    const changeDueDate = (date: Date | null) => {
        setDueDate(date);
        // console.log('new date', date);
        // updateList
    };
    // console.log('duedate', list.dueDate);
    const handleSetTitle = (newTitle: string) => {
        setTitle(newTitle);
        // updateList
    }

    return (
        <Box py={3} px={6} borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} bg="background" zIndex='docked' opacity='0.98'>
            <VStack gap={2} align="start">

                <Editable.Root
                    value={title} onValueChange={(e) => handleSetTitle(e.value)} placeholder="List Name"
                >
                    <Editable.Preview fontSize='2xl' fontWeight={'bold'} />
                    <Editable.Input fontSize='2xl' fontWeight={'bold'} />
                </Editable.Root>

                <DatePicker
                    selected={dueDate}
                    onChange={changeDueDate}
                    customInput={<CustomInput onClear={() => setDueDate(null)} />}
                    dateFormat="Pp"
                    showTimeSelect
                />

            </VStack>
        </Box>
    )

}

export default ListHeader;