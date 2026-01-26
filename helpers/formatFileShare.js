import formateDate from './formatDate.js';
import prettyBytes from 'pretty-bytes';

export default function formatFileShare(shareObject, url) {
  return {
    ...shareObject,
    validUntil: formateDate(shareObject.validUntil),
    file: {
      ...shareObject.file,
      fileSize: prettyBytes(shareObject.file.fileSize),
      uploadDate: formateDate(shareObject.file.uploadDate),
    },
    user: { ...shareObject.user, fullName: `${shareObject.user.firstName} ${shareObject.user.lastName}` },
    status: shareObject.validUntil > shareObject.file.uploadDate,
    url,
  };
}
