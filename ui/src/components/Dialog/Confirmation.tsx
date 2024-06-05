import { toast } from "react-toastify";
import Swal, { SweetAlertIcon } from "sweetalert2";

interface ConfirmationProps {
  onConfirmation: () => void;
  message?: string;
  textMessage?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Confirmation = async ({ onConfirmation, message, textMessage }: ConfirmationProps, callback: any ): Promise<void> => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: textMessage || "You won't be able to revert this!",
    icon: "warning" as SweetAlertIcon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, do it!",
    position: "center"
  });

  if (result.isConfirmed) {
    await onConfirmation();
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    if (callback) {
      callback();
    }
  }
};

export default Confirmation;
