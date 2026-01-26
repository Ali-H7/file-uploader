import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import prettyBytes from 'pretty-bytes';
dayjs.extend(relativeTime);

export default function formatMyShares(shares) {
  const currentDate = new Date();
  const formattedShares = shares.map((share) => {
    const status = share.validUntil > currentDate ? dayjs().to(dayjs(share.validUntil)) : false;
    return { ...share, file: { ...share.file, fileSize: prettyBytes(share.file.fileSize) }, status };
  });
  return formattedShares;
}
