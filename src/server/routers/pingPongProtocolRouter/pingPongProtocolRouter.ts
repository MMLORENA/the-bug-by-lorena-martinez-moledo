import { Router } from "express";
import getPong from "../../controllers/pingPongProtocolControllers/pingPongProtocolController.js";
import { paths } from "../paths.js";

const pingPongProtocolRouter = Router();

pingPongProtocolRouter.get(paths.root, getPong);

export default pingPongProtocolRouter;
