import { apiFetch } from '../_utils';
import axios from 'axios'
import { API_BASE } from '../_utils'

export async function getFiles(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/uploaded-files`, { method: 'GET', token: t });
}

export async function uploadFile(courseId, formData, token) {
  // formData should be a FormData instance with file field
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files`, { method: 'POST', body: formData, token: t });
}

// Upload with progress callback: onProgress receives percent (0-100)
export async function uploadFileWithProgress(courseId, file, token, onProgress) {
  const url = `${API_BASE}/courses/${courseId}/files`;
  const fd = new FormData();
  fd.append('file', file, file.name);
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const resp = await axios.post(url, fd, {
      headers,
      withCredentials: true,
      onUploadProgress: (evt) => {
        if (!evt.lengthComputable) return;
        const percent = Math.round((evt.loaded * 100) / evt.total);
        try { if (typeof onProgress === 'function') onProgress(percent); } catch (e) {}
      }
    });
    return resp.data;
  } catch (err) {
    if (err.response) {
      const d = err.response.data
      const message = (d && (d.error || d.message)) || err.response.statusText || String(err.message)
      throw new Error(message)
    }
    throw new Error(err.message || 'Upload failed')
  }
}

export async function deleteFile(courseId, fileId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files/${fileId}`, { method: 'DELETE', token: t });
}

export async function getDownloadUrl(courseId, fileId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/files/${fileId}/download`, { method: 'GET', token: t });
}
