import Navbar from "../components/layouts/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/layouts/Footer";

const ClientLayouts = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ClientLayouts;
