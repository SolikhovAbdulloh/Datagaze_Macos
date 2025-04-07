import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteRegister,
  useRegister,
  useUpdateRegister
} from "~/hooks/useQuery/useQueryaction";
import { useQueryApi } from "~/hooks/useQuery";
import { superadmin_users } from "~/types/configs/superadmin_users";
import { Skeleton } from "@mui/material";

export const SuperAdmin_users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isError, isLoading } = useQueryApi({
    url: `/api/1/auth/users?page=${page + 1}&limit=${rowsPerPage}`,
    pathname: "superadmin_Users"
  });
  useEffect(() => {
    if (data) {
      setFilteredComputers(data);
    }
  }, [data]);
  const [value, setValue] = useState("");
  const [filteredComputers, setFilteredComputers] = useState<superadmin_users[]>(data);
  const [open, setOpenModal] = useState(false);
  const [openUser, setOpenModalAdd] = useState(false);
  const [openDelete, setOpenModalDelete] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { mutate } = useRegister();
  const { mutate: deleteRegisterMutate } = useDeleteRegister();
  // const { mutate: UpdateRegisterUser } = useUpdateRegister();  
  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered: any = data.filter((comp: superadmin_users) =>
      comp.fullName?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
    setPage(0);
  };

  const paginatedComputers = filteredComputers?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil((filteredComputers?.length || 0) / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const EditOpenModal = (id: string) => {
    setSelectedUserId(id);
    setOpenModal(true);
  };
  const AddModalOpen = () => {
    setOpenModalAdd(true);
  };
  const CloseModal = () => {
    setOpenModal(false);
    setOpenModalAdd(false);
    setOpenModalDelete(false);
  };
  const DeleteModal = () => {
    setOpenModalDelete(true);
  };
  const DeleteShure = () => {
    if (selectedUserId) {
      deleteRegisterMutate(selectedUserId, {
        onSuccess: () => CloseModal()
      });
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const FormData = {
      username: username,
      fullName: fullname,
      email: email,
      password: password
    };
    // if (selectedUserId) {
    //   UpdateRegisterUser(FormData, {
    //     onSuccess: () => CloseModal()
    //   });

    mutate({ data: FormData }, { onSuccess: () => CloseModal() });
  };
  const hundleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const FormData = {
      userId: selectedUserId,
      username: username,
      fullName: fullname,
      email: email,
      password: password
    };
  };
  return (
    <div className="p-4  bg-gray-100 min-h-screen">
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
          <div
            onClick={AddModalOpen}
            className="gap-2 bg-white w-[130px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" /> Add new user
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#ccdbf7]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Full name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Degistered date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            {openUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[550px] h-[320px]">
                  <h2 className="text-xl font-semibold mb-4">Add new user</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">Username</label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          className="w-full border rounded-lg p-2 mt-1"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Full name</label>
                        <input
                          type="text"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="fullname"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                          type="email"
                          placeholder="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="password"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center  justify-end mt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={CloseModal}
                          className="border px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <tbody>
              {isLoading || isError
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 p-4 text-sm bg-gray-50"
                    >
                      <td className="p-3">
                        <Skeleton variant="rectangular" width={100} height={20} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={100} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={100} />
                      </td>
                      <td className="p-3">
                        <Skeleton variant="text" width={20} height={40} />
                      </td>
                    </tr>
                  ))
                : paginatedComputers?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 p-4 text-sm hover:bg-gray-50"
                    >
                      <td className="p-3">{item.fullName}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.created_at}</td>
                      <td
                        className="p-3 text-[#1A79D8] cursor-pointer"
                        onClick={() => EditOpenModal(item.id)}
                      >
                        edit
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="text-gray-700 text-sm border border-gray-300 rounded p-1 bg-white hover:bg-gray-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <span className="text-gray-700 text-sm">
            {page * rowsPerPage + 1}–
            {Math.min((page + 1) * rowsPerPage, filteredComputers?.length)} of
            {filteredComputers?.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i)}
                className={`px-3 py-1 border border-gray-300 rounded text-gray-700 ${
                  page === i ? "bg-gray-200" : "hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={hundleUpdate}
            className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[550px] h-[320px]"
          >
            <h2 className="text-xl font-semibold mb-4">User settings</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700">Full name</label>
                <input
                  type="text"
                  placeholder="full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  className="w-full border rounded-lg p-2 mt-1"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button onClick={DeleteModal} className="text-red-500 text-sm font-medium">
                Delete user
              </button>
              <div className="flex gap-2">
                <button onClick={CloseModal} className="border px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
          <div className="bg-[#e7ecf8] rounded-2xl shadow-lg text-center p-6 w-[340px] h-[204px]">
            <p className="font-medium text-[20px]">
              Are you sure you want to delete user?
            </p>
            <p className="font-normal text-[14px] text-gray-500">
              Confirming process cancellation the <br /> installation
            </p>
            <div className="flex gap-2 mt-5 justify-center">
              <button
                onClick={CloseModal}
                className="border border-gray-300 font-medium text-[14px] text-[#1A79D8] px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={DeleteShure}
                className="text-red-500 font-medium text-[14px] px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
