import { prisma } from '../lib/prisma.js';

async function addFiles(filesArray, userId) {
  const files = filesArray.map((fileObject) => {
    return {
      cloudinaryId: fileObject.filename,
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

async function deleteFile(fileId, userId) {
  const file = await prisma.file.delete({
    where: {
      id: fileId,
      userId,
    },
    select: {
      cloudinaryId: true,
    },
  });
  return file.cloudinaryId;
}

export default { addFiles, findAllFiles, deleteFile };
