import prettyBytes from 'pretty-bytes';

export default function formatFiles(files) {
  return files.map((file) => {
    return {
      ...file,
      fileSize: prettyBytes(file.fileSize),
      uploadDate: file.uploadDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  });
}
