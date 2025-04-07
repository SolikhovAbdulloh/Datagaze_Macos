import { toast } from "sonner";
type NotificationType =
  | "superadmin"
  | "Not register"
  | "Install"
  | "Uninstall"
  | "Add new user"
  | "o'chirildi"
  | "Xatolik";
export const notificationApi = () => {
  const notify = (type: NotificationType, username?: string) => {
    switch (type) {
      case "superadmin":
        toast.success(`Welcome  ${username && username} ✅`, { closeButton: true });
        break;
      case "Not register":
        toast.error("Ro'yxatdan o'tishda xatolik ❌", { closeButton: true });
        break;
      case "Install":
        toast.info("Muvaffaqiyatli o'rnatildi !", { closeButton: true });
        break;
      case "Uninstall":
        toast.success("Muvaffaqiyatli Ochirildi !", { closeButton: true });
        break;
      case "Add new user":
        toast.success("Mijoz ro'yxatga qo'shildi !", { closeButton: true });
        break;
      case "o'chirildi":
        toast.success(`O'chirildi !!!`, { closeButton: true });
        break;
      case "Xatolik":
        toast.error(`Xatolik !!!`, { closeButton: true });
        break;
    }
  };
  return notify;
};
