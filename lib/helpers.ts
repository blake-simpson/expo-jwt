export const urlEncodeBase64 = (signature: string): string => {
  signature = signature.replace(/(=+)$/g, '');
  signature = signature.replace(/\//g, '_');
  signature = signature.replace(/\+/g, '-');

  return signature;
};

export const urlSafeBase64ToBase64 = (signature) => {
  if (isUrlSafeBase64(signature)) {
    return signature.replace(/-/g, '+').replace(/_/g, '/');
  }

  return signature;
};

export const isUrlSafeBase64 = (content: string) =>
  /^[A-Za-z0-9_-]*[.=]{0,2}$/.test(content);
