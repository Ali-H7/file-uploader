import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

export default function formatMyShares(fileShares, folderShares) {
  const currentDate = new Date();
  const shares = [...fileShares, ...folderShares];
  const formattedShares = shares.map((share) => {
    const status = share.validUntil > currentDate ? dayjs().to(dayjs(share.validUntil)) : false;
    if (share.folder) return { ...share, type: 'folder', status };
    else return { ...share, type: 'file', status };
  });

  return formattedShares;
}
