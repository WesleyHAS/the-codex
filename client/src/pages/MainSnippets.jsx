import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  HStack,
  Heading,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { GET_ALL_SNIPPETS } from "../utils/queries";
import MainSnippetPreview from "../components/Snippet/MainSnippetPreview.jsx";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { useState } from "react";

export default function UserSnippets() {
  // const { loading, error, data } = useQuery(GET_ALL_SNIPPETS);

  //SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, data } = useQuery(GET_ALL_SNIPPETS, {
    variables: { searchTerm },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const snippets = data.allSnippets;
  // console.log("these are the snippets", snippets)

  return (
    <>
      <Box>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search Bar */}
      </Box>
      <Box
        p="50"
        d="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          w="full"
          maxW="5xl"
          mx="auto"
          p="8"
          alignItems="start"
        >
          {/* Profile Section on the Left */}
          {/* <VStack spacing="4" align="center" mr={{ md: "8" }}>
          <Avatar src="/path-to-avatar-image.jpg" size="xl" />
          <Heading as="h3">Username</Heading>
        </VStack> */}
          <VStack
            spacing="4"
            w="full"
            maxW="5xl"
            mx="auto"
            p="8"
            color="codex.accents"
          >
            <Box
              w="full"
              border="1px solid"
              borderColor="codex.borders"
              borderRadius="lg"
              bg="codex.darkest"
            >
              {snippets.map((snippet, index) => (
                <Box
                  key={index}
                  pb="5"
                  w="full"
                  borderBottom="1px solid"
                  borderColor="codex.borders"
                >
                  <Link to={`/snippet/${snippet._id}`}>
                    <MainSnippetPreview snippet={snippet} />
                  </Link>
                  <HStack color="codex.text">
                    <Button variant="icon" size="sm">
                      <Icon as={FaAngleDoubleDown} w={8} h={8} mr="2" />
                    </Button>
                    <Text color="codex.highlights" fontSize="sm">
                      Props:
                    </Text>
                    <Button variant="icon" size="sm">
                      <Icon as={FaAngleDoubleUp} w={8} h={8} mr="2" />
                    </Button>
                  </HStack>
                </Box>
              ))}
            </Box>
          </VStack>
        </Flex>
      </Box>
    </>
  );
}
