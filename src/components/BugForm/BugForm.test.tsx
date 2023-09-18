import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import BugForm from "./BugForm";
import userEvent from "@testing-library/user-event";
import { mockBugzillaData } from "../../mocks/bugs/bugs";

describe("Given a BugForm component", () => {
  describe("When it's render", () => {
    const headingsTexts = ["Name", "Picture", "Category", "Description"];

    test("Then it should show 'Name', 'Picture', 'Category', 'Description' text fields", () => {
      renderWithProviders(<BugForm />);

      headingsTexts.forEach((headingText) => {
        const input = screen.getByLabelText(headingText);

        expect(input).toBeInTheDocument();
      });
    });

    describe("And the user types the bug data", () => {
      test("Then it should update the text field value with what the user entered", async () => {
        renderWithProviders(<BugForm />);

        headingsTexts.forEach(async (headingText) => {
          const textField = screen.getByLabelText(headingText);

          for (const value of Object.values(mockBugzillaData)) {
            await userEvent.type(textField, value);

            expect(textField).toHaveValue(value);
          }
        });
      });
    });
  });
});
