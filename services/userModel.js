import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function createUser(userObject) {
  const hashedPassword = await bcrypt.hash(userObject.password, 10);
  await prisma.user.create({
    data: {
      email: userObject.email,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      password: hashedPassword,
    },
  });
}

async function findByEmail(userEmail) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return user;
}

export default { createUser, findByEmail };
