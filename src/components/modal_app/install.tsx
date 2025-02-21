import { Modal, Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { LaunchpadData } from "~/types";
import { BiMemoryCard } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { BsCpuFill } from "react-icons/bs";
import { RiComputerLine } from "react-icons/ri";
import { FiGlobe } from "react-icons/fi";

const LicenseModalinstall = ({
  app,
  onClose
}: {
  app: LaunchpadData;
  onClose: () => void;
}) => {
  const [tabValue, setTabValue] = useState("Server Details");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "10px",
          padding: 1,
          paddingX: 2,
          backgroundColor: ["#e0e3fa"],
          height: 446,
          width: 579,
          alignItems: "start",
          boxShadow: 24
        }}
      >
        <div className="flex items-center w-[75vh] px-2 h-[30px] gap-2 mb-6   justify-start">
          <IoMdCloseCircle
            size={18}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
          <p className="text-[13px]  font-600 text-[grey]">{app.title}</p>
        </div>
        <Typography
          variant="h4"
          className="flex items-center gap-3"
          sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
        >
          <img className="w-[56px] h-[56px]" src={app.img} alt="" />
          <p className="text-[40px] font-[500]">{app.title}</p>
        </Typography>
        <div className="mt-[30px] mb-[20px]">
          <p className="text-[grey] text-[14px] font-400">Basic requirements</p>

          <div className="w-[100%] mt-1 p-6 gap-[30px] pt-4 justify-center h-[200px] grid grid-cols-2 rounded-[8px] bg-[#fdfcfe]">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <BsCpuFill color="grey" />

                <p>CPU</p>
              </div>
              <p className="text-[16px] font-500">{app.CPU}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <BiMemoryCard />

                <p>RAM</p>
              </div>
              <p className="text-[16px] font-500">{app.File_size}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <RiComputerLine />

                <p>Storage</p>
              </div>
              <p className="text-[16px] font-500">{app.Storage}</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <FiGlobe />

                <p>Network</p>
              </div>
              <p className="text-[16px] font-500">{app.Network}</p>
            </div>
          </div>
        </div>

        <div className="flex text-[10px] font-normal items-center justify-end">
          <div className="flex items-center gap-1 ">
            <Button onClick={onClose} color="primary" sx={{ mr: 1 }}>
              Cancel
            </Button>
            <button className="flex w-[90px] h-[40px] rounded-[12px]  text-[#1A79D8] font-500 text-[14px] items-center flex justify-center gap-1 bg-[white]">
              Install
              <FiCheck size={19} />
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default LicenseModalinstall;
