import React from "react";

const UserReelCard = () => {
  return (
    <div className="w-[15rem] px-2">
      <video
        controls
        className="w-full h-full"
        src="https://videos.pexels.com/video-files/2098989/2098989-sd_640_360_30fps.mp4"
      />
    </div>
  );
};

export default UserReelCard;
