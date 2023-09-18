import feedbackMessages from "../../constants/feedbackMessages/feedbackMessages";
import useBugs from "../../hooks/useBugs/useBugs";
import { useAppDispatch } from "../../store";
import { deleteBugActionCreator } from "../../store/bugs/bugsSlice";
import { Bug } from "../../types";
import showFeedback from "../../utils/showFeedback";
import Button from "../Button/Button";
import "./BugRow.scss";

interface BugRowProps {
  bug: Bug;
}

const BugRow = ({
  bug: { id, name, picture, category },
}: BugRowProps): React.ReactElement => {
  const { deleteBug } = useBugs();
  const dispatch = useAppDispatch();

  const handleDelete = async (idBugToDelete: string) => {
    try {
      await deleteBug(idBugToDelete);
      showFeedback(feedbackMessages.deleteBug.success, "success");

      dispatch(deleteBugActionCreator(idBugToDelete));
    } catch {
      showFeedback(feedbackMessages.deleteBug.error, "error");
    }
  };

  return (
    <tr className="bug" key={id}>
      <td>
        <img src={picture} alt={`${name} avatar`} className="bug__image" />
      </td>
      <td className="bug__name">{name}</td>
      <td className="bug__category">{category}</td>
      <td className="bug__actions">
        <Button>Modify</Button>
        <Button onClick={() => handleDelete(id)}>Delete</Button>
      </td>
    </tr>
  );
};
export default BugRow;
