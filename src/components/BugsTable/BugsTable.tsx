import { useAppSelector } from "../../store";
import BugRow from "../BugRow/BugRow";
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
          <BugRow key={bug.id} bug={bug} />
        ))}
      </tbody>
    </table>
  );
};

export default BugsTable;
