/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const username = localStorage.getItem("user_name") || "User";

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("permission");
    localStorage.removeItem("userName");
    await navigate("/login");
  };

  const dropdownItems: any = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Settings",
    },
    {
      key: "3",
      type: "divider",
    },
    {
      key: "4",
      label: "Sign out",
      onClick: logout,
    },
  ];

  const routeNames: Record<string, string> = {
    "/": 'Home',
    "/users": "Users",
    "/pool": "Pool"
  };

  const currentRouteName = routeNames[location.pathname] || "Page";

  return (
    <nav className="p-4 shadow-lg bg-white flex w-full items-center justify-between border-b border-gray-200 h-16">
      <div className="text-gray-800 text-lg font-semibold">
        {currentRouteName}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              transition: "all 0.3s",
              backgroundColor: "#f0f0f0",
            }}
          >
            <UserOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
