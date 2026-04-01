// API plan

/* 
Auth
    POST /signup
    POST /signin
    GET /users/me

Profile
    GET /profile/me
    POST /profile
    PATCH /profile

Applications
    POST /jobs/parse
    POST /applications/generate
    POST /applications
    GET /applications
    GET /applications/:id
    PATCH /applications/:id
    DELETE /applications/:id

*/

const BASE_URL = "http://localhost:3001/api";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return Promise.reject(data.message || "Request failed");
  }

  return data;
};

export const request = (endpoint, options = {}) => {
  return fetch(`${BASE_URL}${endpoint}`, options).then(handleResponse);
};