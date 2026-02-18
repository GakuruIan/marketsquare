import React from "react";

interface accessMessageprops {
  message: string;
}
const AccessMessage: React.FC<accessMessageprops> = ({ message }) => {
  return (
    <div className="text-muted-foreground text-center text-sm text-balance mt-8">
      <p className="text-xs">{message}</p>
    </div>
  );
};

export default AccessMessage;
