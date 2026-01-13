import CryptoJS from 'crypto-js';

export const getGravatarUrl = (email, size = 200) => {
  if (!email) return null;
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};
