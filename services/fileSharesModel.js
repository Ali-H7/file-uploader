import { prisma } from '../lib/prisma.js';

async function createFileShare(userId, fileId, date) {
  await prisma.fileShares.create({
    data: {
      validUntil: date,
      user: {
        connect: {
          id: userId,
        },
      },
      file: {
        connect: {
          id: fileId,
        },
      },
    },
  });
}
export default { createFileShare };
