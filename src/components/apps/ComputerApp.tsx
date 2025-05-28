import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Input, CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { useQueryApi } from "~/hooks/useQuery";
import { ComputersAppType } from "~/types/configs/computers";
import Skeleton from "@mui/material/Skeleton";
import { toast } from "sonner";
import { useAxios } from "~/hooks/useAxios";
import { useUpload } from "~/hooks/useQuery/useQueryaction";
import { useComputersSocket } from "~/routes/SocketProvider";
interface ComputersAppProps {
  id: string;
  status: string;
  closeTable: () => void;
}
const Computers_app = ({ id: ID, closeTable, status }: ComputersAppProps) => {
  const { data, isLoading, isError, isFetching } = useQueryApi({
    url: `/api/1/device/${ID}/apps`,
    pathname: "apps"
  });
  const [value, setValue] = useState("");
  const [pendingUpload, setPendingUpload] = useState<{ name: string; id: string }>({
    name: "",
    id: ""
  });

  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [filteredComputers, setFilteredComputers] = useState<ComputersAppType[]>([]);
  const [page, setPage] = useState(0);
  const [filename, setfileName] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [res, setRes] = useState("");
  const [argumentUpload, setArgutmentUpload] = useState("");
  const [argument, setargument] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [DeleteModal, setDeleteModal] = useState(false);
  const socket = useComputersSocket();
  // console.log("Socket holati - 2", socket);

  useEffect(() => {
    if (data?.data && Array.isArray(data?.data)) {
      setFilteredComputers(data?.data);
    }
  }, [data]);
  const { mutate, isPending } = useUpload();

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
  const DeleteAppBySocket = async (name: string) => {
    if (status === "inactive") {
      return toast.error("You are activen't now", { closeButton: true });
    }
    setLoadingItem(name);
    setName(name);
    const axios = useAxios();
    const response = await axios({
      url: `/api/1/device/${ID}/${name}/is-exist`,
      method: "GET"
    });
    if (response.isInput === true) {
      setLoadingItem(null);

      setDeleteModal(true);
    } else {
      const emitDelete = () => {
        socket.emit("delete_app", {
          computerId: ID,
          appName: name
        });
        toast.info("Delete", { closeButton: true });
        setLoadingItem(null);
      };

      if (socket.connected) {
        emitDelete();
      } else {
        setLoadingItem(null);

        socket.once("connect", emitDelete);
      }
    }
  };
  const closeTableApp = () => {
    setModal(false);
    setfileName(null);
    setArgutmentUpload("");
  };
  const UpdateAppBySocket = async (name: string, id: string) => {
    if (status === "inactive") {
      return toast.error("You are activen't now", { closeButton: true });
    }
    setLoading(name);
    const axios = useAxios();
    const response = await axios({
      url: `/api/1/device/${ID}/${name}/is-exist`,
      method: "GET"
    });
    const result = response.isInput;
    setRes(result);
    // console.log(response);
    if (result) {
      setModal(true);
      setLoading(null);
    }
    setModal(true);

    setLoading(null);

    setPendingUpload({ name, id });
  };
  function CloseeDeleteModal() {
    setDeleteModal(false);
  }
  const handleUpload = async () => {
    const formData = new FormData();
    if (filename) formData.append("file", filename);
    formData.append("id", pendingUpload.id);
    if (argumentUpload) formData.append("argument", argumentUpload);
    mutate(formData, {
      onSuccess: () => {
        setModal(false);
        setfileName(null);
        setArgutmentUpload("");
      }
    });
  };
  function SendArgumentfuction() {
    setLoadingItem(argument);
    socket.emit("delete_app", {
      computerId: ID,
      appName: name,
      arguments: argument
    });
    CloseeDeleteModal();
    toast.info("Delete", { closeButton: true });
  }

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
            <Button type="button" variant="contained" size="small" onClick={closeTable}>
              Back
            </Button>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#ccdbf7]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Product name</th>
                <th className="p-3">Version</th>
                <th className="p-3">File size</th>
                <th className="p-3">Type</th>
                <th className="p-3">Installed date</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {isLoading || isError || isFetching
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
                      <td className="p-3">{item.version}</td>
                      <td className="p-3">{item.size} MB</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">
                        {format(new Date(item.installed_date), "dd.MM.yyyy")}
                      </td>
                      <td className="p-3 text-[#1A79D8] ">
                        <button onClick={() => UpdateAppBySocket(item.name, item.id)}>
                          {loading === item.name ? (
                            <CircularProgress size={20} />
                          ) : (
                            <span
                              className={`cursor-pointer ${status == "inactive" && "text-[grey]"} `}
                            >
                              Update
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-red-600">
                        <button
                          disabled={loadingItem === item.name}
                          onClick={() => DeleteAppBySocket(item.name)}
                        >
                          {loadingItem === item.name ? (
                            <CircularProgress size={20} />
                          ) : (
                            <span
                              className={`cursor-pointer ${status == "inactive" && "text-[grey]"} `}
                            >
                              Delete
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div
                className={`bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[450px] ${res ? "h-[350px]" : "h-[220px]"}`}
              >
                <h2 className="text-xl font-semibold mb-4">Update</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 mb-4">
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

                    {res && (
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">Argument</label>
                        <input
                          type="text"
                          required
                          value={argumentUpload}
                          onChange={(e) => setArgutmentUpload(e.target.value)}
                          placeholder="argument"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={closeTableApp}
                        className="border px-4 py-2 rounded-lg"
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button size="small" variant="contained" type="submit">
                        {isPending ? (
                          <CircularProgress color="warning" size={20} />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {DeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex  items-center justify-center z-50">
            <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 ">
              <h2 className="text-xl font-semibold mb-4">Delete App</h2>
              <div className="flex gap-2 p-3">
                <Input
                  placeholder="argument"
                  className="p-1"
                  onChange={(e) => setargument(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={CloseeDeleteModal}
                  size="small"
                  className="border rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={SendArgumentfuction}
                  size="small"
                  color="error"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
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
