import { sleep, makeId, safeParse } from '../_utils';

export async function getAnnouncements(courseId) {
  await sleep(120);
  try {
    const raw = localStorage.getItem(`eduverse_course_${courseId}_announcements`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export async function createAnnouncement(courseId, announcement) {
  await sleep(100);
  try {
    const key = `eduverse_course_${courseId}_announcements`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const created = { id: makeId('ann_'), time: new Date().toISOString(), ...announcement };
    arr.unshift(created);
    localStorage.setItem(key, JSON.stringify(arr));
    return created;
  } catch (e) { throw new Error('Failed to create announcement'); }
}

export async function deleteAnnouncement(courseId, announcementId) {
  await sleep(80);
  try {
    const key = `eduverse_course_${courseId}_announcements`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter(a => a.id !== announcementId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return { success: true };
  } catch (e) { throw new Error('Failed to delete'); }
}
