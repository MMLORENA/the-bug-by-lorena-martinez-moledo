import { Navigate, RouteObject } from "react-router-dom";
import routerPaths from "../constants/routerPaths/routerPaths";
import App from "../components/App/App";
import BugsPage from "../pages/BugsPage/BugsPage";
import CreateBugPage from "../pages/CreateBugPage/CreateBugPage";

const routes: RouteObject[] = [
  {
    path: routerPaths.root,
    element: <App />,
    children: [
      { index: true, element: <Navigate to={routerPaths.home} replace /> },
      { path: routerPaths.home, element: <BugsPage /> },
      { path: routerPaths.create, element: <CreateBugPage /> },
    ],
  },
];

export default routes;
