
import { useState, forwardRef } from 'react';
import { GetListQuery } from '@/graphql/codegen'
import { Box, Heading, HStack, VStack, IconButton, Text } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface ListHeaderProps {
    list: NonNullable<GetListQuery['list']>;
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
                > <Calendar />
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
            >
                <span style={{ display: "inline-flex", verticalAlign: "bottom" }}><Calendar /></span> Due: {value}
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
    console.log('list in header', list, 'date', list?.dueDate);

    const [dueDate, setDueDate] = useState<Date | null>(list.dueDate ? (new Date(Number(list.dueDate)) || null) : null);
    const changeDueDate = (date: Date | null) => {
        setDueDate(date);
        console.log('new date', date);
        // updateList
    };
    console.log('duedate', list.dueDate);

    return (
        <Box py={3} px={6} borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} bg="background" zIndex='docked' opacity='0.98'>
            <VStack gap={4} align="start">
                <Heading size="xl" fontWeight='bold'>{list.name}</Heading>
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