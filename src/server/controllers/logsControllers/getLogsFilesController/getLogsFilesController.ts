import { type NextFunction, type Response } from "express";
import { loginErrors } from "../../../../constants/errors/userErrors";
import User from "../../../../database/models/User";
import type LogManagerStructure from "../../../logs/LogManager/types";
import type { CustomRequest } from "../../../types";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

const getLogsFilesController =
  (logManager: LogManagerStructure) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id: userId } = req.userDetails;
    const {
      successCodes: { okCode },
    } = httpStatusCodes;

    try {
      const user = await User.findById(userId).exec();

      if (!user?.isAdmin) {
        throw loginErrors.userIsNotAdmin;
      }

      const logNamesFiles = logManager.getNameFilesFromLastNDays(30);

      res.status(okCode).json({ logFiles: logNamesFiles });
    } catch (error: unknown) {
      next(error);
    }
  };

export default getLogsFilesController;
