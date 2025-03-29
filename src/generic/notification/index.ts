import { toast } from "sonner";
type NotificationType = "superadmin" | "Not register" | "Install" | "Uninstall";

export const notificationApi = () => {
  const notify = (type: NotificationType) => {
    switch (type) {
      case "superadmin":
        toast.success("Welcome Superadmin ✅", {
          action: {
            label: "❌",
            onClick: () => toast.dismiss()
          }
        });
        break;
      case "Not register":
        toast.error("Error Log in ❌", {
          action: {
            label: "❌",
            onClick: () => toast.dismiss()
          }
        });
        break;
      case "Install":
        toast.info("Muvaffaqiyatli o'rnatildi !", {
          action: {
            label: "❌",
            onClick: () => toast.dismiss()
          }
        });
      case "Uninstall":
        toast.success("Muvaffaqiyatli Ochirildi !", {
          action: {
            label: "❌",
            onClick: () => toast.dismiss()
          }
        });
    }
  };
  return notify;
};
