// src/utils/semester.js
// Semester utility functions

export const SEMESTER_CONFIG = {
  odd:      { label: 'Odd Sem',    months: 'Jul–Nov', color: '#1A64B4', bg: '#E3F2FD', border: '#90CAF9' },
  even:     { label: 'Even Sem',   months: 'Dec–May', color: '#6450A0', bg: '#EDE7F6', border: '#CE93D8' },
  both:     { label: 'Both Sems',  months: 'Jul–May', color: '#2D6A4F', bg: '#E8F5E9', border: '#A5D6A7' },
  yearround:{ label: 'Year Round', months: 'Always',  color: '#5A5248', bg: '#F5F0E8', border: '#E2DDD4' },
};

// Detect current semester from current month
export function getCurrentSemester() {
  const month = new Date().getMonth() + 1; // 1-12
  // Odd: July(7) to November(11)
  // Even: December(12) to May(5) -- wraps around year
  if (month >= 7 && month <= 11) return 'odd';
  return 'even';
}

// Get label for current semester
export function getCurrentSemesterLabel() {
  const sem = getCurrentSemester();
  return SEMESTER_CONFIG[sem].label;
}

// Check if a listing is available for current semester
export function isAvailableNow(semesterAvailability) {
  const current = getCurrentSemester();
  const s = semesterAvailability || 'yearround';
  return s === 'yearround' || s === 'both' || s === current;
}
