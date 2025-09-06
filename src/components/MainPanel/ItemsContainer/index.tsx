//components/MainPanel/ItemsContainer

import { GetListQuery } from '@/graphql/codegen';
import { Box, VStack } from '@chakra-ui/react';
import CategorySection from './CategorySection';
import AddItemBar from '../AddItemBar';

export type Item = NonNullable<GetListQuery['list']>['items'][0] & { color?: string; };

interface OrganizedItems {
    categorized: Record<string, Item[]>;
    uncategorized: Item[];
    lastMinute: Item[];
    checked: Item[];
}

interface ItemsContainerProps {
    items: Item[],
    categories?: NonNullable<GetListQuery['list']>['categories']
};


const categoryColors = ['blue', 'green', 'purple', 'red', 'orange', 'pink', 'yellow', 'teal', 'cyan', 'gray'];


const ItemsContainer = ({ items, categories }: ItemsContainerProps) => {


    const categoryColorMap: Record<number, string> = {};
    (categories || []).forEach((cat, idx) => {
        categoryColorMap[cat.id] = categoryColors[idx % categoryColors.length];
    });

    const { categorized, uncategorized, lastMinute, checked } = organizeItems(items);

    function organizeItems(items: Item[]): OrganizedItems {
        const categorized: Record<string, Item[]> = {};
        const uncategorized: Item[] = [];
        const lastMinute: Item[] = [];
        const checked: Item[] = [];

        items.forEach(obj => {
            let item = { ...obj }; // Create a mutable copy of the item

            if (item.category) {
                item.color = categoryColorMap[item.category.id]
            }

            if (item.checked || (item.lastMinute && item.checked)) {
                checked.push(item);
            } else if (item.lastMinute) {
                lastMinute.push(item);
            } else if (item.category) {
                const categoryKey = `${item.category.id}-${item.category.name}`
                if (!categorized[categoryKey]) {
                    categorized[categoryKey] = [];
                }
                categorized[categoryKey].push(item);
            } else {
                uncategorized.push(item);
            }
        });


        return { categorized, uncategorized, lastMinute, checked };
    };
    return (
        <Box as="section" flex={1} overflowY="auto" py={2} px={5} bg='gray.200' height='100%'>
            <VStack gap={0} align="stretch">
                {/* Uncategorized */}
                {uncategorized.length ?
                    <CategorySection
                        categoryKey={null}
                        items={uncategorized}
                        color='gray'

                    /> : ''}

                {/* Categories */}
                {Object.keys(categorized).length ?
                    Object.entries(categorized).map(([categoryKey, items], index) => (
                        <CategorySection
                            categoryKey={categoryKey}
                            items={items}
                            color={categoryColorMap[Number(categoryKey.split('-')[0])]}
                        />
                    )) : ''}



                {/* Last Minute */}
                {lastMinute.length ?
                    <CategorySection
                        items={lastMinute}
                        isLastMinute={true}
                        color='gray'
                    /> : ''}

                {/* Checked Items */}
                {checked.length ? (
                    <CategorySection
                        items={checked}
                        isChecked={true}
                        color='gray'
                    />
                ) : ''}
            </VStack>
            <AddItemBar onAddItem={() => { }} />
        </Box>
    )
}

export default ItemsContainer;