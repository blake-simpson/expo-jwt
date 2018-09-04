export const urlEncodeBase64 = signature => {
  signature = signature.replace(/(=+)$/g, '');
  signature = signature.replace(/\//g, '_');
  signature = signature.replace(/\+/g, '-');

  return signature;
};
