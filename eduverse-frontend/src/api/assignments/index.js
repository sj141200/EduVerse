import { sleep, makeId } from '../_utils';

export async function getAssignments(courseId) {
  await sleep(120);
  try {
    const raw = localStorage.getItem(`eduverse_course_${courseId}_assignments`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export async function createAssignment(courseId, assignment) {
  await sleep(150);
  try {
    const key = `eduverse_course_${courseId}_assignments`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const created = { id: makeId('as_'), createdAt: new Date().toISOString(), ...assignment };
    arr.unshift(created);
    localStorage.setItem(key, JSON.stringify(arr));
    return created;
  } catch (e) { throw new Error('Failed to create assignment'); }
}

export async function gradeAssignment(courseId, assignmentId, grading) {
  await sleep(120);
  try {
    const key = `eduverse_course_${courseId}_assignments`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex(a => a.id === assignmentId);
    if (idx === -1) throw new Error('Assignment not found');
    const updated = { ...arr[idx], grading: { ...(arr[idx].grading || {}), ...grading }, gradedAt: new Date().toISOString() };
    arr[idx] = updated;
    localStorage.setItem(key, JSON.stringify(arr));
    return updated;
  } catch (e) { throw new Error('Failed to grade assignment'); }
}

export async function submitAssignment(courseId, assignmentId, submission) {
  await sleep(120);
  // naive per-assignment submissions array stored in meta
  try {
    const key = `eduverse_course_${courseId}_assignment_${assignmentId}_submissions`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const created = { id: makeId('sub_'), submittedAt: new Date().toISOString(), ...submission };
    arr.unshift(created);
    localStorage.setItem(key, JSON.stringify(arr));
    return created;
  } catch (e) { throw new Error('Failed to submit'); }
}

export async function getSubmissions(courseId, assignmentId) {
  await sleep(120);
  try {
    const key = `eduverse_course_${courseId}_assignment_${assignmentId}_submissions`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
