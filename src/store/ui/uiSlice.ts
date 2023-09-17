import { createSlice } from "@reduxjs/toolkit";
import { UiState } from "./types";

export const initialUiState: UiState = {
  isLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    showLoading: (currentUiState): UiState => ({
      ...currentUiState,
      isLoading: true,
    }),
  },
});

export const uiReducer = uiSlice.reducer;
export const { showLoading: showLoadingActionCreator } = uiSlice.actions;
