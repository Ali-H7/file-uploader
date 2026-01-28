import { prisma } from '../lib/prisma.js';

async function createFolderShare(userId, folderId, date) {
  const share = await prisma.folderShares.create({
    data: {
      validUntil: date,
      user: {
        connect: {
          id: userId,
        },
      },
      folder: {
        connect: {
          id: folderId,
        },
      },
    },
  });
  return share.id;
}

async function findUserShares(userId) {
  const shares = await prisma.folderShares.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      validUntil: true,
      folder: { select: { folderName: true } },
    },
  });
  return shares;
}

export default { createFolderShare, findUserShares };
