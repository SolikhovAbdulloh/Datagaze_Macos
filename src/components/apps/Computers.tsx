import React, { useState, useEffect } from "react";
import { ComputersType } from "~/types/configs/computers";
import TextField from "@mui/material/TextField";
import { FormControl, Select, MenuItem, CircularProgress, Button } from "@mui/material";
import Computers_app from "./ComputerApp";
import { useQueryApi } from "~/hooks/useQuery";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "react-router-dom";
import About_fc from "../Modals/AboutFc";
import Skeleton from "@mui/material/Skeleton";
import { getToken } from "~/utils";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useUploadInstalldApplication } from "~/hooks/useQuery/useQueryaction";
import { IoTrashBinOutline } from "react-icons/io5";

const Computers = () => {
  const [params, setSearchparams] = useSearchParams();

  const [openModal, setOpenModal] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [selectedId, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedTableId, setSelectedTable] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState<ComputersType[]>([]);
  const [allComputers, setAllComputers] = useState<ComputersType[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [checkapp, setCheckapp] = useState<any>([]);
  const computersSocketRef = useRef<any>(null);
  const [appname, setappName] = useState("");
  const [filename, setfileName] = useState<File | null>(null);
  const [argument, setArgutment] = useState("");
  const Status = params.get("status") || "all";
  const [isFormValid, setIsFormValid] = useState(false);
  const { data, isLoading, isError } = useQueryApi({
    url: `/api/1/device/computers?page=${page + 1}&limit=${rowsPerPage}`,
    pathname: "computers"
  });

  useEffect(() => {
    setIsFormValid(appname.trim() !== "" && filename !== null && checkapp.length > 0);
  }, [appname, filename, argument, checkapp]);
  const showModal = (id: string) => {
    setOpenModal(true);
    setSelected(id);
  };
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckapp((prev: any) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      } else {
        return prev.filter((item: any) => item !== id);
      }
    });
  };

  const { mutate, isPending } = useUploadInstalldApplication();

  const closeTable = () => {
    setOpenTable(false);
    setSelectedTable(null);
    setModal(false);
    setappName("");
    setfileName(null);
    setArgutment("");
    setCheckapp([]);
  };
  const closeModal = () => {
    setOpenModal(false);
    setSelected(null);
  };
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAllComputers(data);
      filterComputers(data, Status, value);
    }
  }, [data]);
  const AddModalOpen = () => {
    setModal(true);
  };
  const filterComputers = (
    computers: ComputersType[],
    status: string,
    search: string
  ) => {
    let filtered = [...computers];

    if (status !== "all") {
      filtered = filtered.filter((comp) => comp.status === status);
    }

    if (search) {
      filtered = filtered.filter((comp) =>
        comp?.hostname?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredComputers(filtered);
  };

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    filterComputers(allComputers, Status, query);
    setPage(0);
  };

  const handleFilterChange = (event: any) => {
    const newStatus = event.target.value;
    setSearchparams({ status: newStatus });
    filterComputers(allComputers, newStatus, value);
    setPage(0);
  };

  const apptable = (id: string, status: string) => {
    setOpenTable(true);
    setStatus(status);
    setSelectedTable(id);
  };

  const paginatedComputers: ComputersType[] = filteredComputers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredComputers.length / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  useEffect(() => {
    const token = getToken();

    computersSocketRef.current = io("https://d.dev-baxa.me/computer", {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` }
    });

    computersSocketRef.current.on("connect", () => {
      console.log("Socket connected12:", computersSocketRef.current.connected);
    });

    computersSocketRef.current.on("response", (data: any) => {
      console.log("response", data);
      data.success === false
        ? toast.error(`${data.message}`, { closeButton: true })
        : toast.success(`${data.message}`, { closeButton: true });
    });

    computersSocketRef.current.on("error", (error: string) => {
      console.log("connect error computer :", error);
    });

    return () => {
      computersSocketRef.current?.disconnect();
    };
  }, []);
  const DeleteAgent = (id: string) => {
    computersSocketRef.current.emit("delete_agent", {
      computerId: id
    });
    toast.success("success", { closeButton: true });
  };
  // console.log("id:", checkapp, "appname:", appname, "file", filename, "arg:", argument);
  const CheckApplication = () => {
    if (!filename) return;
    const computerIdsStr = Array.isArray(checkapp) ? checkapp.join(",") : checkapp;
    const formData: any = new FormData();
    formData.append("appName", appname);
    formData.append("file", filename!);
    formData.append("argument", argument);
    formData.append("computerIds", computerIdsStr);

    mutate(formData, { onSuccess: () => closeTable() });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {openTable && selectedTableId && (
        <Computers_app
          id={selectedTableId || ""}
          status={status || ""}
          closeTable={closeTable}
        />
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e2eafb] w-full flex items-center justify-between h-[64px] px-4">
          <TextField
            value={value}
            onChange={searchFunctions}
            sx={{ "& .MuiInputLabel-root": { fontSize: "18px" } }}
            placeholder="Search"
            slotProps={{
              input: {
                type: "search",
                className: "w-[200px] h-[30px] bg-white flex items-center justify-center"
              }
            }}
          />
          <div className="flex gap-2">
            {checkapp.length > 0 && (
              <Button
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
                color="info"
                onClick={AddModalOpen}
                className="gap-2 bg-white w-[130px] cursor-pointer h-[33px] rounded-[8px] flex items-center justify-center px-2"
              >
                <AddIcon sx={{ fontSize: 14 }} />{" "}
                <span className="text-[11px]">Install app</span>
              </Button>
            )}
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                size="small"
                value={Status}
                onChange={handleFilterChange}
                displayEmpty
                renderValue={(selected) => (selected === "all" ? "All" : selected)}
                sx={{
                  height: 30,
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
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600 text-sm bg-[#ccdaf8]">
                <th className="p-3">#</th>
                <th className="p-3">No</th>
                <th className="p-3">Computer name</th>
                <th className="p-3">Operation System (OS)</th>
                <th className="p-3">IP address</th>
                <th className="p-3">Activity</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>
            {modal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div
                  className={`bg-[#e7ecf8] rounded-2xl shadow-lg p-6  ${filename?.name.endsWith(".msi") ? "w-[450px] h-[300px]" : "w-[550px] h-[400px]"} `}
                >
                  <h2 className="text-xl font-semibold mb-4">Install application</h2>

                  <form>
                    <div className="grid grid-cols-1  gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-700">Name</label>
                        <input
                          type="text"
                          required
                          onChange={(e) => setappName(e.target.value)}
                          placeholder="name"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">File Name</label>
                        {filename ? (
                          <div>{filename.name}</div>
                        ) : (
                          <input
                            required
                            type="file"
                            onChange={(e) => {
                              const selectedFile = e.target.files?.[0];
                              if (selectedFile) {
                                setfileName(selectedFile);
                              }
                            }}
                            className="w-[50%] rounded-lg p-2 mt-1"
                          />
                        )}
                      </div>
                      {filename && filename.name.endsWith(".msi") ? (
                        ""
                      ) : (
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700">Arguments</label>
                          <input
                            type="text"
                            required
                            onChange={(e) => setArgutment(e.target.value)}
                            placeholder="arguments"
                            className="w-full border rounded-lg p-2 mt-1"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center  justify-end mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={isPending}
                          onClick={closeTable}
                          className="border px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={CheckApplication}
                          disabled={!isFormValid || isPending}
                          size="small"
                          variant="contained"
                        >
                          {isPending ? (
                            <CircularProgress color="secondary" size={20} />
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <tbody>
              {isLoading || isError
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 p-4  text-sm bg-gray-50"
                    >
                      <td className="p-3">
                        <Skeleton variant="rectangular" width={20} height={20} />
                      </td>
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
                      <td className="p-3">
                        <Skeleton variant="text" width={60} />
                      </td>
                    </tr>
                  ))
                : paginatedComputers.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 p-4  text-sm ${
                        index % 2 === 0 ? "bg-[grey-50]" : "bg-[#ccdaf8]"
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={checkapp.includes(item.id)}
                          onChange={(e) =>
                            handleCheckboxChange(item.id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="p-3">{index + 1}</td>
                      <td
                        className="p-3 cursor-pointer"
                        onClick={() => apptable(item.id, item.status)}
                      >
                        {item.hostname}
                      </td>
                      <td
                        className="p-3 cursor-pointer"
                        onClick={() => apptable(item.id, item.status)}
                      >
                        {item.operation_system}
                      </td>
                      <td
                        className="p-3 cursor-pointer"
                        onClick={() => apptable(item.id, item.status)}
                      >
                        {item.ip_address}
                      </td>
                      <td className=" flex justify-center mt-3 mr-7">
                        <p
                          className={`${
                            item.status === "active"
                              ? "bg-[#DCFCE7] flex text-green-600 w-[55px] h-[25px]  items-center justify-center p-2 rounded-[8px] text-[12px]"
                              : "text-[grey] bg-[#dfe8fb] flex w-[55px] h-[25px] text-[12px] items-center justify-center px-2 py-2 rounded-[8px]"
                          }`}
                        >
                          {item.status}
                        </p>
                      </td>
                      <td
                        className="hover:text-[blue]  text-[#1A79D8]"
                        onClick={() => showModal(item.id)}
                      >
                        <span className="cursor-pointer"> About PC</span>
                      </td>
                      <td className="p-1">
                        <button
                          onClick={() => DeleteAgent(item.id)}
                          className="text-[18px] text-[red]"
                        >
                          <IoTrashBinOutline className="hover:text-[#a13738] " />
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
              <option value={5}>5</option>
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
      {openModal && selectedId && <About_fc id={selectedId} close={closeModal} />}
    </div>
  );
};

export default Computers;
