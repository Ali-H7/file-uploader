import prettyBytes from 'pretty-bytes';
import formateDate from './formatDate.js';

export default function formatFiles(files) {
  return files.map((file) => {
    return {
      ...file,
      fileSize: prettyBytes(file.fileSize),
      uploadDate: formateDate(file.uploadDate),
      shared: file.fileShares.length > 0,
    };
  });
}
