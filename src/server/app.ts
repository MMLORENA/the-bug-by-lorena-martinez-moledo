import express from "express";
import morgan from "morgan";
import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import * as apiKeyAuthenticator from "coders-app-api-key-authenticator";
import pingPongProtocolRouter from "./routers/pingPongProtocolRouter/pingPongProtocolRouter.js";
import generalError, { unknownEndpoint } from "./middlewares/errors/errors.js";
import openApiDocument from "../openapi/index.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import { environment } from "../environment/loadEnvironments.js";
import { partialPaths, paths } from "./routers/paths.js";
import setHeaderCredentials from "./middlewares/setHeaderCredentials/setHeaderCredentials.js";
import logsRouter from "./routers/logsRouter/logsRouter.js";

const { appName: currentApp } = environment;

const { checkApiKey } = apiKeyAuthenticator;

const app = express();

app.use(setHeaderCredentials);

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(paths.root, pingPongProtocolRouter);
app.use(
  paths.apiDocs.base,
  basicAuth({
    users: {
      [environment.swaggerAuth.username]: environment.swaggerAuth.password,
    },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);

app.use(partialPaths.users.base, checkApiKey(currentApp), usersRouter);
app.use(paths.logs.base, checkApiKey(currentApp), logsRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
