import { useEffect } from "react";
import useBugs from "../../hooks/useBugs/useBugs";
import { useAppDispatch } from "../../store";
import { loadBugsActionCreator } from "../../store/bugs/bugsSlice";
import BugsTable from "../../components/BugsTable/BugsTable";
import showFeedback from "../../utils/showFeedback";
import feedbackMessages from "../../constants/feedbackMessages/feedbackMessages";

const BugsPage = (): React.ReactElement => {
  const { getBugs } = useBugs();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const bugs = await getBugs();

        dispatch(loadBugsActionCreator(bugs));
      } catch {
        showFeedback(feedbackMessages.errorLoadBugs, "error");
      }
    })();
  }, [getBugs, dispatch]);

  return (
    <>
      <h1 className="page-title">Debug Directory</h1>
      <BugsTable />
    </>
  );
};

export default BugsPage;
