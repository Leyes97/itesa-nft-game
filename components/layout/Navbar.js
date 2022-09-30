import { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { requestAccount } from "../../utils/blockchain/tokenOperations";
import { logoutUser } from "../../state/user";
import useAuth from "../../hooks/useAuth";
import { updateData } from "../../fetchData/controllers";
import { auth } from "../../firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Navbar = () => {
  const [account, setAccount] = useState("");
  const [verificado, setVerificado] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  //Traer info del usuario logueado
  useAuth();
  const user = useSelector((state) => state.user);

  // Traer data de Auth del usuario

  const path = router.pathname;

  useEffect(() => {
    if (auth.currentUser) {
      // Chequear si el usuario esta baneado
      // console.log("user", user);
      // if (user?.isActive) {
      //   console.log("user", user);
      //   console.log("user is active");
      // }

      if (
        !auth.currentUser?.emailVerified &&
        path != "/" &&
        path != "/login" &&
        path != "/register" &&
        path != "/login2fa"
      ) {
        router.push("/verify");
      }
    }

    // TODO: 29/9 ->ver usuario no autenticado
    // else if (
    //   path != "/" &&
    //   path != "/login" &&
    //   path != "/register" &&
    //   path != "/login2fa"
    // ) {
    //   router.push("/login");
    // }
  }, [auth.currentUser]);

  useEffect(() => {
    if (auth.currentUser) {
      // Chequear si el usuario esta baneado
      if (!user?.isActive) {
        dispatch(logoutUser()).then((res) => {
          console.log(res);

          toast({
            title: "You have been banned",
            description: "See you",
            status: "warning",
            position: "top",
            duration: 6000,
            isClosable: true,
          });
          router.push("/");
        });
      }
    }
  }, [user]);

  //Manejo de cuenta de Metamask
  const handleAccount = async () =>
    account ? setAccount(null) : setAccount(await requestAccount());

  //Manejo del logout
  const handlerLogout = () => {
    dispatch(logoutUser()).then(() => {
      router.push("/");
    });
  };

  // Actualizar intencion de juego del usuario
  const handleWannaPlay = () => {
    console.log("gatillado");
    const uid = auth.currentUser.uid;
    const playData = { wannaPlay: true };
    updateData("users", uid, playData);
  };

  return (
    <Box bg={"gray.900"} color={"gray.50"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Stack direction="row" spacing={4} align="center">
          <Link href="/">
            <Button colorScheme="gray.50" variant="ghost">
              INTERGALAXY
            </Button>
            {/* <Image
              src="https://imgur.com/XESZdb9"
              alt="intergalaxy logo"
              height={64}
              width={64}></Image> */}
          </Link>

          <Link href="/marketplace">
            <Button colorScheme="gray.50" variant="ghost">
              MARKETPLACE
            </Button>
          </Link>

          <Link href="/arena">
            <Button
              colorScheme="gray.50"
              variant="ghost"
              onClick={handleWannaPlay}>
              PLAY NOW
            </Button>
          </Link>
        </Stack>
        <Stack direction="row" spacing={4} align="center">
          {user ? (
            <Link href="/">
              <Button
                colorScheme="gray.50"
                variant="ghost"
                onClick={handlerLogout}>
                LOGOUT
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button colorScheme="gray.50" variant="ghost">
                LOGIN
              </Button>
            </Link>
          )}

          {user ? (
            <>
              <Link href="/user/profile">
                <Button colorScheme="gray.50" variant="ghost">
                  PROFILE
                </Button>
              </Link>
              <Link href="/user/tokens">
                <Button colorScheme="gray.50" variant="ghost">
                  ITGX
                </Button>
              </Link>
            </>
          ) : (
            ""
          )}

          {user?.isAdmin ? (
            <Link href="/admin/dashboard">
              <Button colorScheme="gray.50" variant="ghost">
                ADMIN
              </Button>
            </Link>
          ) : (
            ""
          )}

          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                onClick={handleAccount}>
                {account ? (
                  <p className="text-white">{account[0].slice(0, 8)}</p>
                ) : (
                  <Avatar
                    size={"sm"}
                    bg="gray.900"
                    src={"https://imgur.com/w9VLtoi.png"}
                  />
                )}
              </MenuButton>
            </Menu>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
