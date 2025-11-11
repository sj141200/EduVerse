import { sleep, makeId, safeParse } from '../_utils';
import { fetchCourseDetails as _fetchCourseDetails } from '../../utils/courseApi';

export async function getEnrolledCourses(token) {
  await sleep(200);
  try {
    const raw = localStorage.getItem('eduverse_enrolled');
    const arr = raw ? JSON.parse(raw) : null;
    if (arr && Array.isArray(arr)) return arr;
  } catch (e) {}
  // default demo courses
  return [
    { id: 'c101', title: 'Intro to Databases', teacher: 'Romi Banerjee', term: 'Fall 2025' },
    { id: 'c102', title: 'Algorithms 1', teacher: 'A. Smith', term: 'Fall 2025' },
  ];
}

export async function fetchCourseDetails(courseId) {
  // reuse existing utils stub (keeps one source of truth for sample course data)
  return _fetchCourseDetails(courseId);
}

export async function createCourse(token, courseData) {
  await sleep(200);
  const id = makeId('c_');
  const created = { id, ...courseData };
  // optional: append to enrolled
  try {
    const raw = localStorage.getItem('eduverse_enrolled');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(created);
    localStorage.setItem('eduverse_enrolled', JSON.stringify(arr));
  } catch (e) {}
  return created;
}

export async function updateCourse(token, courseId, updates) {
  await sleep(120);
  // in-dev: store updates in localStorage meta
  try {
    const key = `eduverse_course_${courseId}_meta`;
    const raw = localStorage.getItem(key);
    const meta = raw ? JSON.parse(raw) : {};
    const merged = { ...meta, ...updates };
    localStorage.setItem(key, JSON.stringify(merged));
    return merged;
  } catch (e) { throw new Error('Failed to update course'); }
}

export async function generateJoinCode(courseId) {
  await sleep(80);
  const code = makeId('join_').slice(-8);
  try {
    const key = `eduverse_course_${courseId}_meta`;
    const raw = localStorage.getItem(key);
    const meta = raw ? JSON.parse(raw) : {};
    meta.joinCode = code;
    localStorage.setItem(key, JSON.stringify(meta));
  } catch (e) {}
  return code;
}

export async function joinCourseByCode(code) {
  await sleep(120);
  // naive: find any meta with matching joinCode in localStorage (dev-only)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('eduverse_course_') && k.endsWith('_meta')) {
        const meta = JSON.parse(localStorage.getItem(k) || '{}');
        if (meta.joinCode === code) {
          const courseId = k.replace('eduverse_course_', '').replace('_meta', '');
          return { success: true, courseId };
        }
      }
    }
  } catch (e) {}
  return { success: false, error: 'Invalid join code' };
}
