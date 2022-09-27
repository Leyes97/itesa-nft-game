import {
  Stack,
  VStack,
  Link,
  Heading,
  Box,
  Center,
  Spinner,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
// Components
import { getArena } from "../../../state/arena";
import AvatarGamer from "../avatarGamer";
import GameAccessories from "./gameAccessories";
// Firebase
import { auth } from "../../../firebase/firebase-config";
// React
import { useEffect } from "react";
// Redux Store
import { useDispatch, useSelector } from "react-redux";
import { getUserAvatar } from "../../../state/avatar";
import { getItems } from "../../../state/nftItems";
import { getItemsEquipped } from "../../../state/nftEquipped";
import { getMatches } from "../../../state/dailyMatches";

const PlayGame = () => {
  const dispatch = useDispatch();
  const arena = useSelector((state) => state.arena);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    //Traer Avatar con el uid que nos da auth
    dispatch(getUserAvatar(auth?.currentUser?.uid));
    //Traer NFT Items con el uid que nos da auth
    dispatch(getItems(auth.currentUser?.uid));
    //Setear Arena dependiendo del nivel del user
    dispatch(getArena(user?.level));
    //Traer nfts equipados
    dispatch(getItemsEquipped(auth.currentUser?.uid));
    // Consultar cantidad de partidas diarias del usuario
    dispatch(getMatches(auth.currentUser?.uid));
  }, [user]);

  return (
    <>
      <Box
        w={"full"}
        h={"100vh"}
        backgroundSize={"cover"}
        backgroundImage={arena?.planet}
        backgroundPosition={"center center"}>
        {arena ? (
          <>
            <VStack w={"full"} justify={"center"}>
              <Stack maxW={"2xl"} align={"flex-center"} spacing={6}>
                <Heading
                  mt={10}
                  color={"white"}
                  fontWeight={700}
                  lineHeight={1.2}
                  // fontSize={useBreakpointValue({ base: "3xl", md: "4xl" })}
                >
                  ARE YOU READY TO PLAY?
                </Heading>
              </Stack>
            </VStack>

            <Wrap mt={20} justify={"center"} columns={2} spacing={200}>
              {/* <GameAvatar/> */}
              <AvatarGamer />
              <GameAccessories />
            </Wrap>
          </>
        ) : (
          <Center>
            <Spinner size="xl" />
          </Center>
        )}
      </Box>
    </>
  );
};
export default PlayGame;
