import React from "react";

// components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

const UserAvatar = ({ url }: { url: string }) => {
  return (
    <Avatar>
      <AvatarImage src={url} alt="user-name" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
