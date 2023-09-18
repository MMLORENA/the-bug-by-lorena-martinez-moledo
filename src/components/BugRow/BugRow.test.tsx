import { screen } from "@testing-library/react";
import { getMockBug } from "../../factories/bugsFactory";
import { bugzillaName } from "../../mocks/bugs/bugs";
import BugRow from "./BugRow";
import renderWithProviders from "../../testUtils/renderWithProviders";

describe("Given a BugRow component", () => {
  describe("When it receives 'Bugzilla' bug data", () => {
    const mockBugzilla = getMockBug({ name: bugzillaName });

    test("Then it should show 'Bugzilla' text", () => {
      renderWithProviders(<BugRow bug={mockBugzilla} />);

      const bugzilla = screen.getByText(mockBugzilla.name);

      expect(bugzilla).toBeInTheDocument();
    });

    test("Then it should show two buttons with text 'Modify' 'Delete'", () => {
      const buttonTexts = ["Modify", "Delete"];

      renderWithProviders(<BugRow bug={mockBugzilla} />);

      buttonTexts.forEach((buttonText) => {
        const button = screen.getByRole("button", { name: buttonText });

        expect(button).toBeInTheDocument();
      });
    });
  });
});
