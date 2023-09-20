import Navigation from "../Navigation/Navigation";
import "./Header.scss";

const Header = (): React.ReactElement => {
  return (
    <header className="main-header">
      <div className="title-container">
        <span className="main-header__title">The Bug</span>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
