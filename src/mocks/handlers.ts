import { rest } from "msw";
import { apiPartialPaths } from "../constants/apiPaths/apiPaths";
import { mocksBugs } from "../factories/bugsFactory";

const apiUrl = import.meta.env.VITE_API_URL;

export const handlers = [
  rest.get(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(mocksBugs))
  ),
];

export const errorsHandlers = [
  rest.get(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(500))
  ),
];
