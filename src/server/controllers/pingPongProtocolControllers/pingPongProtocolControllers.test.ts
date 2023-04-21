import type { Request, Response } from "express";
import getPong from "./pingPongProtocolController";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {};

describe("Given a getPong controller", () => {
  describe("When it receives a request", () => {
    test("Then it should invoke the response's json method with a message 'Pong 🏓'", () => {
      const expectedMessage = "Pong 🏓";

      getPong(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
