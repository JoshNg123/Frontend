import React from "react";
import {
  Heading,
  Text,
  Box,
  FormControl,
  FormLabel,
  Select,
  Container,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import moment from "moment";

const MyPortforlio = () => {
  const [cryptoCode, setCryptoCode] = useState("");
  const [date, setDate] = useState("");
  const [buySell, setBuySell] = useState("Buy");
  const [cryptoUnit, setCryptoUnit] = useState("");
  const [transaction, setTransaction] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Transaction Added");
    const transaction = {
      cryptoCode,
      date,
      buySell,
      cryptoUnit,
    };

    // // Fetch API to send data
    // fetch("/MyPortfolio", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(transaction),
    // }).then((response) => {
    //   console.log(response);
    //   if (!response.ok) {
    //     throw new Error("Error creating Item");
    //   }
    // });

    let itemsList = [];

    const storedData = JSON.parse(localStorage.getItem("transaction"));

    if (storedData !== null) {
      if (Array.isArray(storedData)) {
        itemsList = storedData;
        itemsList.push(transaction);
      }
    } else {
      itemsList.push(transaction);
    }

    // Store data in localStorage
    localStorage.setItem("transaction", JSON.stringify(itemsList));
    setCryptoCode("");
    setDate("");
    setBuySell("Buy");
    setCryptoUnit("");

    getItems();
  };

  useEffect(() => {
    // Fetch Local Storage data when it first mounts
    getItems();
  }, []);

  // Function to trigger GET request to /MyPortfolio
  const getItems = () => {
    // fetch("/MyPortfolio")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTransaction(data);
    //   });

    const storedData = JSON.parse(localStorage.getItem("transaction"));
    if (storedData !== null) {
      setTransaction(storedData);
    }
  };

  return (
    <>
      <Container textAlign="center" mb="1em" maxW="4xl">
        <Heading marginBottom="0.3em"> My Portfolio </Heading>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="xl"> Transaction Table </Text>
          <Button onClick={onOpen} rightIcon={<GrAdd />}>
            Add Transaction
          </Button>
        </Box>
      </Container>
      <Container>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <form onSubmit={onSubmit} id="TransactionForm">
                <FormControl isRequired>
                  <FormLabel>Cryptocurrency Code</FormLabel>
                  <Input
                    type="text"
                    color="black"
                    placeholder="Cryptocurrency Code"
                    value={cryptoCode}
                    onChange={(e) => setCryptoCode(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date of Transaction</FormLabel>
                  <Input
                    type="date"
                    color="black"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Buy / Sell</FormLabel>
                  <Select
                    value={buySell}
                    onChange={(e) => setBuySell(e.target.value)}
                  >
                    Buy / Sell
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </Select>
                </FormControl>
                <FormControl marginBottom="0.5em" isRequired>
                  <FormLabel>Amount in Cryptocurrency Units</FormLabel>
                  <Input
                    type="number"
                    color="black"
                    value={cryptoUnit}
                    onChange={(e) => setCryptoUnit(e.target.value)}
                  />
                </FormControl>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                form="TransactionForm"
                onClick={onClose}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>

      {/*Table to display transaction data*/}
      <Center>
        <Table variant="striped" maxW="4xl">
          <Thead>
            <Tr>
              <Th>Cryptocurrency Code</Th>
              <Th>Date</Th>
              <Th>Buy/Sell</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transaction.map((transaction) => (
              <Tr key={transaction._id}>
                <Td>{transaction.cryptoCode}</Td>
                <Td>{moment(transaction.date).utc().format("YYYY-MM-DD")}</Td>
                <Td>{transaction.buySell}</Td>
                <Td>{transaction.cryptoUnit}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
    </>
  );
};

export default MyPortforlio;
