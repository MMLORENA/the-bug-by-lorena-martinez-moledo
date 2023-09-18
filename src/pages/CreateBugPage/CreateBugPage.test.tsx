import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import CreateBugPage from "./CreateBugPage";
import { getBrowserRouter } from "../../routers/routers";
import { RouterProvider } from "react-router-dom";

describe("Given a CreateBugPage", () => {
  const createBugPageRouter = getBrowserRouter(<CreateBugPage />);

  describe("When it's render", () => {
    test("Then it should show a 'Create a new bug' heading inside", () => {
      const headingText = /Create a new bug/i;

      renderWithProviders(<RouterProvider router={createBugPageRouter} />);

      const heading = screen.getByRole("heading", { name: headingText });

      expect(heading).toBeInTheDocument();
    });

    test("Then it should show a form", () => {
      renderWithProviders(<RouterProvider router={createBugPageRouter} />);

      const form = screen.getByRole("form");

      expect(form).toBeInTheDocument();
    });
  });
});
