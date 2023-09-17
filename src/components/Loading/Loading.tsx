import "./Loading.scss";

const Loading = (): React.ReactElement => {
  return (
    <div className="loading">
      <span className="loader" aria-label="Loading... Please wait"></span>
    </div>
  );
};

export default Loading;
