'use client';

import { ApolloWrapper } from '@/components/ApolloWrapper';
import { ListProvider } from '@/contexts/ListContext';
import HomeContent from '@/components/Home';

export default function HomePage() {

  return (
    <ApolloWrapper>
      <ListProvider>
        <HomeContent />
      </ListProvider>
    </ApolloWrapper>
  );
}
