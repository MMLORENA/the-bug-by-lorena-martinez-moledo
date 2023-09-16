import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Given a Header Component", () => {
  describe("When it's rendered", () => {
    test("Then it should show a text 'The Bug' inside", () => {
      const expectedText = "The Bug";

      render(<Header />);

      const text = screen.getByText(expectedText);

      expect(text).toBeInTheDocument();
    });
  });
});
