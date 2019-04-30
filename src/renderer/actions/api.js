const endpoint = '';

export function safeFetch(route) {
  return fetch(`${endpoint}${route}`)
    .then((resp) => {
      return resp.json();
    });
}

const api = {
};

export default api;
