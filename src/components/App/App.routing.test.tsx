import { screen, waitFor } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { appRouter, getMemoryRouter } from "../../routers/routers";
import renderWithProviders from "../../testUtils/renderWithProviders";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import server from "../../mocks/server";
import { createPageErrorHandlers, errorsHandlers } from "../../mocks/handlers";
import feedbackMessages from "../../constants/feedbackMessages/feedbackMessages";
import routerPaths from "../../constants/routerPaths/routerPaths";
import { mockBugzillaData } from "../../mocks/bugs/bugs";
import userEvent from "@testing-library/user-event";

const loadingText = "Loading... Please wait";

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

    describe("And there is an error geting the bugs data", () => {
      test("Then it should show a text 'Oops, error on load bugs'", async () => {
        server.use(...errorsHandlers);

        renderWithProviders(<RouterProvider router={appRouter} />);

        await waitFor(() => {
          expect(screen.queryByLabelText(loadingText)).not.toBeInTheDocument();
        });

        await waitFor(() => {
          const error = screen.getByText(feedbackMessages.errorLoadBugs);

          expect(error).toBeInTheDocument();
        });
      });
    });
  });
});

describe("Given a '/create' path", () => {
  const nameHeading = "Name";
  const pictureHeading = "Picture";
  const descriptionHeading = "Description";
  const categoryHeading = "Category";
  const { category, description, name, picture } = mockBugzillaData;

  describe("When it's rendered", () => {
    test("Then it should show a 'Create new bug' heading", () => {
      const headingText = /Create a new bug/i;
      const router = getMemoryRouter({ initialEntries: [routerPaths.create] });

      renderWithProviders(<RouterProvider router={router} />);

      const heading = screen.getByRole("heading", { name: headingText });

      expect(heading).toBeInTheDocument();
    });
  });

  describe("When the user types correctly 'Bugzilla' data and the user clicks the button 'Create'", () => {
    test("Then it should show 'Bugzilla' text", async () => {
      const buttonText = "Create";
      const router = getMemoryRouter({ initialEntries: [routerPaths.create] });

      renderWithProviders(<RouterProvider router={router} />);

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

      await waitFor(() => {
        expect(screen.queryByLabelText(loadingText)).not.toBeInTheDocument();
      });

      await waitFor(() => {
        const successfullyCreatedMessage = screen.getByText(
          feedbackMessages.createBug.success
        );

        expect(successfullyCreatedMessage).toBeInTheDocument();
      });
    });
  });

  describe("When the user types bug data and the user clicks the button 'Create' and there is an error", () => {
    test("Then it should show 'Oops, error creating a new bug'", async () => {
      server.use(...createPageErrorHandlers);
      const router = getMemoryRouter({ initialEntries: [routerPaths.create] });

      const buttonText = "Create";

      renderWithProviders(<RouterProvider router={router} />);

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

      await waitFor(() => {
        expect(screen.queryByLabelText(loadingText)).not.toBeInTheDocument();
      });

      await waitFor(() => {
        const errorCreatingBugMessage = screen.getByText(
          feedbackMessages.createBug.error
        );

        expect(errorCreatingBugMessage).toBeInTheDocument();
      });
    });
  });
});
