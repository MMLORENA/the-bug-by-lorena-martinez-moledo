import { useAppSelector } from "../../store";
import Button from "../Button/Button";
import "./BugsTable.scss";

const BugsTable = (): React.ReactElement => {
  const { bugs } = useAppSelector((bugsState) => bugsState.bugsStore);

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="table__heading">Picture</th>
          <th className="table__heading">Name</th>
          <th className="table__heading">Category</th>
          <th className="table__heading">Actions</th>
        </tr>
      </thead>
      <tbody>
        {bugs.map((bug) => (
          <tr className="bug" key={bug.id}>
            <td>
              <img
                src={bug.picture}
                alt={`${bug.name} avatar`}
                className="bug__image"
              />
            </td>
            <td className="bug__name">{bug.name}</td>
            <td className="bug__category">{bug.category}</td>
            <td className="bug__actions">
              <Button>Modify</Button>
              <Button>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BugsTable;
