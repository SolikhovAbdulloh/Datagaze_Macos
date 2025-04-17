import React, { useState } from "react";
import { ModalLicenseType } from "~/types/configs/Liceses"; // Adjust path as needed
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import AddIcon from "@mui/icons-material/Add";
import { FiUploadCloud } from "react-icons/fi";
import { Button, Skeleton, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { useQueryApi } from "~/hooks/useQuery"; // Adjust path as needed
import { useCreateApplication } from "~/hooks/useQuery/useQueryaction";

// Define TypeScript interface for form data
interface FormDataType {
  icon: File | string;
  applicationName: string;
  publisher: string;
  webVersion: string;
  agentVersion: string;
  installScript: string;
  serverFile: File | string;
  agentFile: File | string;
}

const ModalLicense = () => {
  const { data, isLoading, isError } = useQueryApi({
    pathname: "application",
    url: "/api/1/desktop/web-applications"
  });

  const [value, setValue] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [filteredComputers, setFilteredComputers] = useState<ModalLicenseType[]>(
    data || []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Initialize form data
  const [formData, setFormData] = useState<FormDataType>({
    icon: "",
    applicationName: "Tedy",
    publisher: "Datagaze123 LLC",
    webVersion: "1.0.0",
    agentVersion: "2.0.0",
    installScript:
      "sudo timedatectl set-timezone Asia/Tashkent && sudo apt update && sudo apt upgrade -y",
    serverFile: "",
    agentFile: ""
  });

  const { mutate, isPending: isMutating } = useCreateApplication();

  // Handle text input changes
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file // Store the File object
      }));
    }
  };

  // Search function
  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered = data.filter((comp: any) => comp.name?.toLowerCase().includes(query));
    setFilteredComputers(filtered);
    setPage(0);
  };

  // Pagination
  const paginatedComputers = filteredComputers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredComputers.length / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const steps = ["General settings", "Scripts settings", "Product files"];

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Reset form data after successful submission
  const resetForm = () => {
    setFormData({
      icon: "",
      applicationName: "Tedy",
      publisher: "Datagaze123 LLC",
      webVersion: "1.0.0",
      agentVersion: "2.0.0",
      installScript:
        "sudo timedatectl set-timezone Asia/Tashkent && sudo apt update && sudo apt upgrade -y",
      serverFile: "",
      agentFile: ""
    });
    setActiveStep(0);
  };

  // Validate form fields for each step
  const validateStep = (step: number) => {
    if (step === 0) {
      return (
        formData.applicationName &&
        formData.publisher &&
        formData.webVersion &&
        formData.agentVersion &&
        formData.icon
      );
    }
    if (step === 1) {
      return formData.installScript;
    }
    if (step === 2) {
      const isValidFile = (file: any) =>
        file instanceof File &&
        file.size <= 10 * 1024 * 1024 && // 10MB limit
        [
          "application/zip",
          "application/x-msdownload",
          "image/png",
          "image/jpeg"
        ].includes(file.type); // Adjust allowed types as needed

      return (
        formData.serverFile &&
        isValidFile(formData.serverFile) &&
        formData.agentFile &&
        isValidFile(formData.agentFile)
      );
    }
    return true;
  };

  // Handle Next button and send FormData
  const handleNext = () => {
    if (!validateStep(activeStep)) {
      alert("Please fill in all required fields or ensure valid files are selected.");
      return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === 2) {
      const formDataToSend = new FormData();
      formDataToSend.append("applicationName", formData.applicationName);
      formDataToSend.append("publisher", formData.publisher);
      formDataToSend.append("webVersion", formData.webVersion);
      formDataToSend.append("agentVersion", formData.agentVersion);
      formDataToSend.append("installScript", formData.installScript);
      formDataToSend.append("icon", formData.icon);

      if (formData.serverFile) {
        formDataToSend.append("serverFile", formData.serverFile);
      }
      if (formData.agentFile) {
        formDataToSend.append("agentFile", formData.agentFile);
      }

      mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          resetForm(); // Reset form after successful submission
        }
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <div className="flex items-center relative gap-2">
            <TextField
              value={value}
              onChange={searchFunctions}
              placeholder="Search"
              slotProps={{
                input: {
                  type: "search",
                  className: "w-[200px] h-[30px] bg-white"
                }
              }}
            />
          </div>
          <div
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-white w-[130px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" /> Add new user
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-[#d4e0f9]">
              <tr className="border-b border-gray-300 text-gray-600 text-sm">
                <th className="p-3">Product name</th>
                <th className="p-3">Publisher</th>
                <th className="p-3">Server version</th>
                <th className="p-3">Agent version</th>
                <th className="p-3">File size</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isError
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border fellows border-gray-200 p-4 text-sm bg-gray-50"
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
                    </tr>
                  ))
                : paginatedComputers.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 text-sm ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-[#ccdaf8]"
                      }`}
                    >
                      <td className="p-3 flex items-center gap-2">
                        <img
                          className="w-[30px] rounded-[8px] h-[30px]"
                          src={`/icons/${item.pathToIcon}`}
                          alt="icon"
                        />
                        {item.applicationName}
                      </td>
                      <td className="p-3">{item.publisher}</td>
                      <td className="p-3">{item.serverVersion}</td>
                      <td className="p-3">{item.agentVersion}</td>
                      <td className="p-3">{item.storage}</td>
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
            {Math.min((page + 1) * rowsPerPage, filteredComputers.length)} of{" "}
            {filteredComputers.length}
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

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[620px] h-[610px]">
            <div className="flex flex-col gap-[40px] justify-between">
              <h2 className="text-[30px] font-bold">Add New Product</h2>
              <Stepper activeStep={activeStep} className="mt-4 text-[18px]">
                {steps.map((label, idx) => (
                  <Step key={idx}>
                    <StepLabel className="text-[blue]">{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === 0 && (
                <div>
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-gray-700 font-medium">Product icon</p>
                    <label className="flex items-center gap-2 mb-[30px]">
                      {formData.icon ? (
                        <p className="text-sm text-gray-600 mt-1">File selected</p>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          name="icon"
                          onChange={handleTextChange}
                          className="text-sm"
                        />
                      )}
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Product name
                      </label>
                      <input
                        type="text"
                        name="applicationName"
                        value={formData.applicationName}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-[13px] font-600 text-black">
                        Server version
                      </label>
                      <input
                        type="text"
                        name="webVersion"
                        value={formData.webVersion}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[13px] font-600 text-black">
                        Agent version
                      </label>
                      <input
                        type="text"
                        name="agentVersion"
                        value={formData.agentVersion}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 1 && (
                <div>
                  <p className="text-gray-700 font-medium mb-4">Install Script</p>
                  <textarea
                    name="installScript"
                    value={formData.installScript}
                    onChange={handleTextChange}
                    className="w-[100%] h-[200px] bg-[black] text-white p-2 rounded-[8px]"
                    required
                  />
                </div>
              )}
              {activeStep === 2 && (
                <div className="flex flex-col">
                  <div>
                    <p className="mb-[10px]">Server Side File</p>
                    <div className="w-[100%] h-[136px] bg-[#FFFFFF] flex rounded-[8px] items-center justify-center px-[10px]">
                      {!formData.serverFile ? (
                        <label className="text-center text-[13px] font-400 text-[grey]">
                          <FiUploadCloud
                            size={25}
                            color="grey"
                            className="m-auto mb-[15px]"
                          />
                          <span className="text-[black]">Drop your files here, or </span>
                          <span className="text-[#1A79D8] cursor-pointer">
                            click to browse
                          </span>
                          <br /> Up to 10 files, 100MB total limit
                          <input
                            type="file"
                            name="serverFile"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                          />
                        </label>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">File selected</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-[10px]">Agent Side File</p>
                    <div className="w-[100%] h-[136px] bg-[#FFFFFF] flex rounded-[8px] items-center justify-center">
                      {!formData.agentFile ? (
                        <label className="text-center text-[13px] font-400 text-[grey]">
                          <FiUploadCloud
                            size={25}
                            color="grey"
                            className="m-auto mb-[5px]"
                          />
                          <span className="text-[black]">Drop your files here, or </span>
                          <span className="text-[#1A79D8] cursor-pointer">
                            click to browse
                          </span>
                          <br /> Up to 10 files, 100MB total limit
                          <input
                            type="file"
                            name="agentFile"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                          />
                        </label>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">File selected</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-between items-center mt-[30px]">
              <ReportGmailerrorredIcon className="text-[#1380ED] cursor-pointer" />
              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  className="w-[137px] text-[black]"
                  variant="outlined"
                  color="info"
                  sx={{ textTransform: "capitalize" }}
                >
                  {activeStep > 0 ? "< Back" : "Cancel"}
                </Button>
                <Button
                  onClick={handleNext}
                  className="w-[137px]"
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  color="primary"
                  disabled={isMutating}
                >
                  {isMutating ? "Saving..." : activeStep === 2 ? "Save" : "Next >"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalLicense;
