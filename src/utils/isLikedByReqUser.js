export const isLikedByReqUser = (reqUserId, post) => {
  for (let user of post.likes) {
    if (reqUserId === user.id) {
      return true;
    }
  }
  return false;
};
