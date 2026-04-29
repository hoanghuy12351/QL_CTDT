import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import { RequireAdmin } from "./guards/RequireAdmin";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const AdminModulePage = lazy(() => import("../pages/admin/AdminModulePage"));
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
const TrainingPlanPage = lazy(
  () => import("../features/training-plans/TrainingPlanPage"),
);
const TeachingGroupPage = lazy(
  () => import("../features/teaching-groups/TeachingGroupPage"),
);

function page(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[280px] items-center justify-center px-6 text-sm font-medium text-slate-500">
          Dang tai du lieu...
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
const modulePages = {
  curriculums: {
    title: "Chuong trinh dao tao",
    description:
      "Quan ly CTDT theo nganh, chuyen nganh, khoa hoc, lop ap dung va danh sach hoc phan theo tung hoc ky.",
    primaryAction: "Them CTDT",
    actions: [
      {
        label: "Quan ly hoc phan trong CTDT",
        helper:
          "Gan hoc phan vao hoc ky du kien va tien do 1, tien do 2 hoac ca ky.",
      },
      {
        label: "Gan CTDT cho lop",
        helper:
          "Moi lop co the ap dung mot CTDT de theo doi da hoc hoac chua hoc.",
      },
      {
        label: "Theo doi tien do",
        helper: "Biet hoc phan nao da hoc, dang hoc, chua hoc hoac tam hoan.",
      },
    ],
  },
  trainingPlans: {
    title: "Ke hoach dao tao",
    description:
      "Lap ke hoach theo nam hoc, hoc ky, chon lop, goi y hoc phan can mo va tao ke hoach lop - hoc phan.",
    primaryAction: "Lap ke hoach",
    actions: [
      {
        label: "Chon nhieu lop",
        helper: "He thong goi y hoc phan theo CTDT rieng cua tung lop.",
      },
      {
        label: "Ma tran lop - hoc phan",
        helper: "Chi lop nao co hoc phan trong CTDT moi duoc tick chon.",
      },
      {
        label: "Quan ly tuan dao tao",
        helper: "Nhap so tiet theo tuan, dung voi mau Excel hien tai.",
      },
    ],
  },
  assignments: {
    title: "Phan cong giang day",
    description:
      "Quan ly nhom LT/TH, giang vien phu trach, so tiet phan cong, he so lop va lich day theo tuan.",
    primaryAction: "Phan cong GV",
    actions: [
      {
        label: "Tao nhom LT/TH",
        helper: "Hoc phan co thuc hanh co the chia TH1, TH2 theo si so.",
      },
      {
        label: "Phan cong theo nhom",
        helper: "Moi nhom LT/TH co giang vien va so tiet phan cong rieng.",
      },
      {
        label: "Nhap so tiet theo tuan",
        helper: "Dam bao tong so tiet theo tuan bang so tiet phan cong.",
      },
    ],
  },
  reports: {
    title: "Bao cao",
    description:
      "Xuat ke hoach dao tao theo lop, ke hoach giang day theo giang vien va bang tong hop theo hoc ky.",
    primaryAction: "Xuat bao cao",
    actions: [
      {
        label: "Bao cao theo lop",
        helper: "Xem ky nay lop hoc nhung hoc phan nao va ai giang day.",
      },
      {
        label: "Bao cao theo giang vien",
        helper: "Thong ke giang vien day lop nao, mon nao, bao nhieu tiet.",
      },
      {
        label: "Bao cao tong hop Excel",
        helper: "Xuat bang tuan 1, tuan 2 va tong gio tuong tu file mau.",
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
        path: "training-plans",
        element: page(<TrainingPlanPage />),
      },
      {
        path: "training-plans/:id",
        element: page(<TrainingPlanPage />),
      },
      {
        path: "teaching-groups",
        element: page(<TeachingGroupPage />),
      },
      {
        path: "assignments",
        element: page(<AdminModulePage {...modulePages.assignments} />),
      },
      {
        path: "reports",
        element: page(<AdminModulePage {...modulePages.reports} />),
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
