import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Layout.scss";
import Header from "../Header/Header";
import Loading from "../Loading/Loading";
import { useAppSelector } from "../../store";

const Layout = (): React.ReactElement => {
  const { isLoading } = useAppSelector((uiState) => uiState.uiStore);

  return (
    <>
      <div className="container">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      {isLoading && <Loading />}
      <ToastContainer />
    </>
  );
};

export default Layout;
