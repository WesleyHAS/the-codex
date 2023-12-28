import { useQuery, useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MainSnippetPreview from "../components/Snippet/MainSnippetPreview.jsx";
import { GET_USER_SNIPPETS } from "../utils/queries";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  Icon,
  Text,
  Input,
  Avatar,
  Heading,
  Divider,
  Checkbox,
  Grid,
  InputRightElement,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaSearch } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import {
  ADD_PROPS,
  ADD_DROPS,
  REMOVE_PROPS,
  REMOVE_DROPS,
} from "../utils/mutations";
import Auth from "../utils/auth.js";

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
  const paragraphStyle = {
    fontSize: "18px",
    color: "white",
    fontWeight: "bold",
  };

  // State for comment input
  const { isOpen, onOpen, onClose } = useDisclosure();

  //defines state for searching for users
  const [userSearch, setUserSearch] = useState("");

  //retrieve user route parameter
  const { username } = useParams();

  // PROPS AND DROPS MUTATIONS
  // mutation to add props, with refetch to update cache to reflect new props
  const [addProps] = useMutation(ADD_PROPS, {
    refetchQueries: [{ query: GET_USER_SNIPPETS }],
  });

  //mutation to add drops, with refetch to update cache to reflect new drops
  const [addDrops] = useMutation(ADD_DROPS, {
    refetchQueries: [{ query: GET_USER_SNIPPETS }],
  });

  //mutation to remove props, to calculate overall props when snippet is dropped
  const [removeProps] = useMutation(REMOVE_PROPS);

  //mutation to remove drops, to calculate overall props when snippet is propped
  const [removeDrops] = useMutation(REMOVE_DROPS);

  // Use the useQuery hook to execute the GET_USER_SNIPPETS query
  const { loading, error, data, refetch } = useQuery(GET_USER_SNIPPETS, {
    variables: { username },
  });

  //if the user does not exist, display an error message
  useEffect(() => {
    if (error || (data && !data.userSnippets.user)) {
      onOpen();
    }
  }, [error, data, onOpen]);

  //refetch all snippets using updated tags upon state change
  useEffect(() => {
    if (loading) return; //eject from function if the page is still loading

    refetch({ tags: selectedTags, username: username });
  }, [selectedTags, refetch, loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract snippets from the data
  const snippets = data.userSnippets.snippets;

  let currentUser; //variable to hold current user's username

  //attempts to retrieve username from JWT
  try {
    //gets current user's username
    currentUser = Auth.getProfile()?.data?.username;
  } catch (
    error //empty error block (this is just here to ensure the page still renders even if a user is not logged in)
  ) {}

  //PROPS AND DROPS HANDLERS

  //PROP A SNIPPET
  const handleAddProps = async (snippetId) => {
    if (currentUser) {
      try {
        // was getting undefined error, chatgpt suggested this fix
        // preform the addProps mutation
        await addProps({
          variables: {
            username: currentUser,
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
    if (currentUser) {
      try {
        await addDrops({
          variables: {
            username: currentUser,
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
    if (currentUser) {
      try {
        await removeProps({
          variables: {
            username: currentUser,
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
    if (currentUser) {
      try {
        await removeDrops({
          variables: {
            username: currentUser,
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

  const handleInputChange = (event) => {
    const { value } = event.target;
    setUserSearch(value);
  };

  //upon the user clicking the 'search' button, route to the user snippets page of the user they searched for
  const handleUserSearch = () => {
    window.location.assign(`/user-snippets/${userSearch}`);
  };

  //if the user presses the 'enter' key while the user search input is in focus, attempt to search for that user
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUserSearch();
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
          <VStack
            spacing="4"
            w="full"
            maxW="5xl"
            mx="auto"
            p="8"
            color="codex.accents"
          >
            <HStack spacing={4}>
              <Avatar
                size="2xl"
                src={`/images/file-uploads/${data?.userSnippets?.user?.image}`}
              />
              <Heading color="codex.accents" size="3xl">
                {username}
              </Heading>
            </HStack>

            <Divider my={1} borderColor="codex.highlights" />

            <HStack>
              <InputGroup size="lg" w={["full", "3/4", "1/2"]}>
                <Input
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  value={userSearch}
                  placeholder="Enter username"
                  borderColor="codex.borders"
                  focusBorderColor="codex.highlights"
                  borderWidth={2}
                />
                <InputRightElement>
                  <Button
                    variant="secondary"
                    h="2.75rem"
                    onClick={handleUserSearch}
                  >
                    <MdPersonSearch />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </HStack>

            {data.userSnippets.user !== null &&
            data.userSnippets.user !== undefined ? (
              <>
                {/* Toggle Tags Section */}
                <Box w="full">
                  <Button
                    variant="secondary"
                    onClick={handleToggleTags}
                    size="sm"
                  >
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
                  {snippets.map((snippet, index) => (
                    <Box
                      key={index}
                      pb="5"
                      w="full"
                      borderBottom="1px solid"
                      borderColor="codex.borders"
                    >
                      <MainSnippetPreview snippet={snippet} />
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
              </>
            ) : (

              // <Text color="red" mt={2}>
              //   User not found or name is incorrect.
              // </Text>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>User Not Found</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>The username you entered does not exist or is incorrect. Please try again with a different username.</Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="secondary" mr={3} onClick={onClose}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </VStack>
        </Flex>
      </Box>
    </>
  );
}
