import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="dark:bg-neutral-900/20 w-full border dark:border-neutral-500/20 rounded-md">
      <div className="px-4">{children}</div>
    </div>
  );
};

export default Wrapper;
