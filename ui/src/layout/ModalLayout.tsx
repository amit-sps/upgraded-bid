
interface ModalProps {
  isModalOpen: boolean;
  setModal: React.Dispatch<boolean>;
  children: React.ReactNode;
}

const ModalLayout = ({ isModalOpen, setModal, children }: ModalProps) => {
  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative min-w-auto p-6 rounded-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-gray-100">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="w-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalLayout;
