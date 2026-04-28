import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/admin/DashboardPage";
import AdminModulePage from "../pages/admin/AdminModulePage";
import { RequireAdmin } from "./guards/RequireAdmin";
import FacultyPage from "../features/faculties/FacultyPage";
import DepartmentPage from "../features/departments/DepartmentPage";
import MajorPage from "../features/majors/MajorPage";
import SpecializationPage from "../features/specializations/SpecializationPage";
import LecturerPage from "../features/lecturers/LecturerPage";
import ClassPage from "../features/classes/ClassPage";
import CoursePage from "../features/courses/CoursePage";
import CohortPage from "../features/cohorts/CohortPage";
import CampusPage from "../features/campuses/CampusPage";
import ClassroomPage from "../features/classrooms/ClassroomPage";
import SchoolYearPage from "../features/school-years/SchoolYearPage";
import SemesterPage from "../features/semesters/SemesterPage";
import CurriculumPage from "../features/curriculums/CurriculumPage";
import TrainingPlanPage from "../features/training-plans/TrainingPlanPage";
import TeachingGroupPage from "../features/teaching-groups/TeachingGroupPage";
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
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
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
      { path: "dashboard", element: <DashboardPage /> },
      {
        path: "curriculums",
        element: <CurriculumPage />,
      },
      {
        path: "training-plans",
        element: <TrainingPlanPage />,
      },
      {
        path: "training-plans/:id",
        element: <TrainingPlanPage />,
      },
      {
        path: "teaching-groups",
        element: <TeachingGroupPage />,
      },
      {
        path: "assignments",
        element: <AdminModulePage {...modulePages.assignments} />,
      },
      {
        path: "reports",
        element: <AdminModulePage {...modulePages.reports} />,
      },
      { path: "khoa", element: <FacultyPage /> },
      {
        path: "faculties",
        element: <FacultyPage />,
      },
      { path: "bomon", element: <DepartmentPage /> },
      {
        path: "bo-mon",
        element: <DepartmentPage />,
      },
      {
        path: "nganh",
        element: <MajorPage />,
      },
      {
        path: "chuyennganh",
        element: <SpecializationPage />,
      },
      {
        path: "chuyen-nganh",
        element: <SpecializationPage />,
      },
      {
        path: "giangvien",
        element: <LecturerPage />,
      },
      {
        path: "giang-vien",
        element: <LecturerPage />,
      },
      { path: "lop", element: <ClassPage /> },
      {
        path: "hocphan",
        element: <CoursePage />,
      },
      {
        path: "hoc-phan",
        element: <CoursePage />,
      },
      {
        path: "khoahoc",
        element: <CohortPage />,
      },
      {
        path: "khoa-hoc",
        element: <CohortPage />,
      },
      {
        path: "coso",
        element: <CampusPage />,
      },
      {
        path: "co-so",
        element: <CampusPage />,
      },
      {
        path: "phonghoc",
        element: <ClassroomPage />,
      },
      {
        path: "phong-hoc",
        element: <ClassroomPage />,
      },
      {
        path: "namhoc",
        element: <SchoolYearPage />,
      },
      {
        path: "nam-hoc",
        element: <SchoolYearPage />,
      },
      {
        path: "hocky",
        element: <SemesterPage />,
      },
      {
        path: "hoc-ky",
        element: <SemesterPage />,
      },
      { path: "subjects", element: <Navigate to="/admin/hocphan" replace /> },
      { path: "classes", element: <Navigate to="/admin/lop" replace /> },
      { path: "teachers", element: <Navigate to="/admin/giangvien" replace /> },
    ],
  },
]);
