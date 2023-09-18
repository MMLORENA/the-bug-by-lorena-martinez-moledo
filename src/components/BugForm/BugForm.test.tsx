import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import BugForm from "./BugForm";
import userEvent from "@testing-library/user-event";
import { mockBugzillaData } from "../../mocks/bugs/bugs";

describe("Given a BugForm component", () => {
  const mockOnSubmit = vi.fn();
  const buttonText = /create/i;
  const headingTexts = ["Name", "Picture", "Description"];
  const categoryHeading = "Category";

  describe("When it's render", () => {
    test("Then it should show 'Name', 'Picture', 'Description' text fields", () => {
      renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);

      headingTexts.forEach((headingText) => {
        const input = screen.getByLabelText(headingText);

        expect(input).toBeInTheDocument();
      });
    });

    test("Then it should show a disabled button with text 'Create'", () => {
      renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);

      const button = screen.getByRole("button", { name: buttonText });

      expect(button).toBeDisabled();
    });
  });

  describe("When the user types correctly 'Bugzilla' data", () => {
    const nameHeading = "Name";
    const pictureHeading = "Picture";
    const descriptionHeading = "Description";
    const { category, description, name, picture } = mockBugzillaData;

    test("Then it should update the text field 'Name' with the received value", async () => {
      renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);

      const nameField = screen.getByLabelText(nameHeading);

      await userEvent.type(nameField, name);

      expect(nameField).toHaveValue(name);
    });

    describe("And clicks 'Create' button", () => {
      test("Then it should invoke onSubmit function", async () => {
        renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);

        const nameField = screen.getByLabelText(nameHeading);
        const pictureField = screen.getByLabelText(pictureHeading);
        const categoryField = screen.getByLabelText(categoryHeading);
        const descriptionField = screen.getByLabelText(descriptionHeading);

        await userEvent.type(nameField, name);
        await userEvent.type(pictureField, picture);
        await userEvent.selectOptions(categoryField, category);
        await userEvent.type(descriptionField, description);

        const button = screen.getByRole("button", { name: buttonText });

        await userEvent.click(button);

        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
});
