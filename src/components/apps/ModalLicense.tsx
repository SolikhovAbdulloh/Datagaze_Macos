import React, { useState } from "react";
import { ModalLicenseType } from "~/types/configs/Liceses";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import AddIcon from "@mui/icons-material/Add";
import { FiUploadCloud } from "react-icons/fi";
import {
  Button,
  CircularProgress,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  TextField
} from "@mui/material";
import { useQueryApi } from "~/hooks/useQuery";
import { useCreateApplication } from "~/hooks/useQuery/useQueryaction";
import { toast } from "sonner";

interface FormDataType {
  icon: File | string | any;
  applicationName: string;
  publisher: string;
  webVersion: string;
  agentVersion: string;
  Cpu: string;
  Ram: string;
  Storage: string;
  networkBandwidth: string;
  installScript: File | string | any;
  serverFile: File | string | any;
  agentFile: File | string | any;
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

  const [formData, setFormData] = useState<FormDataType>({
    icon: "",
    Ram: "",
    Storage: "",
    networkBandwidth: "",
    Cpu: "",
    applicationName: "Tedy",
    publisher: "Datagaze123 LLC",
    webVersion: "1.0.0",
    agentVersion: "2.0.0",
    installScript: "",
    serverFile: "",
    agentFile: ""
  });

