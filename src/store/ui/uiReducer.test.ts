import { UiState } from "./types";
import {
  hideLoadingActionCreator,
  initialUiState,
  showLoadingActionCreator,
  uiReducer,
} from "./uiSlice";

describe("Given a uiReducer function", () => {
  describe("When it receives a current ui state and showLoading action", () => {
    test("Then it should return a new ui state with isLoading value true", () => {
      const currentUiState: UiState = initialUiState;
      const showLoadingAction = showLoadingActionCreator();
      const expectedUiState: UiState = {
        ...currentUiState,
        isLoading: true,
      };

      const newUiState = uiReducer(currentUiState, showLoadingAction);

      expect(newUiState).toStrictEqual(expectedUiState);
    });
  });

  describe("When it receives a current ui state and hideLoading action", () => {
    test("Then it should return a new ui state with isLoading value false", () => {
      const currentUiState: UiState = {
        isLoading: true,
      };
      const showLoadingAction = hideLoadingActionCreator();
      const expectedUiState: UiState = {
        ...currentUiState,
        isLoading: false,
      };

      const newUiState = uiReducer(currentUiState, showLoadingAction);

      expect(newUiState).toStrictEqual(expectedUiState);
    });
  });
});
