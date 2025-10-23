import { Prisma } from "../../prisma-db";
import { db } from "../../services/prisma-service";

class UserServices {
  static getUser = ({ username, id }: { username?: string; id?: number }) => {
    if (id) return db.user.findFirst({ where: { id } });

    return db.user.findFirst({ where: { username } });
  };

  static getAllUsers = async (id?: number | undefined) => {
    const data = await db.user.findMany({
      where: {
        AND: [{ NOT: { id: id } }],
        OR: [{ NOT: { username: "ai" } }],
      },
    });

    return data || [];
  };

  static create = async (user: Prisma.UserCreateInput) => {
    return await db.user.create({ data: user });
  };
}

export default UserServices;
