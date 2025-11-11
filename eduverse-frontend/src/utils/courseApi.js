// Dev stub for fetching course-related data. Replace with real backend calls.

export async function fetchCourseDetails(courseId) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  // Sample data
  const course = {
    id: courseId,
    title: 'Distributed Database Systems [CSL7750] - Fall 2025',
    bannerSeed: 42,
    teacher: 'Romi Banerjee',
    term: 'Fall 2025',
    color: '#0ea5a4',
  };

  const announcements = [
    { id: 'a1', author: 'Romi Banerjee', text: 'Quiz_3 posted', time: '4:03 PM' },
    { id: 'a2', author: 'Romi Banerjee', text: 'Classroom Problem Discussion Slides uploaded', time: '3:40 PM' },
    { id: 'a3', author: 'Romi Banerjee', text: 'Major Exam: 25th November, 6 - 9PM', time: '3:39 PM' },
  ];

  const assignments = [
    { id: 'q1', title: 'Quiz_3', due: 'Today 4:25 PM', status: 'Due' },
    { id: 'hw1', title: 'Homework 2', due: 'Nov 20', status: 'Open' },
  ];

  const files = [
    { id: 'f1', name: 'ProblemSet1.pdf', size: '120KB' },
    { id: 'f2', name: 'LectureSlides_Week3.pptx', size: '2.4MB' },
  ];

  return { course, announcements, assignments, files };
}
