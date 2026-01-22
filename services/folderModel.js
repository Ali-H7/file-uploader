import { prisma } from '../lib/prisma.js';

async function createFolder(folderName, userId) {
  await prisma.folder.create({
    data: {
      folderName,
      userId,
    },
  });
}

async function findAllFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: {
      userId,
    },
  });
  return folders;
}

export default { createFolder, findAllFolders };
