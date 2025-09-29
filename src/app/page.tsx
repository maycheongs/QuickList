'use client';

import { ApolloWrapper } from '@/components/ApolloWrapper';
import { AppDataProvider } from '@/contexts/AppContext';
import HomeContent from '@/components/Home';

export default function HomePage() {

  return (
    <ApolloWrapper>
      <AppDataProvider>
        <HomeContent />
      </AppDataProvider>
    </ApolloWrapper>
  );
}
