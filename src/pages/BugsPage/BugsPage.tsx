import { useEffect } from "react";
import useBugs from "../../hooks/useBugs/useBugs";
import { useAppDispatch } from "../../store";
import { loadBugsActionCreator } from "../../store/bugs/bugsSlice";
import "./BugsPage.scss";
import BugsTable from "../../components/BugsTable/BugsTable";

const BugsPage = (): React.ReactElement => {
  const { getBugs } = useBugs();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const bugs = await getBugs();

      dispatch(loadBugsActionCreator(bugs));
    })();
  }, [getBugs, dispatch]);

  return (
    <>
      <h1 className="bugs-page-title">Debug Directory</h1>
      <BugsTable />
    </>
  );
};

export default BugsPage;
