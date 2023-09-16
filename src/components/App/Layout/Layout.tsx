import { Outlet } from "react-router-dom";
import "./Layout.scss";

const Layout = (): React.ReactElement => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
};

export default Layout;
