import {
  RouteObject,
  createBrowserRouter,
  createMemoryRouter,
} from "react-router-dom";
import { InitialEntry } from "@remix-run/router";
import routes from "./routes";
import routerPaths from "../constants/routerPaths/routerPaths";

interface MemoryRouterOptions {
  ui?: React.ReactElement;
  initialEntries?: InitialEntry[];
}

export const appRouter = createBrowserRouter(routes);

export const getMemoryRouter = ({
  ui,
  initialEntries = [routerPaths.root],
}: MemoryRouterOptions) => {
  const memoryRoutes: RouteObject[] = ui
    ? [
        {
          path: "/",
          element: ui,
        },
      ]
    : routes;

  return createMemoryRouter(memoryRoutes, { initialEntries });
};
