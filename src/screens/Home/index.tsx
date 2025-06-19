/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, Gift, Play, User, Package, Calendar, Store } from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";


const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate()

  const recentTrips = [
    { destination: "Үүсгэгдсэн", count: "3 аялал" },
    { destination: "Хүлээгдэж буй", count: "1 аялал" },
    { destination: "Дууссан", count: "5 аялал", active: true }
  ];

  const rewards = [
    {
      code: "IMASDX",
      id : 44,
      amount: 5000,
      date: "2025/06/18",
      store: "Evseg Cashmere",
      status: "Төлөгдсөн",
      desc: "Америк - 10 аялагч (7 эрэгтэй, 3 эмэгтэй)"
    },
    {
      code: "BASDAS",
      id: 3,
      amount: 3000,
      date: "2025/06/16",
      store: "Modern Nomads",
      status: "Хүлээгдэж буй",
      desc: "Солонгос - 5 аялагч (4 эрэгтэй, 1 эмэгтэй)"
    },
    {
      code: "LLASXZ",
      id: 7,
      amount: 2000,
      date: "2025/06/14",
      store: "State Department Store",
      status: "Татгалзсан",
      desc: "Япон - 15 аялагч (5 эрэгтэй, 10 эмэгтэй)"
    },
  ];

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const response = await fetch(`https://api.evseg.store/api/v1/auth/get-user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data.body;
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Хэрэглэгчийн мэдээлэл татахад алдаа гарлаа');
        return null;
      }
    };

    const loadUser = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        message.error("Хэрэглэгчийн ID олдсонгүй");
        return;
      }
      const data = await fetchUserData(userId);
      if (data) {
        setUserData(data);
        localStorage.setItem("type", data.type); 
      }
    };
    

    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sm:p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold">
                {userData ? userData.body.name : "Уншиж байна..."}
              </h1>
              <p className="text-blue-100 text-sm">🚗 {userData?.body.type}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500 p-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">?</span>
              </div>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-500 p-2"
                onClick={() => {
                    localStorage.clear(); 
                    navigate("/login");           
                }}
                >
                <div className="w-12 h-12 sm:w-7 sm:h-7 flex items-center justify-center">
                    <LogOut className="w-12 h-12" />
                </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "profile" && (
        <>
          {/* Stats Cards */}
          <div className="px-4 sm:px-6 -mt-8 mb-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-white shadow-lg rounded-2xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-2" />
                  <div className="text-xl font-bold text-green-500">15%</div>
                  <div className="text-xs text-gray-500">Урамшууллын хувь</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg rounded-2xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <MapPin className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                  <div className="text-xl font-bold text-gray-800">28</div>
                  <div className="text-xs text-gray-500">Нийт аялал</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg rounded-2xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Gift className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                  <div className="text-lg font-bold text-gray-800">₮94,500</div>
                  <div className="text-xs text-gray-500">Нийт урамшуулал</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Trips Section */}
          <div className="px-4 mb-6">
            <Card className="bg-white shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Идэвхтэй аяллууд</h2>
                <div className="space-y-4">
                  {recentTrips.map((trip, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{trip.destination}</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trip.active
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {trip.count}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                    className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
                    onClick={() => navigate("/start-trip")} 
                    >
                    <Play className="w-5 h-5" />
                    <span>Аялал эхлүүлэх</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "rewards" && (
        <div className="px-4 my-6">
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Урамшууллын түүх</h2>
              <p className="text-sm text-gray-500 mb-4">Таны авсан урамшууллын жагсаалт</p>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div key={index} className="border rounded-xl p-4 bg-white shadow-sm flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold text-lg">₮{reward.amount.toLocaleString()}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        reward.status === "Төлөгдсөн"
                          ? "bg-green-500 text-white"
                          : reward.status === "Хүлээгдэж буй"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-red-500 text-white"
                      }`}>
                        {reward.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{reward.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <Store className="w-4 h-4" />
                      <span>{reward.store}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{reward.code}</span>
                    </div>
                    <span className="text-xs text-gray-400"> {reward.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center py-4 ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "text-gray-500"
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Нүүр хуудас</span>
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex flex-col items-center justify-center py-4 ${
              activeTab === "rewards"
                ? "bg-blue-600 text-white"
                : "text-gray-500"
            }`}
          >
            <Package className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Урамшуулал</span>
          </button>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default HomeScreen;
