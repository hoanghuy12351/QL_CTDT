import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import { RequireAdmin } from "./guards/RequireAdmin";
import { RequireLecturer } from "./guards/RequireLecturer";

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
const LecturerQuotaPage = lazy(
  () => import("../features/lecturer-quotas/LecturerQuotaPage"),
);
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
const ReportPage = lazy(() => import("../features/reports/ReportPage"));
const LecturerCoursePage = lazy(
  () => import("../features/lecturer-courses/LecturerCoursePage"),
);
const LecturerAccountPage = lazy(
  () => import("../features/lecturer-accounts/LecturerAccountPage"),
);
const LecturerDashboardPage = lazy(
  () => import("../pages/lecturer/LecturerDashboardPage"),
);
const LecturerAssignmentsPage = lazy(
  () => import("../pages/lecturer/LecturerAssignmentsPage"),
);
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
export const modulePages = {
  curriculums: {
    title: "Chương trình đào tạo",
    description:
      "Quản lý CTĐT theo ngành, chuyên ngành, khóa học, lớp áp dụng và danh sách học phần theo từng học kỳ.",
    primaryAction: "Thêm CTĐT",
    actions: [
      {
        label: "Quản lý học phần trong CTĐT",
        helper:
          "Gắn học phần vào học kỳ dự kiến và tiến độ 1, tiến độ 2 hoặc cả kỳ.",
      },
      {
        label: "Gắn CTĐT cho lớp",
        helper:
          "Mỗi lớp có thể áp dụng một CTĐT để theo dõi đã học hoặc chưa học.",
      },
      {
        label: "Theo dõi tiến độ",
        helper: "Biết học phần nào đã học, đang học, chưa học hoặc tạm hoãn.",
      },
    ],
  },
  trainingPlans: {
    title: "Kế hoạch đào tạo",
    description:
      "Lập kế hoạch theo năm học, học kỳ, chọn lớp, gợi ý học phần cần mở và tạo kế hoạch lớp - học phần.",
    primaryAction: "Lập kế hoạch",
    actions: [
      {
        label: "Chọn nhiều lớp",
        helper: "Hệ thống gợi ý học phần theo CTĐT riêng của từng lớp.",
      },
      {
        label: "Ma trận lớp - học phần",
        helper: "Chỉ lớp nào có học phần trong CTĐT mới được chọn.",
      },
      {
        label: "Quản lý tuần đào tạo",
        helper: "Nhập số tiết theo tuần, đúng với mẫu Excel hiện tại.",
      },
    ],
  },
  assignments: {
    title: "Phân công giảng dạy",
    description:
      "Quản lý nhóm LT/TH, giảng viên phụ trách, số tiết phân công, hệ số lớp và lịch dạy theo tuần.",
    primaryAction: "Phân công GV",
    actions: [
      {
        label: "Tạo nhóm LT/TH",
        helper: "Học phần có thực hành có thể chia TH1, TH2 theo sĩ số.",
      },
      {
        label: "Phân công theo nhóm",
        helper: "Mỗi nhóm LT/TH có giảng viên và số tiết phân công riêng.",
      },
      {
        label: "Nhập số tiết theo tuần",
        helper: "Đảm bảo tổng số tiết theo tuần bằng số tiết phân công.",
      },
    ],
  },
  reports: {
    title: "Báo cáo",
    description:
      "Xuất kế hoạch đào tạo theo lớp, kế hoạch giảng dạy theo giảng viên và bảng tổng hợp theo học kỳ.",
    primaryAction: "Xuất báo cáo",
    actions: [
      {
        label: "Báo cáo theo lớp",
        helper: "Xem kỳ này lớp học những học phần nào và ai giảng dạy.",
      },
      {
        label: "Báo cáo theo giảng viên",
        helper: "Thống kê giảng viên dạy lớp nào, môn nào, bao nhiêu tiết.",
      },
      {
        label: "Báo cáo tổng hợp Excel",
        helper: "Xuất bảng tuần 1, tuần 2 và tổng giờ tương tự file mẫu.",
      },
    ],
  },
};

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
      {
        path: "dinh-muc-giang-vien",
        element: page(<LecturerQuotaPage />),
      },
      {
        path: "tai-khoan-giang-vien",
        element: page(<LecturerAccountPage />),
      },
      {
        path: "lecturer-accounts",
        element: page(<LecturerAccountPage />),
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
  {
    path: "/lecturer",
    element: (
      <RequireLecturer>
        <AdminLayout />
      </RequireLecturer>
    ),
    children: [
      { index: true, element: <Navigate to="/lecturer/dashboard" replace /> },
      { path: "dashboard", element: page(<LecturerDashboardPage />) },
      { path: "assignments", element: page(<LecturerAssignmentsPage />) },
    ],
  },
]);
