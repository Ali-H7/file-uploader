import { prisma } from '../lib/prisma.js';

async function createFileShare(userId, fileId, date) {
  try {
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
      include: {
        file: {
          select: {
            cloudinaryId: true,
          },
        },
      },
    });
    return share.file.cloudinaryId;
  } catch (error) {
    console.log(error);
    if (error.code === 'P2002')
      throw new Error(`You're already sharing this file. Please delete it from your shares before attempting again.`);
    else throw error;
  }
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
        select: { fileName: true, cloudinaryId: true },
      },
    },
  });
  return shares;
}

async function findFileShare(cloudinaryId) {
  const share = await prisma.fileShares.findFirst({
    where: {
      file: { cloudinaryId },
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
