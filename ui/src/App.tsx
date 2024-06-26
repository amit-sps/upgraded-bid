import { Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protected from "./HOC/Protected";
import Dashboard from "./pages/Dashboard";
import BiddingList from "./pages/BiddingList";
import TeamList from "./pages/TeamList";
import BidDetails from "./pages/BidDetails";
import ResetPassword from "./pages/ResetPassword";
import { useAppSelector } from "./redux/hooks";
import Resources from "./pages/Resources";
import RoleGuard, { roleGuard } from "./HOC/RoleGuard";
import { Roles } from "./assets";
import NotAuthorized from "./components/NotAuthorized";
import UserLists from "./pages/UserLists";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import InvalidInvite from "./components/InvalidInvite";
import NotFound from "./components/NotFound";

function App() {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={<Protected children={<AppLayout />} />}
        >
          <Route
            index
            element={
              <RoleGuard
                allowedRoles={[Roles.Admin, Roles.AmitOnly, Roles.BidOnly]}
                children={<Dashboard />}
              />
            }
          />
          <Route path="bids">
            <Route
              index
              element={
                <RoleGuard
                  allowedRoles={[Roles.Admin, Roles.AmitOnly, Roles.BidOnly]}
                  children={<BiddingList />}
                />
              }
            />
            <Route
              path=":bidId"
              element={
                <RoleGuard
                  allowedRoles={[Roles.Admin, Roles.AmitOnly, Roles.BidOnly]}
                  children={<BidDetails />}
                />
              }
            />
          </Route>
          {isLoggedIn &&
            user &&
            roleGuard([Roles.Admin, Roles.AmitOnly], user.role) && (
              <Route path="teams" element={<TeamList />} />
            )}

          <Route
            path="users"
            element={
              <RoleGuard
                allowedRoles={[Roles.Admin, Roles.AmitOnly]}
                children={<UserLists />}
              />
            }
          />
          <Route path="resources" element={<Resources />} />
        </Route>

        <Route path="/accept-invite" element={<Register />} />

        <Route path="/invalid-invite" element={<InvalidInvite />} />

        <Route
          path="/not-authorized"
          element={<Protected children={<AppLayout />} />}
        >
          <Route index element={<NotAuthorized />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
