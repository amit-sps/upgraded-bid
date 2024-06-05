import { useState } from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

const Authentication = () => {
  const [isLoginPage, setLoginPage] = useState<boolean>(true);
  return (
    <>
      {isLoginPage ? (
        <Login setLoginPage={setLoginPage} />
      ) : (
        <Register setLoginPage={setLoginPage} />
      )}
    </>
  );
};

export default Authentication;
