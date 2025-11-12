import { apiFetch } from '../_utils';

export async function getAnnouncements(courseId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/announcements`, { method: 'GET', token: t });
}

export async function createAnnouncement(courseId, announcement, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/announcements`, { method: 'POST', body: announcement, token: t });
}

export async function deleteAnnouncement(courseId, announcementId, token) {
  const t = token || undefined;
  return apiFetch(`/courses/${courseId}/announcements/${announcementId}`, { method: 'DELETE', token: t });
}
