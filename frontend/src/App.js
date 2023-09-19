import PricingHistory from "./PricingHistory/pricingHistory";
import MyPortforlio from "./MyPortfolio/MyPortfolio";
import Menu from "./Menu";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/PricingHistory" element={<PricingHistory />} />
          <Route path="/MyPortfolio" element={<MyPortforlio />} />  
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
