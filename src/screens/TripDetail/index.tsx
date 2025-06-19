import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputNumber, Select } from "antd";
import { ArrowLeft, MapPin, CheckCircle } from "lucide-react";

const TripDetailsScreen = () => {
  const navigate = useNavigate();

  const [country, setCountry] = useState<string | undefined>();
  const [store, setStore] = useState<string | undefined>();
  const [tourists, setTourists] = useState<number>(1);
  const [tripStarted, setTripStarted] = useState(false);
  const [tripCode, setTripCode] = useState<number | null>(null);

  const handleStartTrip = () => {
    if (country && store && tourists) {
      const randomCode = Math.floor(Math.random() * 50) + 1; // 1-50 хооронд random
      setTripCode(randomCode);
      setTripStarted(true);
    } else {
      alert("Бүх талбарыг бөглөнө үү.");
    }
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
        <h1 className="text-lg font-semibold">Аяллын дэлгэрэнгүй</h1>
      </div>

      {/* Хэрэв аялал эхлээгүй бол */}
      {!tripStarted && (
        <div className="p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Аяллын дэлгэрэнгүй</h2>
          <p className="text-gray-600 mb-6">Аяллын мэдээллийг оруулна уу</p>

          <div className="text-left space-y-4">
            <div>
              <label className="text-sm font-medium">Улс</label>
              <Select
                className="w-full mt-1"
                placeholder="Улс сонгоно уу"
                options={[
                  { label: "Монгол", value: "Монгол" },
                  { label: "БНХАУ", value: "БНХАУ" },
                  { label: "ОХУ", value: "ОХУ" },
                ]}
                onChange={(value) => setCountry(value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Дэлгүүр</label>
              <Select
                className="w-full mt-1"
                placeholder="Дэлгүүр сонгоно уу"
                options={[
                  { label: "State Department Store", value: "State Department Store" },
                  { label: "Evseg Cashmere", value: "Evseg Cashmere" },
                  { label: "Modern Nomads", value: "Modern Nomads" },
                ]}
                onChange={(value) => setStore(value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Жуулчдын тоо</label>
              <InputNumber
                min={1}
                defaultValue={1}
                className="w-full mt-1"
                onChange={(value) => setTourists(value as number)}
              />
            </div>

            <Button
              type="primary"
              className="bg-black text-white w-full h-10 mt-4"
              onClick={handleStartTrip}
            >
              Аялал эхлүүлэх
            </Button>
          </div>
        </div>
      )}

      {/* Хэрэв аялал эхэлсэн бол */}
      {tripStarted && (
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">
              Амжилттай аялал эхэллээ!
            </h2>
            <p className="text-gray-600 text-sm mb-4">Аяллын код:</p>
            <div className="text-4xl font-extrabold text-gray-900 mb-6">{tripCode}</div>
          </div>

          <div className="text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Улс:</span>
              <span>{country}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Дэлгүүр:</span>
              <span>{store}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Жуулчдын тоо:</span>
              <span>{tourists}</span>
            </div>
          </div>

          <Button
            type="primary"
            onClick={() => navigate("/home")}
            className="w-full font-semibold py-2 h-12 rounded-lg"
            style={{
              backgroundColor: "#1f2937",
              borderColor: "#1f2937",
            }}
          >
            Нүүр хуудас руу буцах
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripDetailsScreen;
