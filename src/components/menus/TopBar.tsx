import { Popover, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryApi } from "~/hooks/useQuery";
import { remove, setUser, Usertype } from "~/utils";
import { RiLogoutCircleRLine } from "react-icons/ri";

const TopBar = () => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    remove();
    navigate("/", { replace: true });
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { data } = useQueryApi({
    url: "/api/1/auth/user",
    pathname: "user"
  });
  useEffect(() => {
    if (data) {
      let userinfo = {
        email: data?.email,
        user: data?.username,
        fullName: data?.fullName
      };
      setUser(userinfo);
    }
  }, [data]);

  return (
    <div className="relative w-full h-[44px] flex  items-center justify-between bg-gray-700/10 text-sm text-white px-4 shadow">
      <div className="flex items-center ">
        <div className="relative">
          <div ref={appleBtnRef} className="cursor-pointer">
            <img src="/logo/logo_data.svg" alt="Datagaze" className="w-[15px] h-[23px]" />
          </div>
        </div>

        <p className="font-normal cursor-pointer ml-3">DataGaze LTD 2025</p>
      </div>

      <div className="flex items-center justify-end gap-4 ">
        <button
          className="cursor-pointer flex items-center space-x-1"
          onClick={() => window.open("https://www.datagaze.uz/", "_blank")}
        >
          <span className="i-bx:bx-globe text-[17px]" />
          <span>Go to website</span>
        </button>
        {/* <div>
          <button onClick={handleClick} className="px-4 py-2  text-white rounded">
            Notifications
          </button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
          >
            <div className="w-[329px] h-[120px]">
              <Typography
                className="flex items-center space-x-3 bg-white/50 backdrop-blur-lg p-4 rounded-2xl shadow-xl"
                sx={{ p: 2 }}
              >
                <div className="flex items-center justify-center bg-transparent rounded-lg">
                  <span className="i-bx:bx-error text-blue-500 text-2xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">License Limit Reached</p>
                  <p className="text-gray-700 text-sm">
                    "You’ve reached the maximum number of licenses. Upgrade to continue
                    using all features."
                  </p>
                </div>
              </Typography>
            </div>
          </Popover>
        </div> */}
        <div
          onClick={() => setShowAppleMenu(!showAppleMenu)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="i-bx:bxs-smile text-[17px]" />
          <span>{data?.username}</span>
          <span
            className={`${showAppleMenu ? "i-bx:bx-chevron-down" : "i-bx:bx-chevron-up"} text-[20px]`}
          />
        </div>
        {showAppleMenu && (
          <div className="absolute top-full mt-3 w-[150px] bg-[#4474f8] text-white rounded-lg shadow-lg z-30">
            <button
              onClick={handleLogout}
              className="w-full  p-3   bg-grey text-white flex items-center cursor-pointer 
                          hover:bg-white/20 transition-colors duration-200 flex items-center gap-5 rounded-md text-sm font-medium"
            >
              Log Out
              <RiLogoutCircleRLine size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
