import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

function AppLayout() {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === "loading" && <Spinner />}
      <div className="min-h-screen flex flex-col justify-between text-white">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default AppLayout;
