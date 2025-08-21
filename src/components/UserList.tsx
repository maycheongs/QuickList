"use client";

import { useQuery, gql } from "@apollo/client";
import { VStack, Text, Spinner } from "@chakra-ui/react";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export default function UserList() {
    const { data, loading, error } = useQuery(GET_USERS);

    if (loading) return <Spinner />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <VStack align="start" gap={2}>
            {data.users.map((user: any) => (
                <Text key={user.id}>
                    {user.name} ({user.email})
                </Text>
            ))}
        </VStack>
    );
}
