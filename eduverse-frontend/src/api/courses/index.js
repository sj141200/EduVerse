import { apiFetch } from '../_utils';

export async function getEnrolledCourses(token) {
  const t = token || undefined;
  return apiFetch('/courses/enrolled', { method: 'GET', token: t });
}

export async function fetchCourseDetails(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}`, { method: 'GET', token: t });
}

export async function createCourse(token, courseData) {
  const t = token || undefined;
  return apiFetch('/courses', { method: 'POST', body: courseData, token: t });
}

export async function updateCourse(token, courseId, updates) {
  console.log(updates);
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}`, { method: 'PUT', body: updates, token: t });
}

export async function generateJoinCode(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/generate-join-code`, { method: 'POST', token: t });
}

export async function joinCourseByCode(code, token) {
  const t = token || undefined;
  return apiFetch('/courses/join', { method: 'POST', body: { code }, token: t });
}

export async function joinCourse(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/join`, { method: 'POST', token: t });
}
