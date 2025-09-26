import Spinner from "./Spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
      <Spinner size="sm" />
    </div>
  );
};

export default Loader;