  const { mutate, isPending: isMutating } = useCreateApplication();

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    console.log("File selected:", { name, file, fileType: file?.type });
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const searchFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const filtered = data.filter((comp: any) =>
      comp.applicationName?.toLowerCase().includes(query)
    );
    setFilteredComputers(filtered);
    setPage(0);
  };

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

  const resetForm = () => {
    setFormData({
      icon: "",
      Ram: "",
      Storage: "",
      networkBandwidth: "",
      Cpu: "",
      applicationName: "Tedy",
      publisher: "Datagaze123 LLC",
      webVersion: "1.0.0",
      agentVersion: "2.0.0",
      installScript: "",
      serverFile: "",
      agentFile: ""
    });
    setActiveStep(0);
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      // console.log("Step 0 validation:", {
      //   applicationName: formData.applicationName,
      //   publisher: formData.publisher,
      //   webVersion: formData.webVersion,
      //   agentVersion: formData.agentVersion,
      //   icon: formData.icon,
      //   isIconFile: formData.icon instanceof File
      // });
      return (
        formData.applicationName &&
        formData.publisher &&
        formData.webVersion &&
        formData.agentVersion &&
        formData.icon &&
        formData.icon instanceof File
      );
    }
    if (step === 1) {
      // console.log("Step 1 validation:", {
      //   installScript: formData.installScript,
      //   cpu: formData.Cpu,
      //   network: formData.networkBandwidth,
      //   storage: formData.Storage,
      //   ram: formData.Ram
      // });
      return (
        formData.Cpu &&
        formData.networkBandwidth &&
        formData.Ram &&
        formData.Storage &&
        formData.installScript instanceof File
      );
    }
    if (step === 2) {
      const isValidFile = (file: any) => file instanceof File;

      // console.log("Step 2 validation:", {
      //   serverFile: formData.serverFile?.name,
      //   serverFileType: formData.serverFile?.type,
      //   isServerFileValid: isValidFile(formData.serverFile),
      //   agentFile: formData.agentFile?.name,
      //   agentFileType: formData.agentFile?.type,
      //   isAgentFileValid: isValidFile(formData.agentFile)
      // });

      return (
        formData.serverFile &&
        isValidFile(formData.serverFile) &&
        formData.agentFile &&
        isValidFile(formData.agentFile)
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      let errorMessage = "Please fill in all required fields: ";
      if (activeStep === 0) {
        if (!formData.applicationName) errorMessage += "Product name, ";
        if (!formData.publisher) errorMessage += "Publisher, ";
        if (!formData.webVersion) errorMessage += "Server version, ";
        if (!formData.agentVersion) errorMessage += "Agent version, ";
        if (!formData.icon || !(formData.icon instanceof File))
          errorMessage += "Product icon, ";
      } else if (activeStep === 1) {
        if (!formData.installScript) errorMessage += "Install script, ";
      } else if (activeStep === 2) {
        if (!formData.serverFile || !(formData.serverFile instanceof File))
          errorMessage += "Server side file, ";
        if (!formData.agentFile || !(formData.agentFile instanceof File))
          errorMessage += "Agent side file, ";
      }
      toast.error(errorMessage.slice(0, -2));
      return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === 2) {
      const formDataToSend = new FormData();
      formDataToSend.append("ram", formData.Ram);
      formDataToSend.append("cpu", formData.Cpu);
      formDataToSend.append("storage", formData.Storage);
      formDataToSend.append("networkBandwidth", formData.networkBandwidth);
      formDataToSend.append("applicationName", formData.applicationName);
      formDataToSend.append("publisher", formData.publisher);
      formDataToSend.append("webVersion", formData.webVersion);
      formDataToSend.append("agentVersion", formData.agentVersion);

      if (formData.installScript) {
        formDataToSend.append("scriptFile", formData.installScript);
      }
      if (formData.icon) {
        formDataToSend.append("iconFile", formData.icon);
      }
      if (formData.serverFile) {
        formDataToSend.append("serverFile", formData.serverFile);
      }
      if (formData.agentFile) {
        formDataToSend.append("agentFile", formData.agentFile);
      }

      console.log("FormData to send:", formDataToSend);

      mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          resetForm();
        },
        onError: (error) => {
          console.error("Backend error:", error);
          alert("Failed to save: " + error.message);
        }
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      setIsOpen(false);
      resetForm();
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen ">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg ">
        <div className="bg-[#e1e9fb] w-full flex items-center justify-between h-[64px] px-4">
          <div className="flex items-center relative gap-2">
            <TextField
              value={value}
              onChange={searchFunctions}
              placeholder="Search"
              slotProps={{
                input: { type: "search", className: "w-[200px] h-[30px] bg-white" }
              }}
            />
          </div>
          <div
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-white w-[130px] text-[13px] cursor-pointer h-[32px] rounded-[8px] flex items-center justify-center px-2"
          >
            <AddIcon fontSize="small" /> <span className="text-[12px]">New Product</span>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
              <thead className="sticky top-0 bg-[#d4e0f9]">
                <tr className="border-b border-gray-300 text-gray-600 text-sm">
                  <th className="p-1">No</th>
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
                        className={`border-b border-gray-200 text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-[#ccdaf8]"}`}
                      >
                        <td className="p-3">{index + 1}</td>

                        <td className="p-3 flex items-center gap-2">
                          <img
                            className="w-[30px] rounded-[8px] h-[30px]"
                            src={`${import.meta.env.VITE_BASE_URL}/icons/${item?.pathToIcon}`}
                            onError={(e) => {
                              e.currentTarget.src = "/icons/zoom1.png";
                            }}
                            alt="icon"
                          />
                          {item.applicationName}
                        </td>
                        <td className="p-3">{item.publisher}</td>
                        <td className="p-3">{item.serverVersion}</td>
                        <td className="p-3">
                          {item.agentVersion ? item.agentVersion : "0.0.0"}
                        </td>
                        <td className="p-3">{item.serverFileSize}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
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
                className={`px-3 py-1 border border-gray-300 rounded text-gray-700 ${page === i ? "bg-gray-200" : "hover:bg-gray-50"}`}
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
        <div className="fixed inset-0 z-2 bg-black bg-opacity-40 flex items-center justify-center">
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
                        <p className="text-sm text-gray-600 mt-1">
                          Selected file: {formData?.icon.name}
                        </p>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          name="icon"
                          onChange={handleFileChange}
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
                <div className="flex justify-content-center flex-col gap-3">
                  <p className="text-gray-700 font-medium mb-4">Install Script</p>
                  {!formData.installScript ? (
                    <label className="text-center text-[13px] font-400 text-[grey]">
                      <FiUploadCloud
                        size={25}
                        color="grey"
                        className="m-auto mb-[15px]"
                      />
                      <span className="text-[black] ">Drop your files here, or </span>
                      <span className="text-[#1A79D8] cursor-pointer">
                        click to browse
                      </span>
                      <br /> Only .md or markdown file
                      <input
                        type="file"
                        name="installScript"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                        accept=".md,.markdown"
                      />
                    </label>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      File selected: {formData.installScript.name}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Cpu
                      </label>
                      <input
                        type="text"
                        name="Cpu"
                        value={formData.Cpu}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Ram
                      </label>
                      <input
                        type="text"
                        name="Ram"
                        value={formData.Ram}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        Storage
                      </label>
                      <input
                        type="text"
                        name="Storage"
                        value={formData.Storage}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-black">
                        networkBandwidth
                      </label>
                      <input
                        type="text"
                        name="networkBandwidth"
                        value={formData.networkBandwidth}
                        onChange={handleTextChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                    </div>
                  </div>
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
                            accept=".zip,.rar,.tar.gz"
                          />
                        </label>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">
                          File selected: {formData.serverFile.name}
                        </p>
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
                            accept=".exe,.msi"
                          />
                        </label>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">
                          File selected: {formData?.agentFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-between items-center mt-30px">
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
                  {isMutating ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : activeStep === 2 ? (
                    "Save"
                  ) : (
                    "Next >"
                  )}
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
