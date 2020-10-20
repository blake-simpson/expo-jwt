export const urlEncodeBase64 = (signature: string): string => {
  signature = signature.replace(/(=+)$/g, '');
  signature = signature.replace(/\//g, '_');
  signature = signature.replace(/\+/g, '-');

  return signature;
};
