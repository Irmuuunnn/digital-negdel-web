/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const LoginScreen = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://auth.skypay.mn/api/v1/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: userName, password }),
        }
      );

      const data = await response.json();
      if (data.status) {
        await localStorage.setItem("token", data.data.token);
        await localStorage.setItem("user_name", data.data.admin.user_name);
        await localStorage.setItem(
          "permission",
          JSON.stringify(data.data.permission)
        );
        await localStorage.setItem("expires_at", data.data.expires_at);
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Admin",
      children: renderLoginForm(),
    },
    {
      key: "2",
      label: "Company",
      children: renderLoginForm(),
    },
    {
      key: "3",
      label: "Driver",
      children: renderLoginForm(),
    },
    {
      key: "4",
      label: "Finance",
      children: renderLoginForm(),
    },
    {
      key: "5",
      label: "Guide",
      children: renderLoginForm(),
    },
    {
      key: "6",
      label: "Store",
      children: renderLoginForm(),
    },
  ];

  function renderLoginForm() {
    return (
      <>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label className="text-gray-800 font-medium">Username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <Label className="text-gray-800 font-medium">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </Button>
        </form>
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-700 to-blue-400">
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="../../../evseg-blue.webp"
          alt="Logo"
          className="w-2/3 max-w-sm drop-shadow-2xl"
        />
      </div>

      <div className="h-full w-1/2 flex items-center justify-center bg-white backdrop-blur-lg">
        <Card className="w-full shadow-2xl bg-white/90 p-8 rounded-2xl m-8">
          <CardContent>
            {/* <img
              src="../../../evseg-blue.webp"
              alt="Logo"
              className="w-32 drop-shadow-2xl"
            /> */}
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={tabItems}
              centered
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
