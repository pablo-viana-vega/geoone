import { json } from "@remix-run/node";
import { RegisterForm } from "./types.server";
import { PrismaClient } from "@prisma/client";

export const register = async (form: RegisterForm) => {
  const exists = await prisma.user.count({ where: { email: form.email } });

  if (exists) {
    return json({ error: `Usuário já registrado` }, { status: 400 });
  }
};

let prisma: PrismaClient;
declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prisma = global.__db;
}

export { prisma };
