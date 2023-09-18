import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BugsState } from "./types";
import { Bug, Bugs } from "../../types";

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
    deleteBug: (
      currentBugsState,
      action: PayloadAction<string>
    ): BugsState => ({
      ...currentBugsState,
      bugs: currentBugsState.bugs.filter((bug) => bug.id !== action.payload),
    }),
    createBug: (currentBugsState, action: PayloadAction<Bug>): BugsState => ({
      ...currentBugsState,
      bugs: [...currentBugsState.bugs, action.payload],
    }),
  },
});

export const bugsReducer = bugsSlice.reducer;
export const {
  loadBugs: loadBugsActionCreator,
  deleteBug: deleteBugActionCreator,
  createBug: createBugActionCreator,
} = bugsSlice.actions;
