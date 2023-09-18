import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import CreateBugPage from "./CreateBugPage";

describe("Given a CreateBugPage", () => {
  describe("When it's render", () => {
    test("Then it should show a 'Create a new bug' heading inside", () => {
      const headingText = /Create a new bug/i;

      renderWithProviders(<CreateBugPage />);

      const heading = screen.getByRole("heading", { name: headingText });

      expect(heading).toBeInTheDocument();
    });

    test("Then it should show a form", () => {
      renderWithProviders(<CreateBugPage />);

      const form = screen.getByRole("form");

      expect(form).toBeInTheDocument();
    });
  });
});
