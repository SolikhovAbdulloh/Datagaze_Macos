import { useState } from "react";
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { LaunchpadData } from "~/types";
import { useEditApplication } from "~/hooks/useQuery/useQueryaction";
import { useQueryApi } from "~/hooks/useQuery";
import { format } from "date-fns";

interface EditDetailsModalProps {
  onClose: () => void;
  app: LaunchpadData;
}

export const EditDetailsModal = ({ onClose, app }: EditDetailsModalProps) => {
  const [ipAddress, setIpAddress] = useState("");
  const [portNumber, setPortNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useEditApplication();
  const EditApplication = () => {
    mutate(
      {
        host: ipAddress,
        port: Number(portNumber),
        username: username,
        password: password,
        productId: app?.id
      },
      { onSuccess: () => onClose() }
    );
  };
  const { data, isLoading } = useQueryApi({
    url: `/api/1/desktop/server-information/${app.id}`,
    pathname: "EditInformation"
  });
  if (isLoading) {
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
  return (
    <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          fontFamily: "sans-serif",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "10px",
          p: 2,
          backgroundColor: ["#e0e3fa"],
          height: 478,
          width: 520,
          boxShadow: 24
        }}
      >
        <div className="flex items-center gap-2 mb-8  justify-start">
          <IoMdCloseCircle
            size={18}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
          <p className="text-[13px] font-600 text-[grey]">{app.applicationName}</p>
        </div>

        <Typography
          variant="h4"
          className="flex items-center gap-3"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
        >
          <img
            className="w-[56px] h-[56px] rounded-4"
            src={`${import.meta.env.VITE_BASE_URL}/icons/${app?.pathToIcon}`}
            alt={app?.applicationName}
            onError={(e) => {
              e.currentTarget.src = "/icons/zoom1.png";
            }}
          />
          <p className="text-[40px] font-500">{app.applicationName}</p>
        </Typography>

        <div className="mt-[60px] grid grid-cols-2 gap-5 ">
          <label className="flex flex-col text-[13px] font-600 gap-1">
            IP address
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder={data?.hostname}
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Port number
            <input
              type="text"
              value={portNumber || ""}
              onChange={(e) => setPortNumber(e.target.value)}
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder={data?.port}
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder={data?.username}
            />
          </label>
          <label className="flex flex-col text-[13px] font-600 gap-1">
            Password
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
              placeholder="*****"
            />
          </label>
        </div>

        {/* <label className="flex flex-col text-[13px] mt-4 mb-5 font-600 gap-1">
          Remind it checkbox
          <input
            type="text"
            value={remind}
            onChange={(e) => setRemind(e.target.value)}
            className="rounded-[8px] bg-white font-500 w-[232px] h-[32px] p-1 px-2"
            placeholder="Remind it checkbox"
          />
        </label> */}

        <div className="flex text-[18px] font-700 justify-end mt-[50px]">
          <div className="flex items-center gap-1 ">
            <Button
              onClick={onClose}
              sx={{ textTransform: "capitalize", mr: 1, fontFamily: "Inter, sans-serif" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              sx={{
                textTransform: "capitalize",
                mr: 1,
                fontFamily: "Inter, sans-serif",
                background: "white",
                padding: "8px",
                borderRadius: "8px"
              }}
              onClick={EditApplication}
            >
              {isPending ? <CircularProgress size={18} /> : "Save"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
