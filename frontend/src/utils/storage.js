function readStore(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return value;
  } catch (err) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    return;
  }
}

export { readStore, writeStore };
