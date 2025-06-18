/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {  Tooltip, Tag,  } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import UserDetailModal from "@/screens/Users/detail";
import AntdDataTable from "@/components/Datatable";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
  user_balances: { WalletID: string }[];
  identities: { last_used_at: string }[];
}

const filterConfig = [
  { key: "id", label: "User ID", type: "text" },
  { key: "first_name", label: "First Name", type: "text" },
  { key: "email", label: "Email", type: "text" },
];

const UserScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [pagination, setPagination] = useState({
    offset: 10,
    currentPage: 1,
    totalPages: 0,
  });

  const ApiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        offset: pagination.offset.toString(),
        page: pagination.currentPage.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      }).toString();

      const response = await fetch(`${ApiUrl}/users?${queryParams}`);
      const data = await response.json();

      if (data.status) {
        setUsers(data.data);
        setRowCount(data.row_count);
        setPagination((prev) => ({
          ...prev,
          totalPages: Math.ceil(data.row_count / prev.offset),
        }));
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    
    },
    {
      title: "Wallet ID",
      dataIndex: "user_balances",
      key: "wallet",
      render: (value: { WalletID: string }[]) => {
        const wallet = value?.[0]?.WalletID;
        return wallet ? (
          <Tooltip title="Click to copy">
            <span
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(wallet)}
            >
              {wallet.slice(0, 6)}...{wallet.slice(-6)} <CopyOutlined />
            </span>
          </Tooltip>
        ) : (
          "No Wallet ID"
        );
      },
    },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "KYC",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: "green",
          inactive: "red",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: User, b: User) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (value: string) =>
        new Date(value).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Last Used At",
      dataIndex: "identities",
      key: "last_used_at",
      render: (value: { last_used_at: string }[]) => {
        const lastUsed = value?.[0]?.last_used_at;
        if (!lastUsed) return "N/A";
        const date = new Date(lastUsed);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];


  return (
    <div className="">
      {/* Table Section */}
      <AntdDataTable
        filterConfig={filterConfig}
        filters={filters}
        setFilters={setFilters}
        data={users}
        columns={columns}
        loading={loading}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        title="Users"
        caption="Users"
        onRowClick={handleRowClick}
        rowCount={rowCount}
      />

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <UserDetailModal
          userId={selectedUser.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserScreen;
