import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Papa from "papaparse";
import ChainLink from "./coin_ChainLink.csv";
import EOS from "./coin_EOS.csv";
import Cosmos from "./coin_Cosmos.csv";
import Uniswap from "./coin_Uniswap.csv";
import Polkadot from "./coin_Polkadot.csv";
import { Button, Heading } from "@chakra-ui/react";

// Change Date Format of CSV Data manually
const PricingHistory = () => {
  const [crypto1Data, setCrypto1Data] = useState([]);
  const [crypto2Data, setCrypto2Data] = useState([]);
  const [crypto3Data, setCrypto3Data] = useState([]);
  const [crypto4Data, setCrypto4Data] = useState([]);
  const [crypto5Data, setCrypto5Data] = useState([]);

  const [combinedData, setCombinedData] = useState([]);
  const [combinedQuarterlyData, setCombinedQuarterlyData] = useState([]);
  const [combinedYearlyData, setCombinedYearlyData] = useState([]);

  const [selectedData, setSelectedData] = useState(combinedData);
  const [granularity, setGranularity] = useState("daily");

  useEffect(() => {
    parseCsvData(ChainLink, setCrypto1Data);
    parseCsvData(EOS, setCrypto2Data);
    parseCsvData(Cosmos, setCrypto3Data);
    parseCsvData(Uniswap, setCrypto4Data);
    parseCsvData(Polkadot, setCrypto5Data);
  }, []);

  useEffect(() => {
    if (combinedData.length > 0) {
      setSelectedData(combinedData);
    }
  }, [combinedData]);

  useEffect(() => {
    mergeData();
  }, [crypto1Data, crypto2Data, crypto3Data, crypto4Data, crypto5Data]);

  // Function to format the date and remove the time portion
  const formatDate = (dateString) => {
    if (dateString) {
      const date = dateString.split(" ")[0];
      return date;
    }
  };

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

  // Function to parse CSV data of all closing prices of the 5 cryptocurrencies I chose
  const parseCsvData = (fileName, setData) => {
    Papa.parse(fileName, {
      download: true,
      header: true,
      delimiter: ",",
      complete: (results) => {
        const data = results.data.map((item) => {
          const formattedDate = formatDate(item.Date);
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

  // Function to merge data
  const mergeData = () => {
    // This is the data that will be used to populate the chart
    // This is daily data
    const mergedData = [];

    // This is quarterly data
    const quarterlyData = [];

    // This is yearly data
    const yearlyData = [];

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

    // Hardcoded to find the latest date of the closing price
    let lastKey = null;
    const keysArray = Array.from(crypto1Map.keys());
    if (keysArray.length > 0) {
      lastKey = keysArray[keysArray.length - 2];
    }

    const findEarliestDate = [
      crypto1Map.keys().next().value,
      crypto2Map.keys().next().value,
      crypto3Map.keys().next().value,
      crypto4Map.keys().next().value,
      crypto5Map.keys().next().value,
    ];

    const earliestDate = findEarliestDate.reduce((earliest, current) => {
      return current < earliest ? current : earliest;
    }, findEarliestDate[0]);

    // console.log(earliestDate); // Output: '2017-07-02'

    const startingQuarterlyDate = new Date(earliestDate);
    const endingQuarterlyDate = new Date(lastKey);

    let currentQuarterDate = new Date(startingQuarterlyDate);

    while (currentQuarterDate <= endingQuarterlyDate) {
      const currentYear = currentQuarterDate.getFullYear();
      const currentMonth = currentQuarterDate.getMonth();
      const quarterEndDate = new Date(currentYear, currentMonth + 2, 1);
      quarterEndDate.setMonth(quarterEndDate.getMonth() + 1);
      quarterEndDate.setDate(1);

      const date = quarterEndDate.toISOString().substring(0, 10); // Output the date in "YYYY-MM-DD" format
      quarterlyData.push({
        date,
        Aave: crypto1Map.get(date) || null,
        EOS: crypto2Map.get(date) || null,
        Cosmos: crypto3Map.get(date) || null,
        Uniswap: crypto4Map.get(date) || null,
        Polkadot: crypto5Map.get(date) || null,
      });

      currentQuarterDate.setMonth(currentQuarterDate.getMonth() + 3);
    }

    const startingDate = new Date(earliestDate);
    const endingDate = new Date(lastKey);
    let currentDate = new Date(startingDate.getFullYear(), 11, 32); // Set the initial date to December 31st of the starting year

    while (
      currentDate.getFullYear() >= startingDate.getFullYear() &&
      currentDate <= endingDate
    ) {
      const date = currentDate.toISOString().substring(0, 10); // Output the date in "YYYY-MM-DD" format
      yearlyData.push({
        date,
        Aave: crypto1Map.get(date) || null,
        EOS: crypto2Map.get(date) || null,
        Cosmos: crypto3Map.get(date) || null,
        Uniswap: crypto4Map.get(date) || null,
        Polkadot: crypto5Map.get(date) || null,
      });
      currentDate.setFullYear(currentDate.getFullYear() + 1); // Move to the previous year
    }

    allDates.forEach((date) => {
      mergedData.push({
        date,
        Aave: crypto1Map.get(date) || null,
        EOS: crypto2Map.get(date) || null,
        Cosmos: crypto3Map.get(date) || null,
        Uniswap: crypto4Map.get(date) || null,
        Polkadot: crypto5Map.get(date) || null,
      });
    });

    setCombinedQuarterlyData(quarterlyData);
    setCombinedYearlyData(yearlyData);
    setCombinedData(mergedData);
  };

  return (
    <>
      <Heading>Cryptocurrency Comparison</Heading>
      <Button onClick={() => handleGranularityChange("daily")}>Daily</Button>
      <Button onClick={() => handleGranularityChange("quarterly")}>
        Quarterly
      </Button>
      <Button onClick={() => handleGranularityChange("yearly")}>Yearly</Button>
      <LineChart width={1000} height={600} data={selectedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickCount={10} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Aave" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="EOS" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="Cosmos" stroke="#ff5733" dot={false} />
        <Line type="monotone" dataKey="Uniswap" stroke="#83bc2e" dot={false} />
        <Line type="monotone" dataKey="Polkadot" stroke="#83f0d9" dot={false} />
      </LineChart>
    </>
  );
};

export default PricingHistory;
