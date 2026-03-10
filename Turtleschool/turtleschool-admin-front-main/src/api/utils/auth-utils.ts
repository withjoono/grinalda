export const isTokenExpired = (expiry: number | null): boolean => {
  if (!expiry) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return expiry < currentTime;
};
