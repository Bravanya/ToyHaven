function getStoredList(key) {
  try {
    var data = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(data)) {
      return data;
    }
  } catch (error) {
    return [];
  }
  return [];
}

function setStoredList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}
