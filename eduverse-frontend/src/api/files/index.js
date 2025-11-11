import { sleep, makeId } from '../_utils';

export async function getFiles(courseId) {
  await sleep(120);
  try {
    const raw = localStorage.getItem(`eduverse_course_${courseId}_files`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export async function uploadFile(courseId, fileMeta) {
  // fileMeta: { name, size, url? }
  await sleep(200);
  try {
    const key = `eduverse_course_${courseId}_files`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const created = { id: makeId('f_'), ...fileMeta, uploadedAt: new Date().toISOString() };
    arr.unshift(created);
    localStorage.setItem(key, JSON.stringify(arr));
    return created;
  } catch (e) { throw new Error('Failed to upload file'); }
}

export async function deleteFile(courseId, fileId) {
  await sleep(80);
  try {
    const key = `eduverse_course_${courseId}_files`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter(f => f.id !== fileId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return { success: true };
  } catch (e) { throw new Error('Failed to delete file'); }
}
