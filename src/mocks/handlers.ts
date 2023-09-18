import { rest } from "msw";
import { apiPartialPaths } from "../constants/apiPaths/apiPaths";
import { mocksBugs } from "../factories/bugsFactory";
import { mockBugzillaData } from "./bugs/bugs";

const apiUrl = import.meta.env.VITE_API_URL;

export const handlers = [
  rest.get(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(mocksBugs))
  ),
  rest.delete(`${apiUrl}${apiPartialPaths.base}/1`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
  rest.post(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(201), ctx.json({ ...mockBugzillaData, id: "1" }))
  ),
];

export const errorsHandlers = [
  rest.get(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(500))
  ),
  rest.delete(`${apiUrl}${apiPartialPaths.base}/1`, (_req, res, ctx) =>
    res(ctx.status(400))
  ),
  rest.post(`${apiUrl}${apiPartialPaths.base}`, (_req, res, ctx) =>
    res(ctx.status(409))
  ),
];
