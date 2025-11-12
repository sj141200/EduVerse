import { apiFetch } from '../_utils';

export async function getFiles(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files`, { method: 'GET', token: t });
}

export async function uploadFile(courseId, formData, token) {
  // formData should be a FormData instance with file field
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files`, { method: 'POST', body: formData, token: t });
}

export async function deleteFile(courseId, fileId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files/${fileId}`, { method: 'DELETE', token: t });
}
