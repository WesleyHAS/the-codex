import { useQuery, useMutation } from "@apollo/client";
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
  Grid,
  Flex,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GET_ALL_SNIPPETS } from "../utils/queries";
import MainSnippetPreview from "../components/Snippet/MainSnippetPreview.jsx";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import {
  ADD_PROPS,
  ADD_DROPS,
  REMOVE_PROPS,
  REMOVE_DROPS,
} from "../utils/mutations";
import Auth from "../utils/auth";

export default function UserSnippets() {
  // set state for Tags
  const [showTagsSection, setShowTagsSection] = useState(false);
  // const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  // sample tags
  const availableTags = [
    "3D Printing",
    "AI Markup Language (AIML)",
    "Assembly",
    "Augmented Reality (AR)",
    "Blockchain",
    "Cloud Computing",
    "Concurrent",
    "Configuration Management",
    "Containerization and Orchestration",
    "Data Science",
    "Database Query",
    "Desktop App",
    "Distributed Systems",
    "Domain-Specific Language (DSL)",
    "Educational",
    "Embedded Systems",
    "Framework",
    "Functional Programming",
    "Game Dev",
    "Graph Query",
    "Hardware Description Language (HDL)",
    "IoT Programming",
    "Logic",
    "Machine Learning",
    "Markup",
    "Mobile App Dev",
    "Networking",
    "Parallel",
    "Robotics",
    "Scientific Computing",
    "Scripting",
    "Serverless Computing",
    "Virtual Reality (VR)",
    "Web API",
    "Web Dev",
    "Web Security",
  ];

  // PROPS AND DROPS MUTATIONS
  // mutation to add props, with refetch to update cache to reflect new props
  const [addProps] = useMutation(ADD_PROPS, {
    refetchQueries: [{ query: GET_ALL_SNIPPETS }],
  });

  //mutation to add drops, with refetch to update cache to reflect new drops
  const [addDrops] = useMutation(ADD_DROPS, {
    refetchQueries: [{ query: GET_ALL_SNIPPETS }],
  });

  //mutation to remove props, to calculate overall props when snippet is dropped
  const [removeProps] = useMutation(REMOVE_PROPS);

  //mutation to remove drops, to calculate overall props when snippet is propped
  const [removeDrops] = useMutation(REMOVE_DROPS);

  //QUERY TO GET ALL SNIPPETS
  const { loading, error, data, refetch } = useQuery(GET_ALL_SNIPPETS);

  //refetch all snippets using updated tags upon state change
  useEffect(() => {
    if (loading) return; //eject from function if the page is still loading

    refetch({ tags: selectedTags });
  }, [selectedTags, refetch, loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const snippets = data?.allSnippets;

  let username; //variable to hold user's username

  //attempts to retrieve username from JWT
  try {
    //gets current user's username
    username = Auth.getProfile()?.data?.username;
  } catch (
    error //empty error block (this is just here to ensure the page still renders even if a user is not logged in)
  ) {}

  //PROPS AND DROPS HANDLERS

  //PROP A SNIPPET
  const handleAddProps = async (snippetId) => {
    if (username) {
      try {
        // was getting undefined error, chatgpt suggested this fix
        // preform the addProps mutation
        await addProps({
          variables: {
            username: username,
            snippetId: snippetId,
          },
        });
      } catch (err) {
        console.error("Error propping snippet", err);
      }
    }
  };

  //DROP A SNIPPET
  const handleAddDrops = async (snippetId) => {
    if (username) {
      try {
        await addDrops({
          variables: {
            username: username,
            snippetId: snippetId,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  //REMOVE PROPS FROM A SNIPPET
  const handleRemoveProps = async (snippetId) => {
    if (username) {
      try {
        await removeProps({
          variables: {
            username: username,
            snippetId: snippetId,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  //REMOVE DROPS FROM A SNIPPET
  const handleRemoveDrops = async (snippetId) => {
    if (username) {
      try {
        await removeDrops({
          variables: {
            username: username,
            snippetId: snippetId,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleTags = () => {
    setShowTagsSection(!showTagsSection);
  };

  const handleTagChange = async (tag) => {
    const isTagSelected = selectedTags.includes(tag);

    if (isTagSelected) {
      // Tag is already selected, remove it
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      // Tag is not selected, add it
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
    }
  };

  return (
    <>
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
            {/* Toggle Tags Section */}
            <Box w="full">
              <Button variant="secondary" onClick={handleToggleTags} size="sm">
                {showTagsSection ? "Hide Tags" : "Select Tags"}
              </Button>
              {showTagsSection && (
                <Grid
                  marginTop={2}
                  templateColumns="repeat(3, 1fr)"
                  gap={2}
                >
                  {availableTags.map((tag, index) => (
                    <Checkbox
                      colorScheme="purple"
                      size="md"
                      color="codex.accents"
                      key={index}
                      isChecked={selectedTags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      marginRight={2} // adds margin between tags
                    >
                      {tag}
                    </Checkbox>
                  ))}
                </Grid>
              )}
            </Box>

            <Divider my={1} borderColor="codex.highlights" />

            <Box
              w="full"
              border="1px solid"
              borderColor="codex.borders"
              borderRadius="lg"
              bg="codex.darkest"
            >
              {snippets?.map((snippet, index) => (
                <Box
                  key={index}
                  pb="5"
                  w="full"
                  borderBottom="1px solid"
                  borderColor="codex.borders"
                >
                  <Link to={`/individual-snippets/${snippet._id}`}>
                    <MainSnippetPreview snippet={snippet} />
                  </Link>
                  <HStack color="codex.text">
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleAddDrops(snippet._id)}
                    >
                      <Icon as={FaAngleDoubleDown} w={8} h={8} ml="2" />
                    </Button>
                    <Text color="codex.highlights" fontSize="sm">
                      Props: {snippet.overallProps}
                    </Text>
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleAddProps(snippet._id)}
                    >
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
