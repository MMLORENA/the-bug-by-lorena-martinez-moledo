import Button from "../Button/Button";
import "./BugForm.scss";

const BugForm = (): React.ReactElement => {
  return (
    <form className="form" noValidate aria-label="form">
      <div className="form-group">
        <label className="form-group__heading" htmlFor="name">
          Name
        </label>
        <input
          className="form-group__box"
          placeholder="Enter bug name"
          id="name"
        />
      </div>
      <div className="form-group">
        <label className="form-group__heading" htmlFor="picture">
          Picture
        </label>
        <input
          className="form-group__box"
          placeholder="Enter bug picture url"
          id="picture"
        />
      </div>
      <div className="form-group">
        <label className="form-group__heading" htmlFor="category">
          Category
        </label>
        <select name="category" id="category" className="form-group__box">
          <option>--Enter a category --</option>
          <option value="Logical Bugs">Logical Bugs</option>
          <option value="Syntax Errors">Syntax Errors</option>
          <option value="UI/UX Problems">UI/UX Problems</option>
          <option value="Performance Issues">Performance Issues</option>
          <option value="Security Vulnerabilities">
            Security Vulnerabilities
          </option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-group__heading" htmlFor="description">
          Description
        </label>
        <textarea
          className="form-group__box form-group__box--long-text"
          placeholder="Enter a short bug description"
          id="description"
        />
      </div>
      <Button type="submit" className="form__button" disabled>
        Create
      </Button>
    </form>
  );
};

export default BugForm;
