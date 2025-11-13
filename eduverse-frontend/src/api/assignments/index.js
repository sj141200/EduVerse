import { apiFetch } from '../_utils';

export async function getAssignments(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/assignments`, { method: 'GET', token: t });
}

export async function createAssignment(courseId, assignment, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/assignments`, { method: 'POST', body: assignment, token: t });
}

export async function gradeAssignment(courseId, assignmentId, grading, token) {
  // grading route not explicitly implemented in backend; we can PATCH via updating Assignment directly
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/assignments/${assignmentId}`, { method: 'PUT', body: { grading }, token: t });
}

export async function updateAssignment(courseId, assignmentId, assignmentPayload, token) {
  const t = token || undefined
  return apiFetch(`/courses/${courseId}/assignments/${assignmentId}`, { method: 'PUT', body: assignmentPayload, token: t })
}

export async function submitAssignment(courseId, assignmentId, submission, token) {
  const t = token || undefined;
  // submission can include file; submission may be FormData
  return apiFetch(`/courses/${courseId}/assignments/${assignmentId}/submit`, { method: 'POST', body: submission, token: t });
}

export async function getSubmissions(courseId, assignmentId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/assignments/${assignmentId}/submissions`, { method: 'GET', token: t });
}

export async function gradeSubmission(courseId, assignmentId, submissionId, payload, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`, { method: 'PUT', body: payload, token: t });
}
