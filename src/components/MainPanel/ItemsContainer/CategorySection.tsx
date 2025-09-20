//components/MainPanel/ItemsContainer/CategorySection.tsx
'use client';
import { Box, VStack, HStack, Badge, Separator } from '@chakra-ui/react';
import ListItem from './ListItem'
import { Item } from '.';
import { useListDataState } from '@/contexts/list-data/ListDataContext';

type CategorySectionProps = {
    categoryKey?: string | null;
    items: Item[]
    isLastMinute?: boolean;
    isChecked?: boolean;
    color: string;
};

function CategorySection({ categoryKey, items, isChecked, isLastMinute, color }: CategorySectionProps) {

    // console.log('ischecked', isChecked, 'items', items);

    const { categories } = useListDataState()

    const [categoryId, categoryName] = categoryKey ? categoryKey.split('_') : [null, null];


    return (
        <Box py={1} color='gray.500'>
            {(categoryKey || isChecked || isLastMinute) ?
                <><HStack mb={2}>
                    <Box
                        fontWeight={'semibold'}
                        borderLeftWidth="3px"
                        borderLeftStyle="solid"
                        borderLeftColor={`${color}.400`}
                        pl={2}

                    >
                        {(categoryName || (isLastMinute ? 'Last Minute' : 'Completed')).toUpperCase()}
                    </Box>
                    <Badge size='sm' fontWeight='500' fontSize={11} color='inherit'>
                        {`${items.length} items`}
                    </Badge>

                </HStack><Separator mb={1} /></> : ''}

            <VStack as="ul" gap={1} align="stretch" className="group">
                {items.map(item => (
                    <ListItem
                        key={item.id}
                        item={item}
                        onToggleCheck={(item) => { console.log('toggle check', item) }}
                        onToggleLastMinute={(item) => { console.log('toggle last minute', item) }}
                        categories={categories}
                        color={color}
                    />
                ))}
            </VStack>
        </Box>
    )

}

export default CategorySection;