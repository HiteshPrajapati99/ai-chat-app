export class Storage {
  static set(key: string, value: string) {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    window.localStorage.setItem(key, value);
  }

  static get(key: string) {
    if (typeof window === "undefined" || !("localStorage" in window))
      return null;
    return window.localStorage.getItem(key);
  }
  static remove(key: string) {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    window.localStorage.removeItem(key);
  }
}
