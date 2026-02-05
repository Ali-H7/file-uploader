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
      folder: { select: { folderName: true, urlId: true } },
    },
  });
  return shares;
}

async function findFolderShare(urlId) {
  const share = await prisma.folderShares.findFirst({
    where: {
      folder: { urlId },
    },
    select: {
      id: true,
      folderId: true,
      validUntil: true,
      folder: {
        select: {
          folderName: true,
          files: { select: { fileName: true, fileSize: true, uploadDate: true, filePath: true } },
        },
      },
      user: { select: { firstName: true, lastName: true } },
    },
  });
  return share;
}

async function deleteFolderShare(userId, shareId) {
  await prisma.folderShares.delete({
    where: {
      id: shareId,
      userId,
    },
  });
}

export default { createFolderShare, findUserShares, findFolderShare, deleteFolderShare };
