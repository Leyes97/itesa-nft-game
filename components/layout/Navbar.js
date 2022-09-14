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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
/* import { HamburgerIcon, CloseIcon, } from '@chakra-ui/icons'; */
import { requestAccount } from "../../utils/blockchain/tokenOperations";
import { logoutUser } from "../../state/user";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [account, setAccount] = useState("");
  const dispatch = useDispatch();

  //Traer info del usuario logueado
  useAuth();
  const user = useSelector((state) => state.user);

  //Manejo de cuenta de Metamask
  const handleAccount = async () => {
    if (account) {
      setAccount(null);
    } else {
      setAccount(await requestAccount());
    }
  };

  //Manejo del logout
  const handlerLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Box bg={"gray.900"} color={"gray.50"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Stack direction="row" spacing={4} align="center">
          <Link href="/index">
            <Button colorScheme="gray.50" variant="ghost">
              Home
            </Button>
          </Link>
          <Button colorScheme="gray.50" variant="ghost">
            Marketplace
          </Button>
        </Stack>
        <Stack direction="row" spacing={4} align="center">
          <Button colorScheme="gray.50" variant="ghost">
            Play Now
          </Button>
        </Stack>
        <Stack direction="row" spacing={4} align="center">
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
            </Menu>
          </Flex>

          {user ? (
            <Link href="/">
              <Button
                colorScheme="gray.50"
                variant="ghost"
                onClick={handlerLogout}
              >
                Logout
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button colorScheme="gray.50" variant="ghost">
                Login
              </Button>
            </Link>
          )}

          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
                onClick={handleAccount}
              >
                {account ? (
                  <p>{account[0].slice(0, 8)}</p>
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
