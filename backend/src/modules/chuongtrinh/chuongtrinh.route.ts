import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { chuongTrinhService } from "./chuongtrinh.service.js";
import {
  assignClassSchema,
  classProgressParamSchema,
  createCurriculumCourseSchema,
  createCurriculumSchema,
  curriculumCourseIdParamSchema,
  curriculumIdParamSchema,
  listQuerySchema,
  progressIdParamSchema,
  updateCurriculumCourseSchema,
  updateCurriculumSchema,
  updateProgressSchema,
  type AssignClassInput,
  type ClassProgressParam,
  type CreateCurriculumCourseInput,
  type CreateCurriculumInput,
  type CurriculumCourseIdParam,
  type CurriculumIdParam,
  type CurriculumListQuery,
  type ProgressIdParam,
  type UpdateCurriculumCourseInput,
  type UpdateCurriculumInput,
  type UpdateProgressInput,
} from "./chuongtrinh.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/",
  validate({ query: listQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.validated?.query as CurriculumListQuery;
    const result = await chuongTrinhService.list(query);
    return sendSuccess(res, "Lay danh sach chuong trinh dao tao thanh cong", result);
  }),
);

router.post(
  "/",
  validate({ body: createCurriculumSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated?.body as CreateCurriculumInput;
    const result = await chuongTrinhService.create(body);
    return sendCreated(res, "Tao chuong trinh dao tao thanh cong", result);
  }),
);

router.put(
  "/hoc-phan/:entryId",
  validate({ params: curriculumCourseIdParamSchema, body: updateCurriculumCourseSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumCourseIdParam;
    const body = req.validated?.body as UpdateCurriculumCourseInput;
    const result = await chuongTrinhService.updateCourse(params.entryId, body);
    return sendSuccess(res, "Cap nhat hoc phan trong CTDT thanh cong", result);
  }),
);

router.delete(
  "/hoc-phan/:entryId",
  validate({ params: curriculumCourseIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumCourseIdParam;
    const result = await chuongTrinhService.deleteCourse(params.entryId);
    return sendSuccess(res, "Xoa hoc phan khoi CTDT thanh cong", result);
  }),
);

router.put(
  "/tien-do/:tienDoId",
  validate({ params: progressIdParamSchema, body: updateProgressSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as ProgressIdParam;
    const body = req.validated?.body as UpdateProgressInput;
    const result = await chuongTrinhService.updateProgress(params.tienDoId, body);
    return sendSuccess(res, "Cap nhat tien do hoc phan thanh cong", result);
  }),
);

router.get(
  "/:id/hoc-phan",
  validate({ params: curriculumIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const result = await chuongTrinhService.listCourses(params.id);
    return sendSuccess(res, "Lay danh sach hoc phan trong CTDT thanh cong", result);
  }),
);

router.post(
  "/:id/hoc-phan",
  validate({ params: curriculumIdParamSchema, body: createCurriculumCourseSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const body = req.validated?.body as CreateCurriculumCourseInput;
    const result = await chuongTrinhService.addCourse(params.id, body);
    return sendCreated(res, "Them hoc phan vao CTDT thanh cong", result);
  }),
);

router.get(
  "/:id/lop",
  validate({ params: curriculumIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const result = await chuongTrinhService.listAssignments(params.id);
    return sendSuccess(res, "Lay danh sach lop ap dung CTDT thanh cong", result);
  }),
);

router.post(
  "/:id/lop",
  validate({ params: curriculumIdParamSchema, body: assignClassSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const body = req.validated?.body as AssignClassInput;
    const result = await chuongTrinhService.assignClass(params.id, body);
    return sendCreated(res, "Gan CTDT cho lop va sinh tien do thanh cong", result);
  }),
);

router.get(
  "/:id/lop/:lopId/tien-do",
  validate({ params: classProgressParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as ClassProgressParam;
    const result = await chuongTrinhService.listProgress(params.id, params.lopId);
    return sendSuccess(res, "Lay tien do hoc phan cua lop thanh cong", result);
  }),
);

router.get(
  "/:id",
  validate({ params: curriculumIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const result = await chuongTrinhService.detail(params.id);
    return sendSuccess(res, "Lay chi tiet chuong trinh dao tao thanh cong", result);
  }),
);

router.put(
  "/:id",
  validate({ params: curriculumIdParamSchema, body: updateCurriculumSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const body = req.validated?.body as UpdateCurriculumInput;
    const result = await chuongTrinhService.update(params.id, body);
    return sendSuccess(res, "Cap nhat chuong trinh dao tao thanh cong", result);
  }),
);

router.delete(
  "/:id",
  validate({ params: curriculumIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as CurriculumIdParam;
    const result = await chuongTrinhService.delete(params.id);
    return sendSuccess(res, "Xoa chuong trinh dao tao thanh cong", result);
  }),
);

export default router;
