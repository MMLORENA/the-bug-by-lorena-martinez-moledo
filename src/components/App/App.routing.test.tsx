import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "../../routers/routers";
import { Provider } from "react-redux";
import { store } from "../../store";

describe("Given a root '/' path", () => {
  describe("When it's render", () => {
    test("Then it should 'The Bug' text inside", () => {
      const expectedText = "The Bug";

      render(
        <Provider store={store}>
          <RouterProvider router={appRouter} />
        </Provider>
      );

      const text = screen.getByText(expectedText);

      expect(text).toBeInTheDocument();
    });
  });
});
