import { toast } from "react-toastify";

const showFeedback = (message: string, type: "error" | "success"): void => {
  toast(message, {
    icon: "🐞",
    position: "top-center",
    type: type,
  });
};

export default showFeedback;
