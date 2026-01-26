export default function createDateObject(duration) {
  switch (duration) {
    case 'day':
      return new Date(Date.now() + 1000 * 60 * 60 * 24);
    case 'week':
      return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    case 'month':
      return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    default:
      throw new Error('Invalid duration');
  }
}
