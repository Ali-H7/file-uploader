import { prisma } from "./prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      email: "ali@gmail.com",
      firstName: "Ali",
      lastName: "Hasan",
      password: await bcrypt.hash("123456", 10),
    },
  });
  console.log("Created user:", user);

  // Fetch all users
  const allUsers = await prisma.user.findMany({});
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
