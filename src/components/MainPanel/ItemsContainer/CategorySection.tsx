//components/MainPanel/ItemsContainer/CategorySection.tsx
'use client';
import { Box, VStack, Badge } from '@chakra-ui/react';
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
        <Box py={1} >
            {(categoryKey || isChecked || isLastMinute) ?
                <Badge mb={1} size='md' bg={`${color}.100`} fontWeight='400'>
                    {categoryName || (isLastMinute ? 'Last Minute' : 'Completed')}
                </Badge> : ''}
            <VStack as="ul" gap={1} align="stretch" className="group">
                {items.map(item => (
                    <ListItem
                        key={item.id}
                        item={item}
                        onToggleCheck={(item) => { console.log('toggle check', item) }}
                        onToggleLastMinute={(item) => { console.log('toggle last minute', item) }}
                        onSetCategory={(cat) => console.log('Set category', cat)}
                        categories={categories}
                        color={color}
                    />
                ))}
            </VStack>
        </Box>
    )

}

export default CategorySection;