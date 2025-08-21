import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import type { AppProps } from 'next/app';

const client = new ApolloClient({
    link: new HttpLink({ uri: '/api/graphql' }),
    cache: new InMemoryCache(),
});



export default client