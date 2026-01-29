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

async function findFolderShare(shareId) {
  const share = await prisma.folderShares.findUnique({
    where: {
      id: shareId,
    },
    select: {
      id: true,
      folderId: true,
      validUntil: true,
      folder: {
        select: { folderName: true, files: { select: { fileName: true, fileSize: true, uploadDate: true } } },
      },
      user: { select: { firstName: true, lastName: true } },
    },
  });
  return share;
}

export default { createFolderShare, findUserShares, findFolderShare };
