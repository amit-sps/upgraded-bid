import { Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import Authentication from "./pages/Authentication";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protected from "./HOC/Protected";
import Dashboard from "./pages/Dashboard";
import BiddingList from "./pages/BiddingList";
import UserIdList from "./pages/UserIdList";
import BidDetails from "./pages/BidDetails";
import ResetPassword from "./pages/ResetPassword";
import { useAppSelector } from "./redux/hooks";

function App() {

  const {isLoggedIn, user} = useAppSelector((state=> state.auth));
  return (
    <>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={<Protected children={<AppLayout />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="bids">
            <Route index element={<BiddingList />} />
            <Route path=":bidId" element={<BidDetails />} />
          </Route>
          {isLoggedIn && user && user.isAdmin && <Route path="userids" element={<UserIdList />} />}
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
