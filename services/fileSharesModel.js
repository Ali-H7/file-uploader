import { prisma } from '../lib/prisma.js';

async function createFileShare(userId, fileId, date) {
  const share = await prisma.fileShares.create({
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
  return share.id;
}

async function findUserShares(userId) {
  const shares = await prisma.fileShares.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      validUntil: true,
      file: {
        select: { fileName: true },
      },
    },
  });
  return shares;
}

async function findFileShare(shareId) {
  const share = await prisma.fileShares.findUnique({
    where: {
      id: shareId,
    },
    select: {
      validUntil: true,
      file: { select: { fileName: true, fileSize: true, uploadDate: true, filePath: true } },
      user: { select: { firstName: true, lastName: true } },
    },
  });
  return share;
}
export default { createFileShare, findUserShares, findFileShare };
