import { screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "../../routers/routers";
import renderWithProviders from "../../testUtils/renderWithProviders";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../store";

describe("Given a root '/' path", () => {
  describe("When it's render", () => {
    test("Then it should 'The Bug' text inside", () => {
      const expectedText = "The Bug";

      renderWithProviders(<RouterProvider router={appRouter} />);

      const text = screen.getByText(expectedText);

      expect(text).toBeInTheDocument();
    });

    describe("And the UI is waiting for the data", () => {
      test("Then it should have an accesible text 'Loading... Please wait'", () => {
        const mockPreloadedState: Partial<PreloadedState<RootState>> = {
          uiStore: {
            isLoading: true,
          },
        };

        const accessibleName = /Loading... Please wait/i;

        renderWithProviders(
          <RouterProvider router={appRouter} />,
          mockPreloadedState
        );

        const loading = screen.getByLabelText(accessibleName);

        expect(loading).toBeInTheDocument();
      });
    });
  });
});
