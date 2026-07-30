export function getStorageItem(key: string) {
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string) {
  window.localStorage.removeItem(key);
}

