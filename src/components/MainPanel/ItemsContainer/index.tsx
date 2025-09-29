//components/MainPanel/ItemsContainer

import { GetListQuery } from '@/graphql/codegen';
import { Box, VStack } from '@chakra-ui/react';
import CategorySection from './CategorySection';
import AddItemBar from './AddItemBar';


export type Item = NonNullable<GetListQuery['list']>['items'][0] & { color?: string; };
export type Category = NonNullable<GetListQuery['list']>['categories'][0];
export type List = NonNullable<GetListQuery['list']>;

interface OrganizedItems {
    categorized: Record<string, Item[]>;
    uncategorized: Item[];
    lastMinute: Item[];
    checked: Item[];
}


const categoryColors = ['blue', 'green', 'purple', 'red', 'orange', 'pink', 'yellow', 'teal', 'cyan', 'gray'];

interface ItemsContainerProps {
    list: List;
}

const ItemsContainer = ({ list }: ItemsContainerProps) => {

    const { items, categories } = list


    const categoryColorMap: Record<Category['id'], string> = {};
    (categories || []).forEach((cat, idx) => {
        categoryColorMap[cat.id] = categoryColors[idx % categoryColors.length];
    });

    const { categorized, uncategorized, lastMinute, checked } = organizeItems(items || []);

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
                const categoryKey = `${item.category.id}_${item.category.name}`
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
        <Box as="section" flex={1} py={2} px={5} position="relative" overflow="hidden">
            <Box overflowY="auto" height="100%" pb={16}>
                <VStack gap={0} align="stretch">
                    {/* Uncategorized */}
                    {uncategorized.length ?
                        <CategorySection
                            categoryKey={null}
                            items={uncategorized}
                            color='gray'
                            categories={categories}

                        /> : ''}

                    {/* Categories */}
                    {Object.keys(categorized).length ?
                        Object.entries(categorized).sort().map(([categoryKey, items], index) => (
                            <CategorySection
                                categoryKey={categoryKey}
                                items={items}
                                color={categoryColorMap[(categoryKey.split('_')[0])]}
                                categories={categories}
                            />
                        )) : ''}



                    {/* Last Minute */}
                    {lastMinute.length ?
                        <CategorySection
                            items={lastMinute}
                            isLastMinute={true}
                            color='gray'
                            categories={categories}
                        /> : ''}

                    {/* Checked Items */}
                    {checked.length ? (
                        <CategorySection
                            items={checked}
                            isChecked={true}
                            color='gray'
                            categories={categories}
                        />
                    ) : ''}
                </VStack>
            </Box>
            <AddItemBar categories={categories} listId={list.id} />
        </Box>
    )
}

export default ItemsContainer;