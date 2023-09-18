import BugForm from "../../components/BugForm/BugForm";

const CreateBugPage = (): React.ReactElement => {
  return (
    <>
      <h1 className="page-title">Create a new bug</h1>
      <BugForm />
    </>
  );
};

export default CreateBugPage;
