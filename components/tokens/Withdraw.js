import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { updateTokenQuant } from "../../fetchData/controllers";
import { auth } from "../../firebase/firebase-config";
import { sendTokens } from "../../utils/blockchain/tokenOperations";
import { useSelector } from "react-redux";

const Withdraw = () => {
  const toast = useToast();
  const user = useSelector((state) => state.user);

  // valor a enviar
  const [value, setValue] = useState("");
  // address que recibira los tokens
  const [addressReceiver, setAddressReceiver] = useState("");

  // Seteamos la cantidad de tokens para enviar
  const handleValue = (e) => {
    setValue(e.target.value);
  };

  // Seteamos el address del receptor
  const handleAddressReceiver = (e) => {
    setAddressReceiver(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //Tiene el saldo que quiere retirar?
    user.tokenQuantity >= value
      ? //Se envian los tokens a la address ingresada
        sendTokens(addressReceiver, value).then((res) => {
          if (res === "ok") {
            //si se realizó la transaction porque el saldo y la address eran correctos

            //se actualiza el saldo virtual en la db
            updateTokenQuant("users", auth.currentUser.uid, value);
            setAddressReceiver("");
            setValue("");
            toast({
              title: "Transaction successful",
              description: "Please check your wallet",
              status: "success",
              position: "top",
              duration: 5000,
              isClosable: true,
            });
          } else {
            //si hay error es porque no existe la address
            toast({
              title: "The address doesn't exists",
              description: "Please try again",
              status: "error",
              position: "top",
              duration: 6000,
              isClosable: true,
            });
          }
        })
      : //si no tiene el saldo que quiere retirar
        toast({
          title: "Insufficient balance",
          description: "Please try again",
          status: "error",
          position: "top",
          duration: 6000,
          isClosable: true,
        });
  };

  return (
    <>
      <Stack
        boxShadow={"md"}
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Heading>Withdraw your tokens</Heading>
        <form onSubmit={onSubmit}>
          <FormControl>
            <FormLabel>Amount 💸</FormLabel>
            <Input required onChange={handleValue} value={value} />
            <FormLabel>Address receiver</FormLabel>
            <Input
              required
              onChange={handleAddressReceiver}
              value={addressReceiver}
            />
          </FormControl>
          <Stack boxSize={"fit-content"} mt={2}>
            <Button
              loadingText="Loading"
              size="md"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
            >
              Withdraw
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Withdraw;
