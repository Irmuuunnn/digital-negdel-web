/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    if (phone.length !== 8) {
      setError("Утасны дугаар 8 оронтой байх шаардлагатай");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("https://api.evseg.store/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          password: otp,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.body) {
        localStorage.setItem("token", data.body.token);
        
        if (data.body.is_onboarded === false) {
          localStorage.setItem("user_id", data.body.id.toString());
          localStorage.setItem("phone", data.body.phone)
          navigate("/register");
        } else {
          navigate("/");
        }
      } else {
        // Handle error cases
        setError(data.message || "Утас эсвэл нууц үг буруу байна");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl bg-white p-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Нэвтрэх
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <img src="../../../evseg-blue.webp" alt="evseg" className="w-8" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-center mb-2">Тавтай морилно уу</h3>
          <p className="text-center text-gray-500 text-sm mb-6">
            Утасны дугаараа оруулан нэвтэрнэ үү
          </p>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">Утасны дугаар</Label>
              <Input
                type="tel"
                placeholder="99123456"
                maxLength={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Нууц үг (OTP)</Label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex justify-between text-sm text-blue-500 mt-1">
              <button type="button" className="hover:underline">
                Нууц үгээ мартсан
              </button>
              <button type="button" className="hover:underline">
                Дахин илгээх
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
            </Button>

            <p className="text-center text-sm mt-3">
              Шинэ хэрэглэгч үү?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-500 hover:underline font-medium"
              >
                Бүртгүүлэх
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;