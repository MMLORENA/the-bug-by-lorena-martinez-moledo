import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { getMemoryRouter } from "../../routers/routers";
import { RouterProvider } from "react-router-dom";

describe("Given a Header Component", () => {
  const router = getMemoryRouter({ ui: <Header /> });

  describe("When it's rendered", () => {
    test("Then it should show a text 'The Bug' inside", () => {
      const expectedText = "The Bug";

      render(<RouterProvider router={router} />);

      const text = screen.getByText(expectedText);

      expect(text).toBeInTheDocument();
    });
  });
});
