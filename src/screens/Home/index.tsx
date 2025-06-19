/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, Gift, Play, User, Package, Calendar, Store } from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

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
      amount: 5000,
      date: "2025/06/18",
      store: "Evseg Cashmere",
      status: "Төлөгдсөн",
    },
    {
      amount: 3000,
      date: "2025/06/16",
      store: "Modern Nomads",
      status: "Хүлээгдэж буй",
    },
    {
      amount: 2000,
      date: "2025/06/14",
      store: "State Department Store",
      status: "Татгалзсан",
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
      setUserData(data);
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
                {userData ? userData.name : "Уншиж байна..."}
              </h1>
              <p className="text-blue-100 text-sm">🚗 Жолооч</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500 p-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">?</span>
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500 p-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                  <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
                  <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
                </svg>
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
                          ? "bg-black text-white"
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
