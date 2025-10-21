import { PrismaClient } from "../prisma/generated/prisma";

class PrismaService {
  client = new PrismaClient();

  public async initialize() {
    try {
      await this.client.$connect();
      console.log("DB connected successfully");
    } catch (error) {
      await this.client.$disconnect();
      console.log("DB disconnected with error", error);
    }
  }
}

export const databaseService = new PrismaService();

export const db = databaseService.client;
