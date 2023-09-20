import { NavLink } from "react-router-dom";
import routerPaths from "../../constants/routerPaths/routerPaths";

const Navigation = (): React.ReactElement => {
  return (
    <nav className="navigation">
      <ul className="navigation__links">
        <li>
          <NavLink to={routerPaths.home}>Home</NavLink>
        </li>
        <li>
          <NavLink to={routerPaths.create}>Create</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
