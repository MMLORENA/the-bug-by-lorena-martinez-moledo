import { useState } from "react";
import { BugData } from "../../types";
import Button from "../Button/Button";
import "./BugForm.scss";

interface BugFormProps {
  onSubmit: (bugData: BugData) => Promise<void>;
}

const BugForm = ({ onSubmit }: BugFormProps): React.ReactElement => {
  const initialBugDataState: BugData = {
    category: "",
    description: "",
    name: "",
    picture: "",
  };

  const [bugData, setBugData] = useState<BugData>(initialBugDataState);

  const handleChangeForm = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setBugData((bugData) => ({
      ...bugData,
      [event.target.id]: event.target.value,
    }));
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit(bugData);
  };

  const isFormValid =
    bugData.name !== initialBugDataState.name &&
    bugData.picture !== initialBugDataState.picture &&
    bugData.description !== initialBugDataState.description &&
    bugData.category !== initialBugDataState.category;

  return (
    <form
      className="form"
      noValidate
      aria-label="form"
      onSubmit={handleOnSubmit}
    >
      <div className="form-group">
        <label className="form-group__heading" htmlFor="name">
          Name
        </label>
        <input
          className="form-group__box"
          placeholder="Enter bug name"
          id="name"
          value={bugData.name}
          onChange={handleChangeForm}
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
          value={bugData.picture}
          onChange={handleChangeForm}
        />
      </div>
      <div className="form-group">
        <label className="form-group__heading" htmlFor="category">
          Category
        </label>
        <select
          name="category"
          id="category"
          className="form-group__box"
          onChange={handleChangeForm}
        >
          <option>--Enter a category --</option>
          <option>Logical Bugs</option>
          <option>Syntax Errors</option>
          <option>UI/UX Problems</option>
          <option>Performance Issues</option>
          <option>Security Vulnerabilities</option>
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
          value={bugData.description}
          onChange={handleChangeForm}
        />
      </div>
      <Button type="submit" className="form__button" disabled={!isFormValid}>
        Create
      </Button>
    </form>
  );
};

export default BugForm;
