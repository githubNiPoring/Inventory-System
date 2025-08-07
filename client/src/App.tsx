import { useState } from "react";

import Sidebar from "./pages/components/sidebar/sidebar";

import Dashboard from "./pages/components/dashboard/dashboard";
import Products from "./pages/components/products/products";
import StocksIn from "./pages/components/stocks-in/stocks-in";
import StocksOut from "./pages/components/stocks-out/stocks-out";
import Reports from "./pages/components/reports/reports";

function App() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <Products />;
      case "StocksIn":
        return <StocksIn />;
      case "StocksOut":
        return <StocksOut />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
        <main className="w-screen p-6 transition-all duration-300 bg-secondary text-accent">
          {renderActiveComponent()}
        </main>
      </div>
    </>
  );
}

export default App;
