import { Outlet } from "react-router-dom";
import "./Layout.scss";
import Header from "../Header/Header";

const Layout = (): React.ReactElement => {
  return (
    <div className="container">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
