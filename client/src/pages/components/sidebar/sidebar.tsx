import { useState, useEffect } from "react";

import SidebarItem from "./sidebarItem";
import isLogo from "/IS-LOGO.svg";
import { ChevronFirst } from "lucide-react";

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const Sidebar = ({ activeComponent, setActiveComponent }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
      } else if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <aside
        className={`h-full bg-base border-r border-active text-accent transition-all duration-300 ease-in-out ${
          isOpen ? "w-100 md:w-6/12 lg:w-4/12" : "w-16"
        }`}
      >
        <nav className="flex flex-col h-full">
          <div
            className={`p-4 pb-2 flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            {isOpen && (
              // <h1 className="overflow-hidden text-sm">
              //   Inventory Mangement System
              // </h1>
              <span className="flex items-center gap-2 text-accent">
                <img src={isLogo} alt="IS-LOGO" className="w-8" />
                <span className="hidden md:inline">Inventory System</span>
                <span className="md:hidden">IS</span>
              </span>
            )}
            <button
              className="p-1.5 rounded-lg bg-secondary hover:bg-active transition-all duration-200"
              onClick={handleClick}
            >
              <ChevronFirst
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>
          <hr className="border-b border-active" />
          <SidebarItem
            isOpen={isOpen}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
