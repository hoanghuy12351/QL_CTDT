export const CORE_CURRICULUM_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const isCoreCurriculumSemester = (semester: number) =>
  CORE_CURRICULUM_SEMESTERS.includes(semester as (typeof CORE_CURRICULUM_SEMESTERS)[number]);

export const getSemesterLabel = (semester: number) =>
  isCoreCurriculumSemester(semester) ? `Kỳ ${semester}` : "Ngoài 8 kỳ";
