import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { z } from "zod";

import {
  useDeleteRegister,
  useRegister,
  useUpdateRegister
} from "~/hooks/useQuery/useQueryaction";
import { useQueryApi } from "~/hooks/useQuery";
import { superadmin_users } from "~/types/configs/superadmin_users";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";

export const SuperAdminusers = () => {
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { mutate, isPending } = useRegister();
  const { mutate: deleteRegisterMutate, isPending: deletePending } = useDeleteRegister();
  const { mutate: UpdateRegisterUser, isPending: updatepending } = useUpdateRegister();

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered: any = data.filter((comp: superadmin_users) =>
      comp.fullName?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
    setPage(0);
  };
  type RegisterForm = z.infer<typeof registerSchema>;

  const registerSchema = z.object({
    username: z.string().min(3, "Username Required").max(12),
    fullname: z.string().min(3, "Fullname Required").max(12),
    email: z.string().email("Email is not valid"),
    password: z.string().min(4, "Password is not valid")
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });
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
    setSearchParams((prev) => {
      prev.set("modal", "edit");
      prev.set("id =", id);
      return prev;
    });
  };

  const AddModalOpen = () => {
    setOpenModalAdd(true);
    setSearchParams((prev) => {
      prev.set("modal", "add");
      return prev;
    });
  };

  const CloseModal = () => {
    setOpenModal(false);
    setOpenModalAdd(false);
    setOpenModalDelete(false);
    setSearchParams({});
  };

  const DeleteModal = () => {
    setOpenModalDelete(true);
    setSearchParams((prev) => {
      prev.set("modal", "delete");
      return prev;
    });
  };

  const DeleteShure = () => {
    if (selectedUserId) {
      deleteRegisterMutate(selectedUserId, {
        onSuccess: () => CloseModal()
      });
    }
  };

  const OnSubmit = (formData: RegisterForm) => {
    const FormData = {
      username: formData.username,
      fullName: formData.fullname,
      email: formData.email,
      password: formData.password
    };
    mutate({ data: FormData }, { onSuccess: () => CloseModal() });
  };

  const hundleUpdate = (formData: RegisterForm) => {
    const FormData = {
      userId: selectedUserId,
      username: formData.username,
      fullName: formData.fullname,
      email: formData.email,
      password: formData.password
    };
    UpdateRegisterUser({ data: FormData }, { onSuccess: () => CloseModal() });
  };
  useEffect(() => {
    const modalType = searchParams.get("modal");
    const id = searchParams.get("id");

    if (modalType === "add") {
      setOpenModalAdd(true);
    } else if (modalType === "edit" && id) {
      setSelectedUserId(id);
      setOpenModal(true);
    } else if (modalType === "delete") {
      setOpenModalDelete(true);
    }
  }, []);
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
          <Button
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
            onClick={AddModalOpen}
            className="gap-2 bg-white w-[140px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" />
            <span className="text-[11px] text-uppercase">new user</span>
          </Button>
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
                <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-4 w-[550px] h-[340px]">
                  <h2 className="text-xl font-semibold mb-4">Add new user</h2>

                  <form onSubmit={handleSubmit(OnSubmit)}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">Username</label>
                        <input
                          type="text"
                          placeholder="username"
                          className="w-full border rounded-lg p-2 mt-1"
                          {...register("username")}
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Full name</label>
                        <input
                          type="text"
                          {...register("fullname")}
                          placeholder="fullname"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                        {errors.fullname && (
                          <p className="text-red-500 text-sm">
                            {errors.fullname.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                          type="email"
                          placeholder="email"
                          {...register("email")}
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email?.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                          type="password"
                          {...register("password")}
                          placeholder="password"
                          className="w-full border rounded-lg p-2 mt-1"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center  justify-end mt-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={CloseModal}
                          variant="outlined"
                          size="small"
                          className="border px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="small"
                          variant="contained"
                          disabled={isPending}
                        >
                          {isPending ? <CircularProgress size={20} /> : "Next"}
                        </Button>
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
                      <td className="p-3">
                        {format(new Date(item.created_at), "hh.MM.yyyy")}
                      </td>
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
            onSubmit={handleSubmit(hundleUpdate)}
            className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[550px] h-[340px]"
          >
            <h2 className="text-xl font-semibold mb-4">User settings</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700">Full name</label>
                <input
                  type="text"
                  {...register("fullname")}
                  placeholder="full name"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm">{errors.fullname?.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="email"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email?.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="password"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password?.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  {...register("username")}
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username?.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={DeleteModal}
                className="text-red-500 text-sm font-medium"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={CloseModal}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatepending}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  {updatepending ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : (
                    "Save"
                  )}
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
                disabled={deletePending}
                className="text-red-500 font-medium text-[14px] px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {deletePending ? <CircularProgress size={20} /> : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
