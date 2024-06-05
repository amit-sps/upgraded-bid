import { FC, ReactNode } from "react";
import { useAppSelector } from "../redux/hooks";
// import NotAuthorized from "../components/NotAuthorized";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
}

const Protected: FC<ProtectedProps> = ({ children }) => {
  // const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  //   if (!user?.isAdmin) {
  //     return <NotAuthorized />;
  //   }

  return <>{children}</>;
};

export default Protected;
