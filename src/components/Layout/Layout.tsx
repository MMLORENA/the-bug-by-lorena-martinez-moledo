import { Outlet } from "react-router-dom";
import "./Layout.scss";
import Header from "../Header/Header";

const Layout = (): React.ReactElement => {
  return (
    <div className="container">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
