import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Applications",
    desktop: false,
    img: "/icons/icon-4.png"
  },

  {
    id: "support",
    title: "Support",
    desktop: false,
    width: 600,
    height: 580,
    y: -20,
    img: "/icons/support.png"
  },
  {
    id: "Superadmin",
    title: "Superadmin",
    desktop: true,
    width: 1100,
    height: 500,
    content: <SuperAdmin_users />,
    img: "/icons/users.png"
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    width: 1100,
    height: 500,
    img: "/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "Add product",
    title: "Add product",
    desktop: true,
    width: 1100,
    height: 500,
    img: "/icons/Liceses.png",
    content: <ModalLicense />
  },
  {
    id: "computers",
    title: "Computers",
    desktop: true,
    width: 1100,
    height: 500,
    img: "/icons/camputers.png",
    content: <Computers />
  }
];
export default apps;
