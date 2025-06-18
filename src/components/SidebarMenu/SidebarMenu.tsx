import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
  
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

interface RouteItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  permission?: string;
  children?: RouteItem[];
}

const routes: RouteItem[] = [
  { path: "/", label: "Home", icon: <HomeOutlined /> },

  { path: "/users", label: "Users", icon: <UserOutlined />, permission: "users" },
];

const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userPermissions, setUserPermissions] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const permissionData = localStorage.getItem("permission");
    if (permissionData) {
      setUserPermissions(JSON.parse(permissionData));
    }
  }, []);

  const visibleRoutes = routes.filter((route) => {
    if (!route.permission) return true;
    return userPermissions[route.permission];
  });

  const buildMenuItems = (items: RouteItem[]): MenuProps["items"] => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.label,
          icon: item.icon,
          label: item.label,
          children: item.children.map((child) => ({
            key: child.path,
            icon: child.icon,
            label: <Link to={child.path}>{child.label}</Link>,
          })),
        };
      }

      return {
        key: item.path,
        icon: item.icon,
        label: <Link to={item.path}>{item.label}</Link>,
      };
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    window.location.href = "/login";
  };

  const userName = localStorage.getItem("user_name") || "User";

  const dropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  const openKeys = (): string[] => {
    for (const route of visibleRoutes) {
      if (route.children?.some((c) => c.path === location.pathname)) {
        return [route.label];
      }
    }
    return [];
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className="relative z-0">
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        width={220}
        style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.1)", zIndex: 1000 }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "start",
            paddingLeft: collapsed ? 0 : 20,
            fontWeight: "bold",
            fontSize: 18,
            color: "darkblue",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
           <div className="flex justify-center items-center h-16 border-b px-3">
        <Link to="/" className="flex items-center gap-2">
          {!collapsed && (
             <img
             src="../../../evseg-blue.webp"
             alt="Logo"
             className="w-2/3 max-w-sm drop-shadow-2xl ml-6"
           />
          )}
        </Link>
      </div>
        
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys()}
          items={buildMenuItems(visibleRoutes)}
          onClick={({ key }) => {
            if (key.startsWith("/")) navigate(key);
          }}
        />

        <div
          onClick={logout}
          className="absolute bottom-4 left-4 right-4 border rounded-lg text-center py-2 hover:bg-gray-100 cursor-pointer"
        >
          <LogoutOutlined className="text-blue-800 mr-2" />
          {!collapsed && "Logout"}
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "darkblue", marginRight: 8 }}
              />
              <span className="text-blue-800 font-semibold">{userName}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarMenu;