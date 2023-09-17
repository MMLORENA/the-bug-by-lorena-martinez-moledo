import { screen } from "@testing-library/react";
import BugsPage from "./BugsPage";
import renderWithProviders from "../../testUtils/renderWithProviders";

describe("Given a BugsPage", () => {
  describe("When it's render", () => {
    test("Then it should show a 'Debug Directory' heading inside", () => {
      const headingText = /Debug directory/i;

      renderWithProviders(<BugsPage />);

      const heading = screen.getByRole("heading", { name: headingText });

      expect(heading).toBeInTheDocument();
    });
  });
});
