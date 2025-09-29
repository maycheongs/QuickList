//components/MainPanel/ItemsContainer/CategorySection.tsx
'use client';
import { Box, VStack, HStack, Badge, Separator } from '@chakra-ui/react';
import ListItem from './ListItem'
import { Item } from '.';
import { useAppData } from '@/contexts/AppContext';


type CategorySectionProps = {
    categoryKey?: string | null;
    items: Item[]
    isLastMinute?: boolean;
    isChecked?: boolean;
    color: string;
    categories: { id: string; name: string }[]
};

function CategorySection({ categoryKey, items, isChecked, isLastMinute, color, categories }: CategorySectionProps) {

    const { dispatch } = useAppData();

    // console.log('ischecked', isChecked, 'items', items);

    const [categoryId, categoryName] = categoryKey ? categoryKey.split('_') : [null, null];

    const optimisticDeleteCategoryIfEmpty = (listId: string, categoryId: string, itemId: string) => {
        //check if any items are using this category
        const stillInUse = items.some(item => item.category?.id === categoryId && item.id !== itemId);
        if (!stillInUse) {
            dispatch({ type: "DELETE_CATEGORY", payload: { listId, id: categoryId } })
        }
    }


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
                        categories={categories}
                        optimisticDeleteCategoryIfEmpty={optimisticDeleteCategoryIfEmpty}
                    />
                ))}
            </VStack>
        </Box>
    )

}

export default CategorySection;