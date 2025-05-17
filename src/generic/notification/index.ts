import { toast } from "sonner";
type NotificationType =
  | "superadmin"
  | "Not register"
  | "Install"
  | "Uninstall"
  | "Add new user"
  | "Delete"
  | "Xatolik"
  | "Upload"
  | "Update";
export const notificationApi = () => {
  const notify = (type: NotificationType, user?: string) => {
    switch (type) {
      case "superadmin":
        toast.success(`Welcome ${user} ✅`, { closeButton: true });
        break;
      case "Not register":
        toast.error("Error registering ❌", { closeButton: true });
        break;
      case "Install":
        toast.success("Success install !", { closeButton: true });
        break;
      case "Uninstall":
        toast.success("Delete success !", { closeButton: true });
        break;
      case "Add new user":
        toast.success("Customer added to table !", { closeButton: true });
        break;
      case "Delete":
        toast.success(`Delete succsess !!!`, { closeButton: true });
        break;
      case "Xatolik":
        toast.error(`Error !!!`, { closeButton: true });
        break;
      case "Update":
        toast.success(`Success update!`, { closeButton: true });
        break;
      case "Upload":
        toast.info(`Success upload!`, { closeButton: true });
        break;
    }
  };
  return notify;
};
