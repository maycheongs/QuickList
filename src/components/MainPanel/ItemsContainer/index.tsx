//components/MainPanel/ItemsContainer
import { useRef, useState, useEffect } from 'react';
import { GetListQuery } from '@/graphql/codegen';
import { Box, VStack } from '@chakra-ui/react';
import CategorySection from './CategorySection';
import AddItemBar from './AddItemBar';
import { useAppData } from '@/contexts/AppContext';


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

    const containerRef = useRef<HTMLDivElement | null>(null)

    const { items, categories } = list
    const { isMobile } = useAppData()
    const [keyboardHeight, setKeyboardHeight] = useState(0)


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
            const item = { ...obj }; // Create a mutable copy of the item

            if (item.category) {
                item.color = categoryColorMap[item.category.id]
            }

            if (item.checked || (item.lastMinute && item.checked)) {
                checked.push(item);
            } else if (item.lastMinute) {
                lastMinute.push(item);
            } else if (item.category) {
                const categoryId = item.category.id

                if (!categorized[categoryId]) {
                    categorized[categoryId] = [];
                }
                categorized[categoryId].push(item);
            } else {
                uncategorized.push(item);
            }
        });


        return { categorized, uncategorized, lastMinute, checked };
    };

    // VisualViewport handling
    // -------------------------
    useEffect(() => {
        if (!list || !isMobile) return;

        const onViewportResize = () => {
            if (window.visualViewport) {
                const vh = window.innerHeight;
                const visualHeight = window.visualViewport.height;
                const keyboard = vh - visualHeight;
                setKeyboardHeight(keyboard > 0 ? keyboard : 0);
            }
        };

        window.visualViewport?.addEventListener('resize', onViewportResize);
        window.addEventListener('resize', onViewportResize); // fallback

        return () => {
            window.visualViewport?.removeEventListener('resize', onViewportResize);
            window.removeEventListener('resize', onViewportResize);
        };
    }, [isMobile]);
    return (
        <Box as="section" flex={1} py={2} px={5} pr={isMobile ? 1 : 5} position="relative" overflow="hidden">
            <Box ref={containerRef} overflowY="auto" height="100%" pb={isMobile ? `${keyboardHeight + 16}px` : 16}>
                <VStack gap={0} align="stretch">
                    {/* Uncategorized */}
                    {uncategorized.length ?
                        <CategorySection
                            categoryId={null}
                            items={uncategorized}
                            color='gray'
                            categories={categories}

                        /> : ''}

                    {/* Categories */}
                    {Object.keys(categorized).length ?
                        Object.entries(categorized).sort().map(([categoryId, items], index) => (
                            <CategorySection
                                key={index}
                                categoryId={categoryId}
                                listId={list!.id}
                                items={items}
                                color={categoryColorMap[categoryId]}
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
            <AddItemBar categories={categories} listId={list.id} containerRef={containerRef} />
        </Box>
    )
}

export default ItemsContainer;