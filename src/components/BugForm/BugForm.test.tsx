import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import BugForm from "./BugForm";

describe("Given a BugForm component", () => {
  describe("When it's render", () => {
    test("Then it should show 'Name', 'Picture', 'Category', 'Description' headings", () => {
      const headingsTexts = ["Name", "Picture", "Category", "Description"];

      renderWithProviders(<BugForm />);

      headingsTexts.forEach((headingText) => {
        const input = screen.getByLabelText(headingText);

        expect(input).toBeInTheDocument();
      });
    });
  });
});
