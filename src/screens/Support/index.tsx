// src/pages/SupportPage.tsx

import React from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const SupportPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: object) => {
    console.log("Contact form values:", values);
    message.success("Амжилттай илгээгдлээ");
    form.resetFields();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <Title level={2} className="text-center mb-4">
          Тусламжийн төв
        </Title>
        <Paragraph>
          Аппын аливаа асуудал, санал хүсэлтээ доорх хэлбэрээр бидэнд илгээнэ үү:
        </Paragraph>

        <div className="mb-6 space-y-2">
          <Paragraph className="flex items-center">
            <MailOutlined className="mr-2 text-blue-500" />
            <a href="mailto:support@evseg.store">
              support@evseg.store
            </a>
          </Paragraph>
          <Paragraph className="flex items-center">
            <PhoneOutlined className="mr-2 text-blue-500" />
            <a href="tel:+97699110000">
              +976 9911 0000
            </a>
          </Paragraph>
        </div>

        <Title level={4} className="mb-3">
          Холбоо барих форм
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Таны нэр"
            name="name"
            rules={[{ required: true, message: "Нэрээ оруулна уу" }]}
          >
            <Input placeholder="Жишээ: Бат-Эрдэнэ" />
          </Form.Item>

          <Form.Item
            label="Имэйл"
            name="email"
            rules={[
              { required: true, message: "Имэйлээ оруулна уу" },
              { type: "email", message: "Зөв имэйл хаяг оруулна уу" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Санал, тулгарч буй асуудал"
            name="message"
            rules={[{ required: true, message: "Санал эсвэл асуудлаа бичнэ үү" }]}
          >
            <Input.TextArea rows={4} placeholder="Тайлбар бичнэ үү" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              Илгээх
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SupportPage;
