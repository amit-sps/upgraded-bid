import BarChart from "../../Chart/BarChart";
import LineChart from "../../Chart/LineChart";
import { roleGuard } from "../../HOC/RoleGuard";
import { Roles } from "../../assets";
import { useAppSelector } from "../../redux/hooks";

const UserListGraph = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-6 bg-white rounded-md">
      {user && roleGuard([Roles.Admin, Roles.AmitOnly], user.role) ? (
        <BarChart />
      ) : (
        <LineChart />
      )}
    </div>
  );
};

export default UserListGraph;
