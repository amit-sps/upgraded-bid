import Cards from "../components/Cards";
import Skills from "../components/Skills";
import UserListGraph from "../components/UserListGraph";

function Dashboard() {

  return (
    <>
      <div className="p-4">
        <Cards />
      </div>
      <div className="py-6 px-4">
        <UserListGraph />
      </div>

      <div className="py-6 px-4">
        <Skills />
      </div>
    </>
  );
}

export default Dashboard;
