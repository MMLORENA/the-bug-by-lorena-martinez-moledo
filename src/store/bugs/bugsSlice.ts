import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BugsState } from "./types";
import { Bugs } from "../../types";

export const initialBugsState: BugsState = {
  bugs: [],
};

const bugsSlice = createSlice({
  name: "bugs",
  initialState: initialBugsState,
  reducers: {
    loadBugs: (currentBugsState, action: PayloadAction<Bugs>): BugsState => ({
      ...currentBugsState,
      bugs: action.payload,
    }),
  },
});

export const bugsReducer = bugsSlice.reducer;
export const { loadBugs: loadBugsActionCreator } = bugsSlice.actions;
