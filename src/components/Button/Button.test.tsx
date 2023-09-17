import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import renderWithProviders from "../../testUtils/renderWithProviders";
import Button from "./Button";

describe("Given a Button component", () => {
  describe("When it receives 'Send' as text", () => {
    const buttonText = "Send";

    test("Then it should show a button with text inside 'Send'", () => {
      renderWithProviders(<Button>{buttonText}</Button>);

      const button = screen.getByRole("button", { name: buttonText });

      expect(button).toBeInTheDocument();
    });

    describe("And when it receives an actionOnClick and the user clicks on it", () => {
      test("Then the received actionOnClick should be invoked", async () => {
        const mockActionOnClick = vi.fn();

        renderWithProviders(
          <Button onClick={mockActionOnClick}>{buttonText}</Button>
        );

        const button = screen.getByRole("button", { name: buttonText });

        await userEvent.click(button);

        expect(mockActionOnClick).toHaveBeenCalled();
      });
    });
  });
});
