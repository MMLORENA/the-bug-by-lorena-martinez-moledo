import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "../../routers/routers";

describe("Given a root '/' path", () => {
  describe("When it's render", () => {
    test("Then it should 'The Bug' text inside", () => {
      const expectedText = "The Bug";

      render(<RouterProvider router={appRouter} />);

      const text = screen.getByText(expectedText);

      expect(text).toBeInTheDocument();
    });
  });
});
