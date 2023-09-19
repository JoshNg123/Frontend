import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <>
      <Menu mb="2em">
        <MenuButton as={Button} mb="1em">Menu</MenuButton>
        <MenuList>
          <MenuItem as={Link} to="/PricingHistory">
            Pricing History
          </MenuItem>
          <MenuItem as={Link} to="/MyPortfolio">My Portforlio</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default MainMenu;