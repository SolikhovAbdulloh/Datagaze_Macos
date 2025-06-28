import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryApi } from "~/hooks/useQuery";
import { remove, setUser, Usertype } from "~/utils";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { LuShield } from "react-icons/lu";
import { useClickOutside } from "~/hooks";

const TopBar = () => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const navigate = useNavigate();

  useClickOutside(menuRef, () => setShowAppleMenu(false), [appleBtnRef]);
  const handleLogout = () => {
    remove();
    navigate("/", { replace: true });
  };

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
            <LuShield size={30} />
          </div>
        </div>

        <p className="font-normal cursor-pointer ml-3 font-bold">SecureApp</p>
      </div>

      <div className="flex items-center justify-end gap-4 ">
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
          <div
            ref={menuRef}
            className="absolute top-full mt-3 w-[150px] bg-[#4474f8] text-white rounded-lg shadow-lg z-31"
          >
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
