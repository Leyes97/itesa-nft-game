import {
  Box,
  Center,
  Heading,
  Stack,
  WrapItem,
  Text,
  Image,
  Flex,
  Checkbox,
} from "@chakra-ui/react";

const AvatarRandom = () => {
  const nftRandom = [
    {
      name: "URANO",
      level: "3",
      img: "https://imgur.com/nvD4rT2.png",
      accDefense: [
        "  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
      ],
      accAttack: [
        "  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
      ],
    },
  ];

  return (
    <WrapItem>
      <Center>
        <Box
          mt={10}
          mb={10}
          role={"group"}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={"gray.800"}
          color={"white"}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          zIndex={1}>
          <Box
            rounded={"lg"}
            mt={-12}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              filter: "blur(10px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(10px)",
              },
            }}>
            <Image
              rounded={"lg"}
              height={280}
              width={282}
              objectFit={"cover"}
              src={nftRandom[0].img}
              alt={""}
            />
          </Box>

          <Stack pt={20} align={"center"}>
            <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
              {nftRandom[0].name}
            </Heading>
            <Text>Level: {nftRandom[0].level}</Text>
          </Stack>

          <Stack>
            <Text fontSize={"sm"} textTransform={"uppercase"}>
              Attack
            </Text>
            <Stack spacing={5} direction="row">
              <Checkbox colorScheme="white" defaultChecked>
                Item 1
              </Checkbox>
            </Stack>
          </Stack>

          <Stack>
            <Text fontSize={"sm"} textTransform={"uppercase"}>
              Defense
            </Text>
            <Stack spacing={5} direction="row">
              <Checkbox colorScheme="white" defaultChecked>
                Item 1
              </Checkbox>
            </Stack>
          </Stack>

          <Stack>
            <Text fontSize={"sm"} textTransform={"uppercase"}>
              Luck
            </Text>
            <Stack spacing={5} direction="row">
              <Checkbox colorScheme="white" defaultChecked>
                Item 1
              </Checkbox>
            </Stack>
          </Stack>
        </Box>
      </Center>
    </WrapItem>
  );
};

export default AvatarRandom;
