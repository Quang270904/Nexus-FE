import { Avatar, Button, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostCard from "../../components/Post/PostCard";
import UserReelCard from "../../components/Reels/UserReelCard";
import ProfileModal from "./ProfileModal";

const tabs = [
  { value: "post", name: "Post" },
  { value: "reels", name: "Reels" },
  { value: "saved", name: "Saved" },
  { value: "repost", name: "repost" },
];
const posts = [1, 1, 1, 1];
const reels = [1, 1, 1, 1];
const savedPost = [1, 1, 1, 1];
const Profile = () => {
  const { auth } = useSelector((store) => store);
  const [open, setOpen] = React.useState(false);
  const handleOpenProfileModal = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { id } = useParams();
  return (
    <Card className="my-10 w-[70%]">
      <div className="h-[15rem]">
        <img
          className="h-full w-full"
          src="https://cdn.pixabay.com/photo/2014/01/13/20/01/pebbles-243910_640.jpg"
          alt=""
        />
      </div>
      <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
        <Avatar
          className="transform -translate-y-24"
          sx={{ width: "10rem", height: "10rem" }}
          src="https://cdn.pixabay.com/photo/2023/10/18/22/47/eagle-8325205_1280.png"
        />
        {true ? (
          <Button
            onClick={handleOpenProfileModal}
            sx={{ borderRadius: "20px" }}
            variant="outlined"
          >
            Edit Profile
          </Button>
        ) : (
          <Button sx={{ borderRadius: "20px" }} variant="outlined">
            Follow
          </Button>
        )}
      </div>
      <div className="p-5">
        <div>
          <h1 className="py-1 font-bold text-xl">
            {" "}
            {auth.user?.firstName + " " + auth.user?.lastName}
          </h1>
          <p>
            {" "}
            @
            {auth.user?.firstName.toLowerCase() +
              "_" +
              auth.user?.lastName.toLowerCase()}
          </p>
        </div>
        <div className="flex gap-3 items-center py-3">
          <span>41 post</span>
          <span>35 followers</span>
          <span>35 followings</span>
        </div>
        <div>
          <p>
            Thái Thuận is a Vietnamese restauraocated in the heart of downtown
            Seattle.{" "}
          </p>
        </div>
      </div>
      <section>
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            {tabs.map((item, index) => (
              <Tab key={index} value={item.value} label={item.name} />
            ))}
          </Tabs>
        </Box>
        <div className="flex justify-center">
          {value === "post" ? (
            <div className="space-y-5 w-[70%] my-10">
              {posts.map((item) => (
                <div className="border border-slate-100 rounded-md">
                  <PostCard />
                </div>
              ))}
            </div>
          ) : value === "reels" ? (
            <div className="flex justify-center flex-wrap gap-2 my-10">
              {reels.map((item) => (
                <div>
                  <UserReelCard />
                </div>
              ))}
            </div>
          ) : value === "saved" ? (
            <div className="space-y-5 w-[70%] my-10">
              {savedPost.map((item) => (
                <div className="border border-slate-100 rounded-md">
                  <PostCard />
                </div>
              ))}
            </div>
          ) : (
            <div>Repost</div>
          )}
        </div>
      </section>
      <div>
        <section>
          <ProfileModal open={open} handleClose={handleClose} />
        </section>
      </div>
    </Card>
  );
};

export default Profile;
