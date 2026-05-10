import { request } from "../utils/api";

export const parseResume = (token, file) => {
  const formData = new FormData();
  formData.append("resume", file);

  return request("/resume/parse", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const structureResume = (token, resumeText) => {
  return request("/resume/structure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resumeText }),
  });
};