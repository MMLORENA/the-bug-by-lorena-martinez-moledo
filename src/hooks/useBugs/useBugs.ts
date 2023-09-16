import axios from "axios";
import { useCallback } from "react";
import { Bugs } from "../../types";
import { apiPartialPaths, apiUrl } from "../../constants/apiPaths/apiPaths";

axios.defaults.baseURL = apiUrl;

const useBugs = () => {
  const getBugs = useCallback(async (): Promise<Bugs> => {
    const { data: bugs } = await axios.get(apiPartialPaths.base);

    return bugs;
  }, []);

  return {
    getBugs,
  };
};

export default useBugs;
