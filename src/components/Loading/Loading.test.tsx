import { screen } from "@testing-library/react";
import renderWithProviders from "../../testUtils/renderWithProviders";
import Loading from "./Loading";

describe("Given a Loading Component", () => {
  describe("When its rendered", () => {
    test("Then it should show as accesible text 'Loading... Please wait'", () => {
      const accessibleName = /Loading... Please wait/i;

      renderWithProviders(<Loading />);

      const loading = screen.getByLabelText(accessibleName);

      expect(loading).toBeInTheDocument();
    });
  });
});
