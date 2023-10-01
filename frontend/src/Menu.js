import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <>
      <Box
        //#F0F8FF
        bgColor="#E6BBAD"
        mb="0.9em"
        display="flex"
        alignItems="center"
        fontWeight="bold"
        pl="2em"
        justifyContent="space-between"
        pr="2em"
      >
        <Text fontSize="2em" color="#F0F8FF">
          TEMG 4950L Frontend Assignment
        </Text>
        <Box>
          <HStack fontSize="1.5em" gap="0.7em" color="#F0F8FF">
            <Link to="/PricingHistory">
              <Text _hover={{ textDecoration: "underline" }} color="#F0F8FF">
                Pricing History
              </Text>
            </Link>
            <Link to="/MyPortfolio">
              <Text _hover={{ textDecoration: "underline" }}>My Portfolio</Text>
            </Link>
          </HStack>
          {/* <Menu>
            <MenuButton as={Button} mb="1em">
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/PricingHistory">
                Pricing History
              </MenuItem>
              <MenuItem as={Link} to="/MyPortfolio">
                My Portforlio
              </MenuItem>
            </MenuList>
          </Menu> */}
        </Box>
      </Box>
    </>
  );
};

export default MainMenu;
