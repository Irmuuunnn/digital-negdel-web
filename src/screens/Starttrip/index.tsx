// StartTripScreen.tsx
import { ArrowLeft, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Select } from "antd";
import { useState } from "react";

const StartTripScreen = () => {
  const navigate = useNavigate();
  const [companionType, setCompanionType] = useState<string | null>(null);

  const handleContinue = () => {
    if (!companionType) return;
    navigate("/trip-details", { state: { companionType } });
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center space-x-4">
        <Button
          type="text"
          icon={<ArrowLeft />}
          className="text-white"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold">Аялал эхлүүлэх</h1>
      </div>

      {/* Body */}
      <div className="p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Аялал эхлүүлэх</h2>
        <p className="text-gray-600 mb-6">Та хэнтэй хамт аялал хийх вэ?</p>

        <div className="text-left mb-4">
          <label className="text-sm font-medium">Хамтрагчийн төрөл</label>
          <Select
            className="w-full mt-1"
            placeholder="Хамтрагч сонгоно уу"
            onChange={(value) => setCompanionType(value)}
            options={[
              { label: "Монкристалл Тур ХХК", value: "Монкристалл Тур ХХК" },
              { label: "Эйч Ба Эй Андуудын Нөхөрлөл", value: "Эйч Ба Эй Андуудын Нөхөрлөл" },
              { label: "Чингис хааны хүрээ ХХК", value: "Чингис хааны хүрээ ХХК" },
              { label: "Шинэ соёл тэлмэн ХХК", value: "Шинэ соёл тэлмэн ХХК" },
              { label: "Хэппи Тур ХХК", value: "Хэппи Тур ХХК" },
              { label: '"ВИКТОРИЯ ХАППИ ТУР" ХХК', value: '"ВИКТОРИЯ ХАППИ ТУР" ХХК' },
              { label: "Скай Уолкерс Тур", value: "Скай Уолкерс Тур" },
              { label: "Кереге Травел ХХК", value: "Кереге Травел ХХК" },
              { label: "АРИУНСОЛОНГО ХХК", value: "АРИУНСОЛОНГО ХХК" },
            ]}
          />
        </div>

        <Button
          type="primary"
          className="bg-gray-900 text-white w-full h-10 rounded-md mt-4"
          onClick={handleContinue}
          disabled={!companionType}
        >
          Үргэлжлүүлэх
        </Button>
      </div>
    </div>
  );
};

export default StartTripScreen;
