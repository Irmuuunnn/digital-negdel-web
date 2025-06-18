/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Card, Button, Spin, Empty } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import TableFilters from "../TableFilters";

const AntdDataTable: React.FC<any> = ({
  data = [],
  columns = [],
  title = "",
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  filterConfig,
  filters = {},
  setFilters,
  onRowClick,
  rowCount,
  expandable, // <- new prop for expandable config
}) => {
  const onRow = (record: any) => ({
    onClick: () => {
      if (onRowClick) {
        onRowClick(record);
      }
    },
    style: { cursor: onRowClick ? "pointer" : "default" },
  });

  const renderPagination = () => (
    <div className="flex justify-between items-center mt-4">
      {rowCount !== undefined && (
        <div className="bg-blue-800 rounded flex self-start px-2 py-1 text-white">
          Нийт: {rowCount}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <span className="text-sm">
          Хуудас {currentPage} / {totalPages}
        </span>
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        />
      </div>
    </div>
  );

  return (
    <Card title={title}>
      <div className="mb-10">
        {filterConfig && (
          <TableFilters
            filterConfig={filterConfig}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>

      <Table
        className="table-custom"
        columns={columns}
        dataSource={data}
        loading={{
          spinning: loading,
          indicator: <Spin size="large" />,
        }}
        pagination={false}
        onRow={onRow}
        rowKey={(record) =>
          record.id || Math.random().toString(36).substring(2)
        }
        locale={{
          emptyText: (
            <div>
              <Empty />
              <div>Хоосон байна</div>
            </div>
          ),
        }}
        scroll={{ x: "max-content" }}
        bordered
        size="middle"
        expandable={expandable} // <- expandable rows support
      />

      {!loading && renderPagination()}
    </Card>
  );
};

export default AntdDataTable;
