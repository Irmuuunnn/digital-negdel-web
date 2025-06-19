/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button, Input, Select, Spin, message } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";

const carMarkOptions = [
  { value: "TOY", label: "Тойота" },
  { value: "HON", label: "Хонда" },
  { value: "HYU", label: "Хьюндай" },
  { value: "KIA", label: "Киа" },
  { value: "NIS", label: "Ниссан" },
  { value: "FOR", label: "Форд" },
  { value: "CHE", label: "Шевролет" },
  { value: "MAZ", label: "Мазда" },
  { value: "BMW", label: "Бээмвэ" },
  { value: "MER", label: "Мерседес-Бенц" },
  { value: "LEX", label: "Лексус" },
  { value: "MIT", label: "Мицүбиши" },
  { value: "SUB", label: "Субару" },
  { value: "AUD", label: "Ауди" },
  { value: "VW", label: "Фольксваген" },
  { value: "ISU", label: "Исузу" },
  { value: "SUZ", label: "Сузуки" },
  { value: "JEEP", label: "Жийп" },
  { value: "TES", label: "Тесла" },
];

const bankOptions = [
  { value: "TDB", label: "Худалдаа, хөгжлийн банк" },
  { value: "KHAN", label: "Хаан банк" },
  { value: "GLMT", label: "Голомт банк" },
  { value: "XAC", label: "ХасБанк" },
  { value: "CAP", label: "Капитрон банк" },
  { value: "NIB", label: "Үндэсний хөрөнгө оруулалтын банк" },
  { value: "CHK", label: "Чингис Хаан банк" },
  { value: "CRB", label: "Кредит банк" },
  { value: "TRB", label: "Транс банк" },
  { value: "ARB", label: "Ариг банк" },
  { value: "BGD", label: "Богд банк" },
  { value: "MBK", label: "M банк" },
  { value: "STB", label: "Төрийн банк" },
  { value: "DBM", label: "Хөгжлийн банк" }
];

const regex = /^[А-ЯӨҮ]{3}\s[0-9]{4}$/;

const RegisterTypeScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [carInfo, setCarInfo] = useState({
    mark: "",
    plateNumber: "",
  });
  const [personalInfo, setPersonalInfo] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    registrationNumber: "",
  });
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
  });

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

  const findCarMarkValue = (carModel: string) => {
    if (!carModel) return "";
    
    const exactMatch = carMarkOptions.find(option => option.value === carModel);
    if (exactMatch) return exactMatch.value;
    
    const labelMatch = carMarkOptions.find(option => 
      option.label.toLowerCase().includes(carModel.toLowerCase()) ||
      carModel.toLowerCase().includes(option.label.toLowerCase())
    );
    if (labelMatch) return labelMatch.value;
    
    return "";
  };

  const findBankValue = (bankName: string) => {
    if (!bankName) return "";
    
    const exactMatch = bankOptions.find(option => option.value === bankName);
    if (exactMatch) return exactMatch.value;
    
    const labelMatch = bankOptions.find(option => 
      option.label.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(option.label.toLowerCase())
    );
    if (labelMatch) return labelMatch.value;
    
    return "";
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        
        if (!userId) {
          message.error('Хэрэглэгчийн ID олдсонгүй');
          setLoading(false);
          return;
        }

        const userData = await fetchUserData(userId);
        
        if (userData) {
          setPersonalInfo({
            lastName: userData.surname || "",
            firstName: userData.name || "",
            phone: userData.phone || "",
            registrationNumber: userData.rd || "",
          });

          setBankInfo({
            bankName: findBankValue(userData.bank_name) || userData.bank_name || "",
            accountNumber: userData.account_number || "",
          });

          if (userData.type) {
            if (userData.type === "жолооч" || userData.type === "driver") {
              setSelectedType("driver");
              setCarInfo({
                mark: findCarMarkValue(userData.car_model) || userData.car_model || "",
                plateNumber: userData.plate_number || "",
              });
            } else if (userData.type === "хөтөч" || userData.type === "guide") {
              setSelectedType("guide");
            }
          }

          console.log('Loaded user data:', userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        message.error('Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (currentStep === 5) {
      const finalData = buildFinalData();
      console.log("Баталгаажуулах хэсэг нээгдэх үед:", finalData);
    }
  }, [currentStep, selectedType, personalInfo, bankInfo, carInfo]);

  const buildFinalData = () => {
    const baseData = {
      account_number: bankInfo.accountNumber,
      bank_name: bankInfo.bankName,
      name: personalInfo.firstName,
      surname: personalInfo.lastName,
      rd: personalInfo.registrationNumber,
      type: selectedType === "guide" ? "хөтөч" : "жолооч"
    };

    if (selectedType === "driver") {
      return {
        ...baseData,
        car_model: carInfo.mark,
        plate_number: carInfo.plateNumber
      };
    }

    return {
      ...baseData,
      car_model: "",
      plate_number: ""
    };
  };

  const handleTypeSelect = (type: any) => {
    setSelectedType(type);
    if (type === "guide") {
      setCurrentStep(3); 
    } else if (type === "driver") {
      setCurrentStep(2); 
    }
  };

  const handleCarInfoNext = () => {
    if (carInfo.mark && carInfo.plateNumber && regex.test(carInfo.plateNumber)) {
      setCurrentStep(3);
    }
  };

  const handlePersonalInfoNext = () => {
    if (personalInfo.lastName && personalInfo.firstName && personalInfo.registrationNumber) {
      setCurrentStep(4);
    }
  };

  const handleBankInfoNext = () => {
    if (bankInfo.bankName && bankInfo.accountNumber) {
      setCurrentStep(5);
    }
  };

  const handleConfirmationInfoNext = () => {
    handleFinalSubmit();
    setCurrentStep(6);
  }

  const handleFinalSubmit = async () => {
    const finalData = buildFinalData();
    console.log("Бүртгэлийн мэдээлэл (API format):", finalData);
    alert("Бүртгэл амжилттай боллоо!");
    // const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');
        try {
          const response = await fetch(`https://api.evseg.store/api/v1/auth/update-user/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalData),
          });
    
          if (!response.ok) {
            throw new Error('Failed to update user data');
          }
    
          const data = await response.json();
        //   navigate('/');
          return data;
        } catch (error) {
          console.error('Error updating user data:', error);
          throw error;
        }
  };

  const goBack = () => {
    if (currentStep === 1) {
      window.history.back();
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedType(null);
    } else if (currentStep === 3) {
      if (selectedType === "guide") {
        setCurrentStep(1);
        setSelectedType(null);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setCurrentStep(4);
    }
  };

  const getCarMarkLabel = (value: string) => {
    const option = carMarkOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getBankLabel = (value: string) => {
    const option = bankOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex justify-between bg-blue-600 text-white items-center">
          <Button
            className="border-none shadow-none m-4"
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
          />
          <div className="py-4 px-6 text-lg font-semibold">Бүртгүүлэх</div>
          <div className="w-12"></div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Мэдээлэл ачаалж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-between bg-blue-600 text-white items-center">
        <Button
          className="border-none shadow-none m-4"
          icon={<ArrowLeftOutlined />}
          onClick={goBack}
        />
        <div className="py-4 px-6 text-lg font-semibold">Бүртгүүлэх</div>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Step 1: User Type Selection */}
        {currentStep === 1 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Та ямар хэрэглэгч вэ?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Өөрийн төрлөө сонгоно уу
            </p>

            <div className="space-y-4 w-full max-w-md">
              <div
                onClick={() => handleTypeSelect("guide")}
                className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${
                  selectedType === "guide" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Хөтөч</p>
                    <p className="text-gray-500 text-sm">Аялал жуулчлалын хөтөч</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleTypeSelect("driver")}
                className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${
                  selectedType === "driver" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium">Жолооч</p>
                    <p className="text-gray-500 text-sm">
                      Тээврийн хэрэгслийн жолооч
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Car Information (Driver only) */}
        {currentStep === 2 && selectedType === "driver" && (
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Машины мэдээлэл
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Тээврийн хэрэгслийн мэдээллийг оруулна уу
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Машины марк</label>
                <Select
                  className="w-full"
                  placeholder="Марк сонгоно уу"
                  options={carMarkOptions}
                  value={carInfo.mark || undefined}
                  onChange={(value) => setCarInfo({ ...carInfo, mark: value })}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Улсын дугаар</label>
                <Input
                  placeholder="жишээ: УБА 1234"
                  value={carInfo.plateNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (/^[А-ЯӨҮ\s0-9]*$/.test(value)) {
                      setCarInfo({ ...carInfo, plateNumber: value });
                    }
                  }}
                  status={
                    carInfo.plateNumber === "" || regex.test(carInfo.plateNumber)
                      ? ""
                      : "error"
                  }
                />
                {carInfo.plateNumber && !regex.test(carInfo.plateNumber) && (
                  <div className="text-red-500 text-sm mt-1">
                    Зөв формат: УБА 1234
                  </div>
                )}
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleCarInfoNext}
              disabled={!carInfo.mark || !carInfo.plateNumber || !regex.test(carInfo.plateNumber)}
              className="w-full font-semibold py-2 h-12 rounded-lg"
              style={{
                backgroundColor: "#2563EB",
                borderColor: "#2563EB",
              }}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {currentStep === 3 && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserOutlined className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Хувийн мэдээлэл</h2>
              <p className="text-gray-600">
                Та өөрийн мэдээллийг оруулна уу
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Овог</label>
                <Input
                  placeholder="Овог"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Нэр</label>
                <Input
                  placeholder="Нэр"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                />
              </div>

              {/* <div>
                <label className="block font-medium mb-2">Утас</label>
                <Input
                  placeholder="Утас"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                />
              </div> */}

              <div>
                <label className="block font-medium mb-2">Регистрийн дугаар</label>
                <Input
                  placeholder="АА12345678"
                  value={personalInfo.registrationNumber}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, registrationNumber: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="primary"
              onClick={handlePersonalInfoNext}
              disabled={
                !personalInfo.lastName ||
                !personalInfo.firstName ||
                !personalInfo.registrationNumber
              }
              className="w-full font-semibold py-2 h-12 rounded-lg"
              style={{
                backgroundColor: "#2563EB",
                borderColor: "#2563EB",
              }}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        )}

        {/* Step 4: Bank Information */}
        {currentStep === 4 && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Банкны мэдээлэл</h2>
              <p className="text-gray-600">
                Төлбөр хүлээн авах данс дээрээ мэдээлэл
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Банкны нэр</label>
                <Select
                  className="w-full"
                  placeholder="Банкаа сонгоно уу"
                  value={bankInfo.bankName || undefined}
                  onChange={(value) => setBankInfo({ ...bankInfo, bankName: value })}
                  options={bankOptions}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Дансны дугаар</label>
                <Input
                  placeholder="1234567890"
                  value={bankInfo.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setBankInfo({ ...bankInfo, accountNumber: value });
                  }}
                  maxLength={20}
                />
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleBankInfoNext}
              disabled={!bankInfo.bankName || !bankInfo.accountNumber}
              className="w-full font-semibold py-2 h-12 rounded-lg"
              style={{
                backgroundColor: "#2563EB",
                borderColor: "#2563EB",
              }}
            >
              Үргэлжлүүлэх
            </Button>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-2">Баталгаажуулалт</h2>
                <p className="text-gray-600 text-sm">
                  Бүх мэдээллээ зөв оруулсан эсэхээ дахин шалгана уу
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Төрөл:</span>
                  <span className="font-medium text-red-600">
                    {selectedType === "guide" ? "🎭 Хөтөч" : "🚗 Жолооч"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Утас:</span>
                  <span className="font-medium">{personalInfo.phone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Нэр:</span>
                  <span className="font-medium">{personalInfo.lastName} {personalInfo.firstName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Регистр:</span>
                  <span className="font-medium">{personalInfo.registrationNumber}</span>
                </div>

                {selectedType === "driver" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Марк:</span>
                      <span className="font-medium">{getCarMarkLabel(carInfo.mark)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Улсын дугаар:</span>
                      <span className="font-medium">{carInfo.plateNumber}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Банк:</span>
                  <span className="font-medium">{getBankLabel(bankInfo.bankName)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Данс:</span>
                  <span className="font-medium">{bankInfo.accountNumber}</span>
                </div>
              </div>

              <Button
                type="primary"
                onClick={handleConfirmationInfoNext}
                className="w-full font-semibold py-2 h-12 rounded-lg mt-6"
                style={{
                  backgroundColor: "#1f2937",
                  borderColor: "#1f2937",
                }}
              >
                Баталгаажуулах
              </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-sm mb-2">API илгээх өгөгдөл:</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(buildFinalData(), null, 2)}
              </pre>
            </div>
          </div>
        )}
        {/* Step 6: Success Screen */}
        {currentStep === 6 && (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleOutlined className="text-green-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Амжилттай бүртгэгдлээ!
                </h2>
                <p className="text-gray-600 text-sm">
                  Таны бүртгэл амжилттай хадгалагдлаа. Одоо апп ашиглан ажиллаж эхэлнэ үү.
                </p>
              </div>

              <Button
                type="primary"
                onClick={() => {
                  // Navigate to main app or dashboard
                  console.log("Navigate to main app");
                  // window.location.href = '/dashboard';
                }}
                className="w-full font-semibold py-2 h-12 rounded-lg"
                style={{
                  backgroundColor: "#1f2937",
                  borderColor: "#1f2937",
                }}
              >
                Нүүр хуудас руу очих
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterTypeScreen;