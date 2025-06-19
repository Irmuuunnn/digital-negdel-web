/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SignupScreen = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (phone.length !== 8) {
      setError("Утасны дугаар 8 оронтой байх шаардлагатай");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("https://api.evseg.store/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.body?.password) {
        // Ирсэн password-ыг хадгалах
        setGeneratedOtp(data.body.password);
        setStep("otp");
      } else {
        setError(data.message || "Бүртгүүлэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    if (otp.length !== 6) {
      setError("OTP 6 оронтой байх ёстой");
      return;
    }

    if (otp !== generatedOtp) {
      setError("OTP буруу байна");
      return;
    }
    
    // Success toast харуулах
    toast.success("Амжилттай баталгаажлаа!");
    
    // 2 секунд delay аваад navigate хийх
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl bg-white p-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Бүртгүүлэх</h2>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          {step === "phone" && (
            <>
              <p className="text-center text-gray-500 text-sm mb-6">
                Та гар утасны дугаараа ашиглан бүртгүүлнэ үү.
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">Таны дугаар</Label>
                  <Input
                    type="tel"
                    placeholder="99999999"
                    maxLength={8}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-400 placeholder-opacity-50"
                    required
                  />
                </div>
                <span className="text-xs text-center text-gray-400 font-thin">Системд нэвтрэх нууц үг таны гар утсанд мессежээр ирэх болно.</span>
                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {loading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
                </Button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-center text-gray-500 text-sm mb-6">
                {phone} дугаарт ирсэн OTP-г оруулна уу
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">OTP</Label>
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
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  Баталгаажуулах
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupScreen;