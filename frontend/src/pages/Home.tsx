import { useAuth } from "../context/authContext";


const Home = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="home">
      <h1>Notes Application</h1>

    </div>
  )
}

export default Home;