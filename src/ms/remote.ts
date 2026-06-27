const remoteHost = 'http://134.115.48.123';
const proxyPrefix = '/remote';

export function toFetchable(url: string): string {
  if (import.meta.env.DEV && url.startsWith(remoteHost)) {
    return proxyPrefix + url.slice(remoteHost.length);
  }
  return url;
}
