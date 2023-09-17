import axios from "axios";
import { useCallback } from "react";
import { Bugs } from "../../types";
import { apiPartialPaths, apiUrl } from "../../constants/apiPaths/apiPaths";
import { useAppDispatch } from "../../store";
import {
  hideLoadingActionCreator,
  showLoadingActionCreator,
} from "../../store/ui/uiSlice";

axios.defaults.baseURL = apiUrl;

const useBugs = () => {
  const dispatch = useAppDispatch();

  const getBugs = useCallback(async (): Promise<Bugs> => {
    dispatch(showLoadingActionCreator());

    try {
      const { data: bugs } = await axios.get(apiPartialPaths.base);
      dispatch(hideLoadingActionCreator());

      return bugs;
    } catch {
      dispatch(hideLoadingActionCreator());

      throw new Error("Error on load bugs");
    }
  }, [dispatch]);

  const deleteBug = async (bugId: string): Promise<void> => {
    dispatch(showLoadingActionCreator());

    try {
      await axios.delete(`${apiPartialPaths.base}${bugId}`);

      dispatch(hideLoadingActionCreator());
    } catch {
      dispatch(hideLoadingActionCreator());

      throw new Error("Error on delete bug");
    }
  };

  return {
    getBugs,
    deleteBug,
  };
};

export default useBugs;
