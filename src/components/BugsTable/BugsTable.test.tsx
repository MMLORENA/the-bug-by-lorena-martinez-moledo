import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import BugsTable from "./BugsTable";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getMockBug } from "../../factories/bugsFactory";
import { bugzillaName } from "../../mocks/bugs/bugs";

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
    test("Then it should show 'Bugzilla' text", () => {
      const mockBugzilla = getMockBug({ name: bugzillaName });

      const mockPreloadedBugState: Partial<PreloadedState<RootState>> = {
        bugsStore: {
          bugs: [mockBugzilla],
        },
      };

      renderWithProviders(<BugsTable />, mockPreloadedBugState);

      const bugzilla = screen.getByText(mockBugzilla.name);

      expect(bugzilla).toBeInTheDocument();
    });
  });
});