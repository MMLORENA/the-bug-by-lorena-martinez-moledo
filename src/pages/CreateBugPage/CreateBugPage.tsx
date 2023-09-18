import { useNavigate } from "react-router-dom";
import BugForm from "../../components/BugForm/BugForm";
import feedbackMessages from "../../constants/feedbackMessages/feedbackMessages";
import useBugs from "../../hooks/useBugs/useBugs";
import { useAppDispatch } from "../../store";
import { createBugActionCreator } from "../../store/bugs/bugsSlice";
import { BugData } from "../../types";
import showFeedback from "../../utils/showFeedback";
import routerPaths from "../../constants/routerPaths/routerPaths";

const CreateBugPage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { createBug } = useBugs();

  const handleOnSubmit = async (bugData: BugData) => {
    try {
      const newBug = await createBug(bugData);

      dispatch(createBugActionCreator(newBug));
      showFeedback(feedbackMessages.createBug.success, "success");

      navigate(routerPaths.root);
    } catch {
      showFeedback(feedbackMessages.createBug.error, "error");
    }
  };

  return (
    <>
      <h1 className="page-title">Create a new bug</h1>
      <BugForm onSubmit={handleOnSubmit} />
    </>
  );
};

export default CreateBugPage;
