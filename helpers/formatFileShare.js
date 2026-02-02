import formateDate from './formatDate.js';
import prettyBytes from 'pretty-bytes';

export default function formatFolderShare(shareObject, url) {
  const currentDate = new Date();
  let key = shareObject.folder ? 'folder' : 'file';
  let content;

  if (shareObject.folder) {
    const formattedFiles = shareObject.folder.files.map((file) => {
      console.log(file.filePath);
      return {
        ...file,
        fileSize: prettyBytes(file.fileSize),
        uploadDate: formateDate(file.uploadDate),
      };
    });
    content = { ...shareObject.folder, files: formattedFiles };
  } else {
    content = {
      ...shareObject.file,
      fileSize: prettyBytes(shareObject.file.fileSize),
      uploadDate: formateDate(shareObject.file.uploadDate),
    };
  }
  return {
    ...shareObject,
    validUntil: formateDate(shareObject.validUntil),
    [key]: content,
    user: { ...shareObject.user, fullName: `${shareObject.user.firstName} ${shareObject.user.lastName}` },
    status: shareObject.validUntil > currentDate,
    url,
  };
}
