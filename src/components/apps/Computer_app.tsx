import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { FormControl, Select, MenuItem } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useQueryApi } from "~/hooks/useQuery";
import { ComputersAppType } from "~/types/configs/computers";
import Skeleton from "@mui/material/Skeleton";
import { io } from "socket.io-client";
import { getToken } from "~/utils";
import { toast } from "sonner";

const Computers_app = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useQueryApi({
    url: `/api/1/device/${id}/apps`,
    pathname: "apps"
  });
  const computersSocketRef = useRef<any>(null);
  let token = getToken();
  const [value, setValue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState<ComputersAppType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    if (data?.data && Array.isArray(data?.data)) {
      setFilteredComputers(data?.data);
    }
  }, [data]);

  computersSocketRef.current = io(
    "https://datagaze-platform-9cab2c02bc91.herokuapp.com/computer",
    {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` }
    }
  );

  computersSocketRef.current.on("response", (data: any) => {
    console.log("response", data);
    data.success === false
      ? toast.error(`${data.appName}  ${data.message} `)
      : toast.success(`response ${(data.name, data.status)}`);
  });

  computersSocketRef.current.on("error", (error: any) => {
    console.log("connect error computer :", error);
    error && toast.error(`Error ${error.message}`);
  });
  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered = data.data.filter((comp: any): string =>
      comp.name?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  const totalPages = Math.ceil(filteredComputers.length / rowsPerPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const paginatedComputers = filteredComputers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const DeleteAppBySocket = (name: string) => {
    console.log(name, id);
    computersSocketRef.current.emit("delete_app", {
      computerId: id,
      appName: name
    });
  };
  const UpdateAppBySocket = (name: string) => {
    computersSocketRef.current.emit("update_app", {
      computerId: id,
      appName: name
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <TextField
            value={value}
            onChange={searchFunctions}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: "18px"
              }
            }}
            placeholder="Search"
            slotProps={{
              input: {
                type: "search",
                className: "w-[200px] h-[30px] bg-white flex items-center justify-center"
              }
            }}
          />
          <div className="flex gap-2">
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                size="small"
                displayEmpty
                defaultValue=""
                sx={{
                  height: 36,
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  fontSize: "14px",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "8px 12px"
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <FilterList fontSize="small" /> Filters
                </MenuItem>
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#ccdbf7]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Product name</th>
                <th className="p-3">File size</th>
                <th className="p-3">Type</th>
                <th className="p-3">Installed date</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isError
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 p-4 text-sm bg-gray-50"
                    >
                      <td className="p-3">
                        <Skeleton variant="rectangular" width={20} height={20} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={20} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={100} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={120} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={100} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="rectangular" width={49} height={20} />
                      </td>
                    </tr>
                  ))
                : paginatedComputers.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 p-4 text-sm ${
                        index % 2 == 0 ? "bg-gray-50" : "bg-[#ccdaf8]"
                      }`}
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.size} MB</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.installed_date}</td>
                      <td className="p-3 text-[#1A79D8] ">
                        <button onClick={() => UpdateAppBySocket(item.name)}>
                          Update
                        </button>
                      </td>
                      <td className="p-3 text-red-600">
                        <button onClick={() => DeleteAppBySocket(item.name)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-t">
          <div>
            <span>Rows per page: </span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="border rounded px-2 py-1"
            >
              <option value={6}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div>
            <span>
              {page * rowsPerPage + 1}–
              {Math.min((page + 1) * rowsPerPage, filteredComputers.length)} of{" "}
              {filteredComputers.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i)}
                className={`px-3 py-1 border rounded ${page === i ? "bg-gray-200" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Computers_app;
