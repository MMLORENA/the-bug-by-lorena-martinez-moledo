import { Navigate, RouteObject } from "react-router-dom";
import routerPaths from "../constants/routerPaths/routerPaths";
import App from "../components/App/App";

const routes: RouteObject[] = [
  {
    path: routerPaths.root,
    element: <App />,
    children: [
      { index: true, element: <Navigate to={routerPaths.home} replace /> },
      { path: routerPaths.home, element: <></> },
    ],
  },
];

export default routes;
