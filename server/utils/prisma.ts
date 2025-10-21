export const includeUsersExpectCurr = (id: number) => {
  return {
    users: {
      where: {
        user_id: {
          not: { equals: id },
        },
      },
      select: {
        user: { select: { name: true, id: true, profile_pic: true } },
      },
    },
  };
};

export const lastMessageSelect = () => {
  return {
    last_message: {
      select: { content: true, id: true, created_at: true },
    },
  };
};
