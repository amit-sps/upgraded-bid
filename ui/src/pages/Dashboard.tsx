import { roleGuard } from "../HOC/RoleGuard";
import { Roles } from "../assets";
import BidTable from "../components/BidTable";
import Cards from "../components/Cards";
import UserListGraph from "../components/UserListGraph";
import { useAppSelector } from "../redux/hooks";

function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <div className="p-4">
        <Cards />
      </div>
      <div className="py-6 px-4">
        <UserListGraph />
      </div>
      {user && roleGuard([Roles.Admin, Roles.AmitOnly], user.role) && (
        <div className="py-6 px-4">
          <BidTable />
        </div>
      )}
    </>
  );
}

export default Dashboard;
