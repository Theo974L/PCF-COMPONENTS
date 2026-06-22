export const computeDelta = (
  prev: Date | null,
  actual: Date | null
): number | null => {

  if (!prev || !actual) return null;

  const diff = actual.getTime() - prev.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};