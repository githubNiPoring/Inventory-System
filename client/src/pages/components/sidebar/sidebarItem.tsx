import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

import {
  House,
  Package,
  ArrowBigDown,
  ArrowBigUp,
  ChartColumnBig,
  LogOut,
} from "lucide-react";

interface SidebarItemProps {
  isOpen: boolean;
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const SidebarItem = ({
  isOpen,
  activeComponent,
  setActiveComponent,
}: SidebarItemProps) => {
  //   const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "Dashboard", icon: House, label: "Dashboard" },
    { id: "Products", icon: Package, label: "Products" },
    { id: "StocksIn", icon: ArrowBigDown, label: "Stocks In" },
    { id: "StocksOut", icon: ArrowBigUp, label: "Stocks Out" },
    { id: "Reports", icon: ChartColumnBig, label: "Reports" },
  ];

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post(
        `${BASE_URL}/api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full m-2">
        <div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeComponent === item.id;

            return (
              <div
                key={item.id}
                className={`flex items-center cursor-pointer transition-colors duration-200 my-2 ${
                  isOpen
                    ? "justify-start gap-3 p-3 rounded-xl"
                    : "justify-center w-12 h-12 rounded-xl"
                } ${
                  isActive
                    ? "bg-active2 text-accent rounded-xl"
                    : "hover:bg-secondary text-accent"
                }`}
                onClick={() => setActiveComponent(item.id)}
              >
                <Icon size={23} />
                {isOpen && (
                  <h2 className="overflow-hidden text-sm">{item.label}</h2>
                )}
              </div>
            );
          })}
        </div>

        {/* Log Out */}
        <div
          className={`flex items-center text-red-400 hover:bg-secondary transition-colors duration-200 ${
            isOpen
              ? "justify-start gap-3 p-3 rounded-xl"
              : "justify-center w-12 h-12 rounded-xl"
          }`}
          onClick={handleLogOut}
        >
          <LogOut size={23} />
          {isOpen && <h2 className="overflow-hidden text-sm">Log Out</h2>}
        </div>
      </div>
    </>
  );
};

export default SidebarItem;
