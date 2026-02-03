import { prisma } from '../lib/prisma.js';

async function addFiles(filesArray, userId) {
  const files = filesArray.map((fileObject) => {
    return {
      fileName: fileObject.originalname,
      fileType: fileObject.mimetype,
      fileSize: fileObject.size,
      filePath: fileObject.path,
      userId,
    };
  });
  await prisma.file.createMany({
    data: files,
  });
}

async function findAllFiles(userId) {
  const files = await prisma.file.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: 'desc',
    },
    include: {
      fileShares: true,
    },
  });
  return files;
}

export default { addFiles, findAllFiles };
