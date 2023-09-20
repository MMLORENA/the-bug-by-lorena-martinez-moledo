import { render, screen } from "@testing-library/react";
import { getMemoryRouter } from "../../routers/routers";
import Navigation from "./Navigation";
import { RouterProvider } from "react-router-dom";

describe("Given the navigation component", () => {
  describe("When it's render", () => {
    test("Then it should show a link to create and home", () => {
      const createLinkText = /create/i;
      const homeLinkText = /home/i;

      const router = getMemoryRouter({ ui: <Navigation /> });
      render(<RouterProvider router={router} />);

      const createLink = screen.getByRole("link", { name: createLinkText });
      const homeLink = screen.getByRole("link", { name: homeLinkText });

      expect(createLink).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });
  });
});
