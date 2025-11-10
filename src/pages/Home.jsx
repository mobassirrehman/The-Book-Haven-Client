import useTitle from "../hooks/useTitle";

const Home = () => {
  useTitle("Home");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to The Book Haven</h1>
    </div>
  );
};

export default Home;
