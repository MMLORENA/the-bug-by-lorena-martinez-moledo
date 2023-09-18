import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import BugsTable from "./BugsTable";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getMockBug } from "../../factories/bugsFactory";
import { bugzillaName } from "../../mocks/bugs/bugs";
import userEvent from "@testing-library/user-event";
import server from "../../mocks/server";
import { errorsHandlers } from "../../mocks/handlers";

describe("Given a BugsTable component", () => {
  describe("When it render", () => {
    test("Then it should show 'Picture', 'Name', 'Category', 'Actions' as column headings", () => {
      const columnHeadingsNames = ["Picture", "Name", "Category", "Actions"];

      renderWithProviders(<BugsTable />);

      columnHeadingsNames.forEach((columnHeadingName) => {
        const columnHeading = screen.getByRole("columnheader", {
          name: columnHeadingName,
        });

        expect(columnHeading).toBeInTheDocument();
      });
    });
  });

  describe("When it receives 'Bugzilla' bug data", () => {
    const mockBugzilla = getMockBug({ name: bugzillaName, id: "1" });

    const mockPreloadedBugState: Partial<PreloadedState<RootState>> = {
      bugsStore: {
        bugs: [mockBugzilla],
      },
    };

    test("Then it should show 'Bugzilla' text", () => {
      renderWithProviders(<BugsTable />, mockPreloadedBugState);

      const bugzilla = screen.getByText(mockBugzilla.name);

      expect(bugzilla).toBeInTheDocument();
    });

    describe("And the user clicks on the 'delete' button of the bug", () => {
      const buttonText = "Delete";

      test("Then it shouldn't show 'Bugzilla' text", async () => {
        renderWithProviders(<BugsTable />, mockPreloadedBugState);

        const button = screen.getByRole("button", { name: buttonText });

        await userEvent.click(button);

        const bugzilla = screen.queryByText(bugzillaName);

        expect(bugzilla).not.toBeInTheDocument();
      });
    });

    describe("And the user clicks on the 'delete' button of the bug there is an error", () => {
      test("Then it should show 'Bugzilla' text", async () => {
        server.use(...errorsHandlers);

        renderWithProviders(<BugsTable />, mockPreloadedBugState);

        const button = screen.getByRole("button", { name: "Delete" });

        await userEvent.click(button);

        const bugzilla = screen.getByText(bugzillaName);

        expect(bugzilla).toBeInTheDocument();
      });
    });
  });
});
