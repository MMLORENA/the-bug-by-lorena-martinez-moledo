import { createBrowserRouter, createMemoryRouter } from "react-router-dom";
import { InitialEntry } from "@remix-run/router";
import routes from "./routes";

export const appRouter = createBrowserRouter(routes);

export const getMemoryRouter = (initialEntries: InitialEntry[]) => {
  return createMemoryRouter(routes, {
    initialEntries,
  });
};
