import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import { RequireAdmin } from "./guards/RequireAdmin";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const FacultyPage = lazy(() => import("../features/faculties/FacultyPage"));
const DepartmentPage = lazy(
  () => import("../features/departments/DepartmentPage"),
);
const MajorPage = lazy(() => import("../features/majors/MajorPage"));
const SpecializationPage = lazy(
  () => import("../features/specializations/SpecializationPage"),
);
const LecturerPage = lazy(() => import("../features/lecturers/LecturerPage"));
const ClassPage = lazy(() => import("../features/classes/ClassPage"));
const CoursePage = lazy(() => import("../features/courses/CoursePage"));
const CohortPage = lazy(() => import("../features/cohorts/CohortPage"));
const CampusPage = lazy(() => import("../features/campuses/CampusPage"));
const ClassroomPage = lazy(
  () => import("../features/classrooms/ClassroomPage"),
);
const SchoolYearPage = lazy(
  () => import("../features/school-years/SchoolYearPage"),
);
const SemesterPage = lazy(() => import("../features/semesters/SemesterPage"));
const CurriculumPage = lazy(
  () => import("../features/curriculums/CurriculumPage"),
);
const CurriculumDetailPage = lazy(
  () => import("../features/curriculums/CurriculumDetailPage"),
);
const TrainingYearPlanPage = lazy(
  () => import("../features/training-plans/TrainingYearPlanPage"),
);
const TrainingYearPlanDetailPage = lazy(
  () => import("../features/training-plans/TrainingYearPlanDetailPage"),
);
const SemesterTrainingPlanPage = lazy(
  () => import("../features/training-plans/SemesterTrainingPlanPage"),
);
const TeachingGroupPage = lazy(
  () => import("../features/teaching-groups/TeachingGroupPage"),
);
const TeachingAssignmentPage = lazy(
  () => import("../features/teaching-assignments/TeachingAssignmentPage"),
);
const LecturerCoursePage = lazy(
  () => import("../features/lecturer-courses/LecturerCoursePage"),
);
const ReportPage = lazy(() => import("../features/reports/ReportPage"));
function page(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[280px] items-center justify-center px-6 text-sm font-medium text-slate-500">
          Đang tải dữ liệu...
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: page(<LoginPage />) },
      { path: "register", element: page(<RegisterPage />) },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: page(<DashboardPage />) },
      {
        path: "curriculums",
        element: page(<CurriculumPage />),
      },
      {
        path: "curriculums/:id",
        element: page(<CurriculumDetailPage />),
      },
      {
        path: "training-plans",
        element: <Navigate to="/admin/training/plans/year" replace />,
      },
      {
        path: "training-plans/:id",
        element: page(<TrainingYearPlanDetailPage />),
      },
      {
        path: "training/plans/year",
        element: page(<TrainingYearPlanPage />),
      },
      {
        path: "training/plans/year/:id",
        element: page(<TrainingYearPlanDetailPage />),
      },
      {
        path: "training/plans/semesters",
        element: page(<SemesterTrainingPlanPage />),
      },
      {
        path: "training/plans/semesters/:id",
        element: page(<SemesterTrainingPlanPage />),
      },
      {
        path: "teaching-groups",
        element: page(<TeachingGroupPage />),
      },
      {
        path: "assignments",
        element: page(<TeachingAssignmentPage />),
      },
      {
        path: "reports",
        element: page(<ReportPage />),
      },
      { path: "khoa", element: page(<FacultyPage />) },
      {
        path: "faculties",
        element: page(<FacultyPage />),
      },
      { path: "bomon", element: page(<DepartmentPage />) },
      {
        path: "bo-mon",
        element: page(<DepartmentPage />),
      },
      {
        path: "nganh",
        element: page(<MajorPage />),
      },
      {
        path: "chuyennganh",
        element: page(<SpecializationPage />),
      },
      {
        path: "chuyen-nganh",
        element: page(<SpecializationPage />),
      },
      {
        path: "giang-vien-hoc-phan",
        element: page(<LecturerCoursePage />),
      },
      {
        path: "giangvien",
        element: page(<LecturerPage />),
      },
      {
        path: "giang-vien",
        element: page(<LecturerPage />),
      },
      { path: "lop", element: page(<ClassPage />) },
      {
        path: "hocphan",
        element: page(<CoursePage />),
      },
      {
        path: "hoc-phan",
        element: page(<CoursePage />),
      },
      {
        path: "khoahoc",
        element: page(<CohortPage />),
      },
      {
        path: "khoa-hoc",
        element: page(<CohortPage />),
      },
      {
        path: "coso",
        element: page(<CampusPage />),
      },
      {
        path: "co-so",
        element: page(<CampusPage />),
      },
      {
        path: "phonghoc",
        element: page(<ClassroomPage />),
      },
      {
        path: "phong-hoc",
        element: page(<ClassroomPage />),
      },
      {
        path: "namhoc",
        element: page(<SchoolYearPage />),
      },
      {
        path: "nam-hoc",
        element: page(<SchoolYearPage />),
      },
      {
        path: "hocky",
        element: page(<SemesterPage />),
      },
      {
        path: "hoc-ky",
        element: page(<SemesterPage />),
      },
      { path: "subjects", element: <Navigate to="/admin/hocphan" replace /> },
      { path: "classes", element: <Navigate to="/admin/lop" replace /> },
      { path: "teachers", element: <Navigate to="/admin/giangvien" replace /> },
    ],
  },
]);
