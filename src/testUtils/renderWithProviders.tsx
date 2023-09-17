import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { RootState, setupStore } from "../store";
import { PreloadedState } from "@reduxjs/toolkit";

const renderWithProviders = (
  ui: React.ReactElement,
  preloadedState?: PreloadedState<RootState>,
  renderOptions?: RenderOptions
) => {
  const store = setupStore(preloadedState);

  return {
    ...render(ui, {
      wrapper: () => <Provider store={store}>{ui}</Provider>,
      ...renderOptions,
    }),
  };
};

export default renderWithProviders;
