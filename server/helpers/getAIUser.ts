import { db } from "../services/prisma-service";

export const getAIUser = async () => {

    // check already exist
  const aiUser = await db.user.findFirst({
    where: {
      username: "ai",
    },
  });

  if(aiUser) return aiUser;

  // create new user
  const newUser = await db.user.create({
    data: {
      username: "ai",
    },
  });

  return newUser;
}