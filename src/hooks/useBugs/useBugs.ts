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

    const { data: bugs } = await axios.get(apiPartialPaths.base);

    dispatch(hideLoadingActionCreator());

    return bugs;
  }, [dispatch]);

  return {
    getBugs,
  };
};

export default useBugs;
