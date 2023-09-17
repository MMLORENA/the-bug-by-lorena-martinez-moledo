import { useEffect } from "react";
import useBugs from "../../hooks/useBugs/useBugs";
import { useAppDispatch } from "../../store";
import { loadBugsActionCreator } from "../../store/bugs/bugsSlice";
import "./BugsPage.scss";

const BugsPage = (): React.ReactElement => {
  const { getBugs } = useBugs();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const bugs = await getBugs();

      dispatch(loadBugsActionCreator(bugs));
    })();
  }, [getBugs, dispatch]);

  return <h1 className="bugs-page-title">Debug Directory</h1>;
};

export default BugsPage;
