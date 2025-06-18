/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AntdDataTable from "@/components/Datatable";
import { Copy } from "lucide-react";
import { Card, Spin, Tag } from "antd";

interface Transaction {
  ID: string;
  Amount: number;
  Status: string;
  PaymentMethod: string;
  InvoiceID: string;
  Type: string;
  CreatedAt: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  phone: string | null;
  created_at: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  profile_picture: string;
  identities: {
    provider: string;
    last_used_at: string | null;
  }[];
  user_balances: {
    WalletID: string;
    Currency: string;
    Balance: number;
  }[];
  transactions: Transaction[];
}

interface UserDetailModalProps {
  userId: any;
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const UserDetailModal = ({ userId, isOpen, onClose }: UserDetailModalProps) => {
  const ApiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId, currentPage]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ApiUrl}/users/${userId}`);
      const response = await res.json();
      if (response.data) {
        setUser(response.data);
        const totalTransactions = response.data.transactions.length;
        setTotalPages(Math.ceil(totalTransactions / PAGE_SIZE));
      }
    } catch (error) {
      console.error("Хэрэглэгчийн дэлгэрэнгүй мэдээлэл татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedTransactions = user?.transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (value: number, currency: string) => {
    return (
      value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + (currency === "USDT" ? "$" : "₮")
    );
  };

  const transactionColumns = [
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (value: number) => `${value.toLocaleString()}`,
    },
    {
      title: "Payment Method",
      dataIndex: "PaymentMethod",
      key: "PaymentMethod",
    },
    {
      title: "Invoice ID",
      dataIndex: "InvoiceID",
      key: "InvoiceID",
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          complete: "bg-green-400 text-black",
          inactive: "bg-red-200 text-red-800",
          pending: "bg-yellow-200 text-yellow-800",
        };

        return (
          <Tag color={statusColors[status] || "default"}>{status}</Tag>
        )
      },
    },
    {
      title: "Created At",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (value: string) =>
        format(new Date(value), "yyyy-MM-dd HH:mm"),
    },
  ];

  if (user === null) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          Хэрэглэгчийн мэдээлэл <Spin size="large" />
        </DialogContent>
      </Dialog>
    );
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Used Details</DialogTitle>
        </DialogHeader>

        <>
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex justify-between">
              {user.profile_picture && (
                <div className="p-6">
                  <img
                    className="w-28 h-28 rounded-full"
                    src={user.profile_picture}
                    alt="Profile picture"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col gap-4">
                <p>
                  <strong>First Name:</strong> {user.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Phone No:</strong> {user.phone || "Байхгүй"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                
                <p>
                  <strong>Balance</strong>{" "}
                  {formatCurrency(user.user_balances?.[0]?.Balance, user.user_balances?.[0].Currency)} 
                </p>
                <p className="flex gap-2">
                  <strong>Wallet Address:</strong>{" "}
                  {user.user_balances?.[0]?.WalletID ? (
                    <span className="flex items-center gap-2">
                      {`${user.user_balances[0].WalletID.slice(0, 6)}...${user.user_balances[0].WalletID.slice(-6)}`}
                      <button
                        onClick={() => handleCopy(user.user_balances[0].WalletID)}
                        className="text-blue-800 hover:text-blue-800"
                      >
                        <Copy size={16} />
                      </button>
                    </span>
                  ) : (
                    "Байхгүй"
                  )}
                </p>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <p>
                  <strong>Status:</strong> {user.status}
                </p>
                <p>
                  <strong>Created at:</strong>{" "}
                  {format(new Date(user.created_at), "yyyy-MM-dd HH:mm")}
                </p>
                <p>
                  <strong>Phone verified:</strong>{" "}
                  {user.phone_verified_at
                    ? format(new Date(user.phone_verified_at), "yyyy-MM-dd HH:mm")
                    : "Байхгүй"}
                </p>
                <p>
                  <strong>Last Active:</strong>{" "}
                  {user.identities?.[0]?.last_used_at
                    ? format(new Date(user.identities[0].last_used_at), "yyyy-MM-dd HH:mm")
                    : "Байхгүй."}
                </p>
              </div>
            </div>
          </Card>
          <div className="overflow-y-auto max-h-[300px]">
            <AntdDataTable
              data={paginatedTransactions || []}
              columns={transactionColumns}
              title="Transactions"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
