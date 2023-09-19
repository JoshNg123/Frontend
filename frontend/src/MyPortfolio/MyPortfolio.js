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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import moment from "moment";

const MyPortforlio = () => {
  const [cryptoCode, setCryptoCode] = useState("");
  const [date, setDate] = useState("");
  const [buySell, setBuySell] = useState("Buy");
  const [cryptoUnit, setCryptoUnit] = useState("");
  const [transaction, setTransaction] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    const transaction = {
      cryptoCode,
      date,
      buySell,
      cryptoUnit,
    };
    console.log(transaction);

    // Fetch API to send data
    fetch("/MyPortfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    }).then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error("Error creating Item");
      }
    });

    setCryptoCode("");
    setDate("");
    setBuySell("Buy");
    setCryptoUnit("");

    getItems();
  };

  useEffect(() => {
    // Fetch API to get data when component first mounts
    getItems();
  }, []);

  // Function to trigger GET request to /MyPortfolio
  const getItems = () => {
    fetch("/MyPortfolio")
      .then((res) => res.json())
      .then((data) => {
        setTransaction(data);
      });
  };
  return (
    <>
      <Box textAlign="center">
        <Heading marginBottom="0.3em"> My Portforlio </Heading>
        <Text fontSize="xl"> Data Entry Form </Text>
      </Box>
      <Container>
        <form onSubmit={onSubmit}>
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
          <Button type="submit" marginBottom="0.5em">
            Submit
          </Button>
        </form>
      </Container>
      {transaction.map((transaction) => (
        <Container>
          <Box
            key={transaction._id}
            borderWidth="1px"
            marginBottom="0.5em"
            padding="1em"
          >
            <Text>Cryptocurrency Code: {transaction.cryptoCode}</Text>
            <Text>
              Date: {moment(transaction.date).utc().format("YYYY-MM-DD")}
            </Text>
            <Text>Buy/Sell: {transaction.buySell}</Text>
            <Text>Amount: {transaction.cryptoUnit}</Text>
          </Box>
        </Container>
      ))}
    </>
  );
};

export default MyPortforlio;
