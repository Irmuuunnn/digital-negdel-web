import { ArrowLeft, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";

const StartTripScreen = () => {
  const navigate = useNavigate();
  const [companionType, setCompanionType] = useState<string | null>(null);
  const [person, setPerson] = useState<string | null>(null);
  const [personOptions, setPersonOptions] = useState<{ label: string; value: string }[]>([]);

  // localStorage дээр байгаа type-г шалгаж, options-оо бэлдэнэ
  useEffect(() => {
    const type = localStorage.getItem("type");

    if (type === "жолооч") {
      setPersonOptions([
        { label: "Хөтөч | Ж.Бат-Эрдэнэ 99234673", value: "Ж.Бат-Эрдэнэ" },
        { label: "Хөтөч | Д.Болдоо 995233456", value: "Д.Болдоо" },
        { label: "Хөтөч | Д.Дамирна 88655345", value: "Д.Дамирна" },
        { label: "Хөтөч | Б.Батсүх 91913445", value: "Б.Батсүх" },
      ]);
    } else if (type === "хөтөч") {
      setPersonOptions([
        { label: "Жолооч | Б.Энхтүвшин - 99112233", value: "Б.Энхтүвшин" },
        { label: "Жолооч | С.Цогбаяр - 88553344", value: "С.Цогбаяр" },
        { label: "Жолооч | Д.Ганхуяг - 99334455", value: "Д.Ганхуяг" },
        { label: "Жолооч | М.Эрдэнэбаяр - 99887766", value: "М.Эрдэнэбаяр" },
        { label: "Жолооч | Н.Төгсжаргал - 94445566", value: "Н.Төгсжаргал" },
        { label: "Жолооч | Ч.Батчимэг - 99664411", value: "Ч.Батчимэг" },
        { label: "Жолооч | Л.Отгонбаяр - 95776688", value: "Л.Отгонбаяр" },
        { label: "Жолооч | Г.Сувдаа - 88224455", value: "Г.Сувдаа" },
        { label: "Жолооч | Х.Цэнд-Аюуш - 99778899", value: "Х.Цэнд-Аюуш" },
        { label: "Жолооч | Ж.Хишигт - 88990011", value: "Ж.Хишигт" },
      ]);
    }
  }, []);

  const handleContinue = () => {
    if (!companionType || !person) return;
    navigate("/trip-details", { state: { companionType, person } });
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
        <p className="text-gray-600 mb-6">Аяллын хамтрагчдын мэдээллийг оруулна уу.</p>

        <div className="text-left mb-4">
          <label className="text-sm font-medium">Тур компани сонгох (Заавал биш):</label>
          <Select
            className="w-full mt-1"
            placeholder="Компани сонгох"
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

        {/* Хөтөч эсвэл жолооч сонгох */}
        {personOptions.length > 0 && (
          <div className="text-left mb-4">
            <label className="text-sm font-medium">Хамтрагч (Заавал биш):</label>
            <Select
              className="w-full mt-1"
              placeholder="Хамтрагч сонгох"
              onChange={(value) => setPerson(value)}
              options={personOptions}
            />
          </div>
        )}

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
