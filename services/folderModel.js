import { prisma } from '../lib/prisma.js';

async function createFolder(folderName, userId) {
  await prisma.folder.create({
    data: {
      folderName,
      user: {
        connect: {
          id: userId,
        },
      },
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

async function findFolderContent(userId, folderUrlId) {
  const folder = await prisma.folder.findUnique({
    where: {
      urlId: folderUrlId,
      userId,
    },
    include: {
      files: true,
    },
  });
  return folder;
}

async function updateFolder(folderId, filesToAdd, filesToRemove) {
  await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      files: {
        connect: filesToAdd,
        disconnect: filesToRemove,
      },
    },
  });
}

export default { createFolder, findAllFolders, findFolderContent, updateFolder };
