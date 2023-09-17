import { Bug } from "../../types";
import Button from "../Button/Button";
import "./BugRow.scss";

interface BugRowProps {
  bug: Bug;
}

const BugRow = ({
  bug: { id, name, picture, category },
}: BugRowProps): React.ReactElement => {
  return (
    <tr className="bug" key={id}>
      <td>
        <img src={picture} alt={`${name} avatar`} className="bug__image" />
      </td>
      <td className="bug__name">{name}</td>
      <td className="bug__category">{category}</td>
      <td className="bug__actions">
        <Button>Modify</Button>
        <Button>Delete</Button>
      </td>
    </tr>
  );
};
export default BugRow;
