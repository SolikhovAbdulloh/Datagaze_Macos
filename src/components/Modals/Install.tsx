import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from "@mui/material";
import { ApplicationType, InstallAppInfoType } from "~/types";
import { BiMemoryCard } from "react-icons/bi";

import { IoMdCloseCircle } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { BsCpuFill } from "react-icons/bs";
import { RiComputerLine } from "react-icons/ri";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { FiGlobe } from "react-icons/fi";
import { useQueryApi } from "~/hooks/useQuery";
import {
  useInstallApplication,
  useUploadApplication
} from "~/hooks/useQuery/useQueryaction";
import { io } from "socket.io-client";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { getToken } from "~/utils";
import MarkdownViewer from "../Markdown";
const steps = ["System requirements", "Server configs", "Completed"];
const LicenseModalinstall = ({
  app,
  onClose
}: {
  app: ApplicationType;
  onClose: () => void;
}) => {
  const socketRef = useRef<any>(null);
  const termRef = useRef<any>(null);
  const terminalRef = useRef<any>(null);
  const { mutate: install } = useInstallApplication();
  const [activeStep, setActiveStep] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [percentage, setpercentage] = useState<number>(0);
  const { data, isLoading, isFetching } = useQueryApi({
    pathname: "Not_Installed_app",
    url: `/api/1/desktop/${app.id}`
  });
  console.log(isLoading);

  const { data: markdown } = useQueryApi({
    url: `/api/1/desktop/download/script/${app.id}`,
    pathname: "SUDO"
  });

  const { mutate, isPending } = useUploadApplication();
  const UploadApplication = () => {
    mutate(app.id, {
      onSuccess: () => {
        setOpenModal(false);
        onClose();
      }
    });
  };

  const configs: InstallAppInfoType = data || {};
  const [formData, setFormData] = useState({
    productId: configs.id,
    host: "170.64.141.16",
    port: 22,
    username: "root",
    password: "ubuntu123New"
  });

  useEffect(() => {
    if (configs.id && formData.productId !== configs.id) {
      setFormData((prev) => ({
        ...prev,
        productId: configs.id
      }));
    }
  }, [configs.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      setOpenModal(false);
    }
  };

  const OpenInstallModal = () => {
    setOpenModal(true);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (activeStep === 2) {
      setCodeModalOpen(true);
      let term: Terminal;
      let socket: any;
      const token = getToken();
      const initializeTerminal = async () => {
        try {
          term = new Terminal({
            cursorBlink: true,
            fontFamily: "monospace",
            fontSize: 14,
            theme: { background: "#1a1a1a", foreground: "#00ff00" },
            disableStdin: false,
            scrollback: 1000
          });
          termRef.current = term;

          const fitAddon = new FitAddon();
          term.loadAddon(fitAddon);

          if (!terminalRef.current) {
            console.error("Terminal container not found");
            return;
          }

          term.open(terminalRef.current);
          fitAddon.fit();
          term.focus();

          socket = io("wss://d.dev-baxa.me/terminal1", {
            transports: ["websocket"],
            auth: {
              token: `Bearer ${token}`
            }
          });
          socketRef.current = socket;

          socket.on("connect", () => {
            term.write("Connected to server\r\n");
          });

          socket.on("ssh_output", (output: string) => {
            term.write(output);
            term.scrollToBottom();
          });

          socket.on("ssh_error", (error: string) => {
            term.write(`\r\nError: ${error}\r\n`);
            term.scrollToBottom();
          });

          socket.on("message", (message: string) => {
            term.write(`${message}\r\n`);
            term.scrollToBottom();
          });

          term.onData((data: string) => {
            socket.emit("terminalData", {
              data: data
            });
          });
          socket.on("command_progress", (prog: any) => {
            console.log("command_progress:", prog);
            setpercentage(prog.percentage);
          });
          const handleResize = () => {
            fitAddon.fit();
            term.scrollToBottom();
          };
          window.addEventListener("resize", handleResize);

          return () => {
            socket?.disconnect();
            term?.dispose();
            window.removeEventListener("resize", handleResize);
          };
        } catch (err) {
          console.error("Terminal initialization error:", err);
        }
      };

      initializeTerminal();

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
        if (termRef.current) termRef.current.dispose();
      };
    } else {
      setCodeModalOpen(false);
    }
  }, [activeStep, configs?.id]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActiveStep((prev) => prev + 1);
    install(
      { data: formData },
      {
        onSuccess: () => {
          socketRef.current.emit("connectToServer", { productId: configs?.id });
        }
      }
    );
  };

  if (isLoading || isFetching) {
    return (
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "white",
            borderRadius: "10px",
            height: 50,
            width: 50
          }}
        >
          <CircularProgress size={20} />
        </Box>
      </Modal>
    );
  }

  console.log("persent:", percentage);

  return (
    <>
      <Modal open={activeStep !== 2} onClose={onClose} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "8px",
            padding: 2,
            paddingX: 2,
            paddingY: 1,
            backgroundColor: "#e0e3fa",
            height: 446,
            width: 579,
            alignItems: "start",
            boxShadow: 124
          }}
        >
          <div className="flex items-center absolute top-0 w-[100%] left-0 m-auto bg-[#fdfcfe] px-4 h-[30px] gap-2 rounded-[2px]">
            <IoMdCloseCircle
              size={18}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={onClose}
            />
            <p className="text-[13px] font-600 text-[grey]">{`${app?.applicationName}`}</p>
          </div>
          <Typography
            variant="h4"
            className="flex items-center gap-3 !mt-[50px]"
            sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
          >
            <img
              className="w-[56px] h-[56px] rounded-4"
              src={`https://d.dev-baxa.me/icons/${configs?.pathToIcon}`}
              onError={(e) => {
                e.currentTarget.src = "/icons/zoom1.png";
              }}
              alt={configs?.applicationName}
            />
            <p className="text-[40px] font-[500]">{configs?.applicationName}</p>
          </Typography>
          <div className="mt-[30px] mb-[20px]">
            <p className="text-[grey] text-[14px] font-400">Basic requirements</p>
            <div className="w-[100%] mt-1 p-6 gap-[30px] pt-4 justify-center h-[200px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <BsCpuFill color="grey" />
                  <p>CPU</p>
                </div>
                <p className="text-[16px] font-500">{configs?.cpu}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <BiMemoryCard />
                  <p>RAM</p>
                </div>
                <p className="text-[16px] font-500">{configs?.ram}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <RiComputerLine />
                  <p>Storage</p>
                </div>
                <p className="text-[16px] font-500">{configs?.storage}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <FiGlobe />
                  <p>Network</p>
                </div>
                <p className="text-[16px] font-500">{configs?.networkBandwidth}</p>
              </div>
            </div>
          </div>

          <div className="flex text-[10px] font-normal items-center justify-end">
            <div className="flex items-center gap-1">
              <Button
                sx={{
                  textTransform: "capitalize",
                  mr: 1,
                  fontFamily: "Inter, sans-serif"
                }}
                onClick={onClose}
                color="primary"
              >
                Cancel
              </Button>
              <button
                onClick={OpenInstallModal}
                className="flex w-[90px] h-[40px] rounded-[12px] text-[#1A79D8] font-500 text-[14px] items-center justify-center gap-1 bg-[white]"
              >
                Install
                <FiCheck size={19} />
              </button>
            </div>
            {openModal && (
              <div>
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-[#e7ecf8] rounded-2xl shadow-lg p-6 w-[650px] h-[620px]">
                    <div className="flex flex-col gap-2 mb-[30px]">
                      <h2 className="text-2xl font-semibold flex justify-between">
                        Datagaze {configs?.applicationName}
                        <img
                          className="w-[70px] h-[70px] rounded-4"
                          src={`${import.meta.env.VITE_BASE_URL}/icons/${configs?.pathToIcon}`}
                          onError={(e) => {
                            e.currentTarget.src = "/icons/zoom1.png";
                          }}
                          alt="logo"
                        />
                      </h2>
                      <p className="text-sm text-gray-600">
                        Publisher:
                        <span className="text-blue-500 cursor-pointer">
                          {configs?.publisher}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Version: {configs?.webVersion}
                      </p>
                      <p className="text-sm text-gray-600">
                        Release date: {configs?.releaseDate}
                      </p>
                    </div>

                    <Stepper activeStep={activeStep} className="mt-4 text-[18px]">
                      {steps.map((label, index) => (
                        <Step key={index}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>

                    <div className="mt-[40px]">
                      {activeStep === 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="text-[18px] font-600">Basic requirements</h3>
                          <p className="text-[16px] text-[grey] mt-[60px] font-400">
                            CPU:<span className="text-black">{configs?.cpu}</span>
                          </p>
                          <p className="text-[16px] text-[grey] font-400">
                            RAM:<span className="text-black">{configs?.ram}</span>
                          </p>
                          <p className="text-[16px] text-[grey] font-400">
                            Storage:<span className="text-black">{configs?.storage}</span>
                          </p>
                          <p className="text-[16px] text-[grey] font-400">
                            Network:
                            <span className="text-black">
                              {configs?.networkBandwidth}
                            </span>
                          </p>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <form onSubmit={(e) => handleSubmit(e)}>
                          <div className="mt-[30px] grid grid-cols-2 gap-5">
                            <label className="flex flex-col text-[13px] font-600 gap-1">
                              IP address
                              <input
                                name="host"
                                onChange={handleChange}
                                value={formData.host}
                                type="text"
                                className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                                placeholder="IP address"
                              />
                            </label>
                            <label className="flex flex-col text-[13px] font-600 gap-1">
                              Port number
                              <input
                                value={formData.port}
                                name="port"
                                onChange={handleChange}
                                type="number"
                                className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                                placeholder="Port number"
                              />
                            </label>
                            <label className="flex flex-col text-[13px] font-600 gap-1">
                              Username
                              <input
                                name="username"
                                onChange={handleChange}
                                value={formData.username}
                                type="text"
                                className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                                placeholder="Username"
                              />
                            </label>
                            <label className="flex flex-col text-[13px] font-600 gap-1">
                              Password
                              <input
                                name="password"
                                onChange={handleChange}
                                value={formData.password}
                                type="password"
                                className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                                placeholder="Password"
                              />
                            </label>
                          </div>
                          <label className="flex flex-col text-[13px] mt-4 mb-5 font-600 gap-1">
                            Remind it checkbox
                            <input
                              name="socketId"
                              onChange={handleChange}
                              type="text"
                              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
                              placeholder="Remind it checkbox"
                            />
                          </label>
                          <div className="flex gap-2 justify-between items-center mt-[70px]">
                            <ReportGmailerrorredIcon className="text-[#1380ED] bg-light cursor-pointer" />
                            <div className="flex gap-3">
                              <Button
                                onClick={handleBack}
                                className="w-[137px]"
                                variant="outlined"
                                sx={{ textTransform: "capitalize" }}
                              >
                                {activeStep > 0 ? "< Back" : "Cancel"}
                              </Button>
                              <Button
                                type="submit"
                                className="w-[137px]"
                                variant="contained"
                                sx={{ textTransform: "capitalize" }}
                                color="primary"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>

                    {activeStep === 0 && (
                      <div className="flex gap-2 justify-between items-center mt-[70px]">
                        <ReportGmailerrorredIcon className="text-[#1380ED] cursor-pointer" />
                        <div className="flex gap-3">
                          <Button
                            onClick={handleBack}
                            className="w-[137px]"
                            variant="outlined"
                            sx={{ textTransform: "capitalize" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleNext}
                            className="w-[137px]"
                            variant="contained"
                            sx={{ textTransform: "capitalize" }}
                            color="primary"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {activeStep === 2 && (
        <Box
          sx={{
            position: "absolute",
            top: "43%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "6px",
            padding: 2,
            width: "90vw",
            height: "auto",
            maxHeight: "80vh",
            boxShadow: 14,
            display: "flex",
            gap: 1
          }}
        >
          {/* Chap tomon (Terminal) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              flex: 1
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >
              <IoMdCloseCircle
                size={18}
                className="cursor-pointer text-gray-500 hover:text-red-700"
                onClick={onClose}
              />
              <Typography variant="h6">Installation Terminal</Typography>
              <Box
                ref={terminalRef}
                sx={{
                  width: "690px",
                  height: "450px",
                  bgcolor: "#1a1a1a",
                  overflow: "hidden"
                }}
              />
            </Box>
          </Box>

          {/* O‘ng tomon (Sudo Commands) */}
          <MarkdownViewer
            content={markdown}
            prosent={percentage}
            upload={UploadApplication}
            ispanding={isPending}
            onRun={(cmd) => {
              if (!socketRef.current || !termRef.current) return;
              termRef.current.writeln(`\r\n$ ${cmd}`);
              socketRef.current.emit("terminalData", { data: `${cmd}\n` });
            }}
          />
        </Box>
      )}
    </>
  );
};

export default LicenseModalinstall;
