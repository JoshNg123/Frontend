import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import ChainLink from "./coin_ChainLink.csv";
import EOS from "./coin_EOS.csv";
import Cosmos from "./coin_Cosmos.csv";
import Uniswap from "./coin_Uniswap.csv";
import Polkadot from "./coin_Polkadot.csv";
import { Button, HStack, Heading, Center, Flex } from "@chakra-ui/react";

// Change Date Format of CSV Data manually
const PricingHistory = () => {
  // State to store the data of the 5 cryptocurrencies for daily closing prices
  const [crypto1Data, setCrypto1Data] = useState([]);
  const [crypto2Data, setCrypto2Data] = useState([]);
  const [crypto3Data, setCrypto3Data] = useState([]);
  const [crypto4Data, setCrypto4Data] = useState([]);
  const [crypto5Data, setCrypto5Data] = useState([]);

  // State to store the data of the 5 cryptocurrencies for quarterly closing prices
  const [crypto1QuarterlyData, setCrypto1QuarterlyData] = useState([]);
  const [crypto2QuarterlyData, setCrypto2QuarterlyData] = useState([]);
  const [crypto3QuarterlyData, setCrypto3QuarterlyData] = useState([]);
  const [crypto4QuarterlyData, setCrypto4QuarterlyData] = useState([]);
  const [crypto5QuarterlyData, setCrypto5QuarterlyData] = useState([]);

  // State to store the data of the 5 cryptocurrencies for yearly closing prices
  const [crypto1YearlyData, setCrypto1YearlyData] = useState([]);
  const [crypto2YearlyData, setCrypto2YearlyData] = useState([]);
  const [crypto3YearlyData, setCrypto3YearlyData] = useState([]);
  const [crypto4YearlyData, setCrypto4YearlyData] = useState([]);
  const [crypto5YearlyData, setCrypto5YearlyData] = useState([]);

  const [combinedData, setCombinedData] = useState([]);
  const [combinedQuarterlyData, setCombinedQuarterlyData] = useState([]);
  const [combinedYearlyData, setCombinedYearlyData] = useState([]);

  const [selectedData, setSelectedData] = useState(combinedData);
  const [granularity, setGranularity] = useState("daily");

  // Parse the CSV data when the component mounts
  useEffect(() => {
    parseCsvData(ChainLink, setCrypto1Data);
    parseAverageQuarterlyCsvData(ChainLink, setCrypto1QuarterlyData);
    parseYearlyCsvData(ChainLink, setCrypto1YearlyData);

    parseCsvData(EOS, setCrypto2Data);
    parseAverageQuarterlyCsvData(EOS, setCrypto2QuarterlyData);
    parseYearlyCsvData(EOS, setCrypto2YearlyData);

    parseCsvData(Cosmos, setCrypto3Data);
    parseAverageQuarterlyCsvData(Cosmos, setCrypto3QuarterlyData);
    parseYearlyCsvData(Cosmos, setCrypto3YearlyData);

    parseCsvData(Uniswap, setCrypto4Data);
    parseAverageQuarterlyCsvData(Uniswap, setCrypto4QuarterlyData);
    parseYearlyCsvData(Uniswap, setCrypto4YearlyData);

    parseCsvData(Polkadot, setCrypto5Data);
    parseAverageQuarterlyCsvData(Polkadot, setCrypto5QuarterlyData);
    parseYearlyCsvData(Polkadot, setCrypto5YearlyData);
  }, []);

  useEffect(() => {
    if (combinedData.length > 0) {
      setSelectedData(combinedData);
    }
  }, [combinedData]);

  useEffect(() => {
    mergeData();
  }, [
    crypto1Data,
    crypto2Data,
    crypto3Data,
    crypto4Data,
    crypto5Data,
    crypto1QuarterlyData,
    crypto2QuarterlyData,
    crypto3QuarterlyData,
    crypto4QuarterlyData,
    crypto5QuarterlyData,
    crypto1YearlyData,
    crypto2YearlyData,
    crypto3YearlyData,
    crypto4YearlyData,
    crypto5YearlyData,
  ]);

  const handleGranularityChange = (selectedGranularity) => {
    setGranularity(selectedGranularity);

    // Update data based on selected granularity
    let updatedData;

    if (selectedGranularity === "daily") {
      updatedData = combinedData;
    } else if (selectedGranularity === "quarterly") {
      updatedData = combinedQuarterlyData;
    } else if (selectedGranularity === "yearly") {
      updatedData = combinedYearlyData;
    }

    setSelectedData(updatedData);
  };

  // Function to parse CSV data of daily closing prices of the 5 cryptocurrencies I chose
  const parseCsvData = (fileName, setData) => {
    Papa.parse(fileName, {
      download: true,
      header: true,
      delimiter: ",",
      complete: (results) => {
        const data = results.data.map((item) => {
          const formattedDate = item.Date;
          const price = parseFloat(item.Close);
          if (price !== undefined) {
            return {
              date: formattedDate,
              price: price,
            };
          }
        });
        setData(data);
      },
    });
  };

  // Function to parse CSV data of average quarterly closing prices of the 5 cryptocurrencies I chose
  const parseAverageQuarterlyCsvData = (fileName, setData) => {
    Papa.parse(fileName, {
      download: true,
      header: true,
      delimiter: ",",
      complete: (results) => {
        const data = results.data.map((item) => {
          const quarterlyDate = item.Quarter;
          const averageQuarterClosingPrice = parseFloat(
            item.AverageQuarterReturn
          );
          // When we parse Excel Sheet, it goes through each the longest row and adds NaN to the end of the array
          if (isNaN(averageQuarterClosingPrice) === false) {
            return {
              date: quarterlyDate,
              price: averageQuarterClosingPrice,
            };
          }
        });
        setData(data);
      },
    });
  };

  // Function to parse CSV data of yearly closing prices of the 5 cryptocurrencies I chose
  const parseYearlyCsvData = (fileName, setData) => {
    Papa.parse(fileName, {
      download: true,
      header: true,
      delimiter: ",",
      complete: (results) => {
        const data = results.data.map((item) => {
          const yearlyDate = item.Year;
          const averageYearClosingPrice = parseFloat(item.AverageYearlyReturn);
          if (isNaN(averageYearClosingPrice) === false) {
            return {
              date: yearlyDate,
              price: averageYearClosingPrice,
            };
          }
        });
        setData(data);
      },
    });
  };

  // Function to merge data
  const mergeData = () => {
    // This is the data that will be used to populate the chart
    // This is daily data
    const mergedData = [];

    // Convert it to a Map
    const crypto1Map = new Map(
      crypto1Data.map((item) => [item.date, item.price])
    );
    const crypto2Map = new Map(
      crypto2Data.map((item) => [item.date, item.price])
    );
    const crypto3Map = new Map(
      crypto3Data.map((item) => [item.date, item.price])
    );
    const crypto4Map = new Map(
      crypto4Data.map((item) => [item.date, item.price])
    );
    const crypto5Map = new Map(
      crypto5Data.map((item) => [item.date, item.price])
    );

    // Hardcoded to set the crypto with the earliest closing price date
    const allDates = new Set([...crypto2Map.keys()]);

    allDates.forEach((date) => {
      mergedData.push({
        date,
        ChainLink: crypto1Map.get(date) || null,
        EOS: crypto2Map.get(date) || null,
        Cosmos: crypto3Map.get(date) || null,
        Uniswap: crypto4Map.get(date) || null,
        Polkadot: crypto5Map.get(date) || null,
      });
    });
    setCombinedData(mergedData);

    // This is quarterly data
    const quarterlyData = [];

    const crypto1QuarterlyMap = new Map(
      crypto1QuarterlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto2QuarterlyMap = new Map(
      crypto2QuarterlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto3QuarterlyMap = new Map(
      crypto3QuarterlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto4QuarterlyMap = new Map(
      crypto4QuarterlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto5QuarterlyMap = new Map(
      crypto5QuarterlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    // Hardcoded to set the crypto with the earliest closing price quarter
    let quarterlyDates = new Set([...crypto1QuarterlyMap.keys()]);

    // Store the data in an object format for each date
    quarterlyDates.forEach((date) => {
      quarterlyData.push({
        date,
        ChainLink: crypto1QuarterlyMap.get(date) || null,
        EOS: crypto2QuarterlyMap.get(date) || null,
        Cosmos: crypto3QuarterlyMap.get(date) || null,
        Uniswap: crypto4QuarterlyMap.get(date) || null,
        Polkadot: crypto5QuarterlyMap.get(date) || null,
      });
    });

    setCombinedQuarterlyData(quarterlyData);

    // This is yearly data
    const yearlyData = [];

    const crypto1YearlyMap = new Map(
      crypto1YearlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto2YearlyMap = new Map(
      crypto2YearlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto3YearlyMap = new Map(
      crypto3YearlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto4YearlyMap = new Map(
      crypto4YearlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    const crypto5YearlyMap = new Map(
      crypto5YearlyData
        .filter((item) => item && item.date && item.price) // Filter out undefined items
        .map((item) => [item.date, item.price])
    );

    // Hardcoded to set the crypto with the earliest closing price year
    let yearlyDates = new Set([...crypto1YearlyMap.keys()]);

    yearlyDates.forEach((date) => {
      yearlyData.push({
        date,
        ChainLink: crypto1YearlyMap.get(date) || null,
        EOS: crypto2YearlyMap.get(date) || null,
        Cosmos: crypto3YearlyMap.get(date) || null,
        Uniswap: crypto4YearlyMap.get(date) || null,
        Polkadot: crypto5YearlyMap.get(date) || null,
      });
    });

    setCombinedYearlyData(yearlyData);
  };

  return (
    <>
      <Heading textAlign="center" mb="0.5em">
        Cryptocurrency Comparison
      </Heading>
      <Center>
        <HStack>
          <Button onClick={() => handleGranularityChange("daily")}>
            Daily
          </Button>
          <Button onClick={() => handleGranularityChange("quarterly")}>
            Quarterly
          </Button>
          <Button onClick={() => handleGranularityChange("yearly")}>
            Yearly
          </Button>
        </HStack>
      </Center>
      <Flex justifyContent="center">
        <ResponsiveContainer width="90%" height={600}>
          <LineChart width={1000} height={600} data={selectedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" dy={10} />
            <YAxis
              tickCount={10}
              label={{
                value: "Closing Price (USD)",
                angle: -90, // Rotate the label to be vertical
                position: "insideLeft", // Position the label to the left of the Y-axis
                dy: 10, // Offset the label upward for better alignment
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="ChainLink"
              stroke="#8884d8"
              dot={false}
            />
            <Line type="monotone" dataKey="EOS" stroke="#82ca9d" dot={false} />
            <Line
              type="monotone"
              dataKey="Cosmos"
              stroke="#ff5733"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Uniswap"
              stroke="#83bc2e"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Polkadot"
              stroke="#83f0d9"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Flex>
    </>
  );
};

export default PricingHistory;
