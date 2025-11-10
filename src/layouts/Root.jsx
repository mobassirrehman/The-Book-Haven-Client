import { Outlet } from "react-router";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";

const Root = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Root;
