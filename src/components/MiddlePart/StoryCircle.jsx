import { Avatar } from "@mui/material";
import React from "react";

const StoryCircle = () => {
  return (
    <div>
      <div className="flex flex-col items-center mr-4 cursor-pointer">
        <Avatar
          sx={{ width: "5rem", height: "5rem" }}
          src="https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
        >
        </Avatar>
        <p>QR...</p>
      </div>
    </div>
  );
};

export default StoryCircle;
