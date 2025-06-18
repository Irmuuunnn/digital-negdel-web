/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button, Collapse, Input } from "antd";
import { CaretRightOutlined, SearchOutlined } from "@ant-design/icons";

type TableFiltersProps = {
  filterConfig: any;
  filters: any;
  setFilters: any;
};

const { Panel } = Collapse;

const TableFilters: React.FC<TableFiltersProps> = ({
  filterConfig,
  filters,
  setFilters,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleTempChange = (key: string, value: string) => {
    setTempFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  return (
    <Collapse
      bordered={true}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      className="w-full"
    >
      <Panel
        header={
          <div className="flex items-center gap-2 font-semibold">
            <SearchOutlined />
            Filters
          </div>
        }
        key="1"
      >
        <div className="flex justify-between ">
          <div className="flex flex-wrap gap-4">
            {filterConfig.map((filter: any) => (
              <div key={filter.key} className="min-w-[160px]">
                <label className="block text-xs font-semibold mb-1">
                  {filter.label}
                </label>

                {filter.type === "text" ? (
                  <Input
                    type="text"
                    className="h-8"
                    value={tempFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleTempChange(filter.key, e.target.value.trim())
                    }
                    placeholder={` ${filter.label}`}
                  />
                ) : filter.type === "select" && filter.options ? (
                  <Select
                    value={tempFilters[filter.key] || "all"}
                    onValueChange={(value) =>
                      handleTempChange(filter.key, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Сонгох`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : filter.type === "date" ? (
                  <Input
                    type="date"
                    value={tempFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleTempChange(filter.key, e.target.value)
                    }
                  />
                ) : null}
              </div>
            ))}
          </div>

          <Button
            type="primary"
            className="mt-6 w-[110px] bg-blue-800"
            onClick={applyFilters}
          >
            Хайх
          </Button>
        </div>
      </Panel>
    </Collapse>
  );
};

export default TableFilters;
