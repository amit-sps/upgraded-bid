import BarChart from "../../Chart/BarChart"
import LineChart from "../../Chart/LineChart";
import { useAppSelector } from "../../redux/hooks";

const UserListGraph = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className='p-6 bg-white rounded-md'>
       {user && user.isAdmin ? <BarChart/>: <LineChart/> }
    </div>
  )
}

export default UserListGraph