import { screen } from "@testing-library/react";
import BugsPage from "./BugsPage";
import renderWithProviders from "../../testUtils/renderWithProviders";
import { getMockBug } from "../../factories/bugsFactory";
import { bugzillaName, notFoundSpiderName } from "../../mocks/bugs/bugs";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../store";

describe("Given a BugsPage", () => {
  describe("When it's render", () => {
    test("Then it should show a 'Debug Directory' heading inside", () => {
      const headingText = /Debug directory/i;

      renderWithProviders(<BugsPage />);

      const heading = screen.getByRole("heading", { name: headingText });

      expect(heading).toBeInTheDocument();
    });

    describe("When there is 'Bugzilla' and '404 Spider' bugs in the store", () => {
      test("Then it should show 'Bugzilla' and '404 Spider' texts", () => {
        const mockBugzilla = getMockBug({ name: bugzillaName });
        const mockNotFoundSpider = getMockBug({ name: notFoundSpiderName });

        const mockPreloadedBugState: Partial<PreloadedState<RootState>> = {
          bugsStore: {
            bugs: [mockBugzilla, mockNotFoundSpider],
          },
        };

        renderWithProviders(<BugsPage />, mockPreloadedBugState);

        const bugzillaText = screen.getByText(mockBugzilla.name);
        const notFoundSpiderText = screen.getByText(mockNotFoundSpider.name);

        expect(bugzillaText).toBeInTheDocument();
        expect(notFoundSpiderText).toBeInTheDocument();
      });
    });
  });
});
