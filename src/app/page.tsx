import { Box, Heading, VStack } from "@chakra-ui/react";
import { ApolloWrapper } from "../components/ApolloWrapper";
import UserList from "../components/UserList";

export default function Home() {
  return (
    <ApolloWrapper>
      <Box p={4}>
        <Heading mb={4}>Users</Heading>
        <VStack gap={4}>
          <UserList />
        </VStack>
      </Box>
    </ApolloWrapper>
  );
}
