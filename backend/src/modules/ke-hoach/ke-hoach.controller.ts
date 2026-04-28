import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { keHoachService } from "./ke-hoach.service.js";
import type {
  BaoCaoTheoGiangVienQuery,
  BaoCaoTheoLopQuery,
  CapNhatLichTuanInput,
  CreateNhomHocPhanInput,
  CreateKeHoachDaoTaoInput,
  CreateKeHoachHocKyInput,
  GroupListQuery,
  GoiYHocPhanInput,
  KeHoachDaoTaoIdParam,
  KeHoachHocKyIdParam,
  ListQuery,
  MoHocPhanInput,
  PhanCongInput,
  TaoNhomNhanhInput,
  TaoNhomInput,
  UpdateNhomHocPhanInput,
  UpdateKeHoachDaoTaoInput,
  UpdateKeHoachHocKyInput,
} from "./ke-hoach.validation.js";

export const keHoachController = {
  async listKeHoachDaoTao(req: Request, res: Response) {
    const result = await keHoachService.listTrainingPlans(req.validated?.query as ListQuery);
    return sendSuccess(res, "Lay danh sach ke hoach dao tao thanh cong", result);
  },

  async detailKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.detailTrainingPlan(params.id);
    return sendSuccess(res, "Lay chi tiet ke hoach dao tao thanh cong", result);
  },

  async createKeHoachDaoTao(req: Request, res: Response) {
    const result = await keHoachService.createTrainingPlan(
      req.validated?.body as CreateKeHoachDaoTaoInput,
      req.user?.userId,
    );
    return sendCreated(res, "Tao ke hoach dao tao thanh cong", result);
  },

  async updateKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.updateTrainingPlan(
      params.id,
      req.validated?.body as UpdateKeHoachDaoTaoInput,
    );
    return sendSuccess(res, "Cap nhat ke hoach dao tao thanh cong", result);
  },

  async deleteKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.deleteTrainingPlan(params.id);
    return sendSuccess(res, "Xoa ke hoach dao tao thanh cong", result);
  },

  async listKeHoachHocKy(req: Request, res: Response) {
    const result = await keHoachService.listSemesterPlans(req.validated?.query as ListQuery);
    return sendSuccess(res, "Lay danh sach ke hoach hoc ky thanh cong", result);
  },

  async detailKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.detailSemesterPlan(params.id);
    return sendSuccess(res, "Lay chi tiet ke hoach hoc ky thanh cong", result);
  },

  async createKeHoachHocKy(req: Request, res: Response) {
    const result = await keHoachService.createSemesterPlan(
      req.validated?.body as CreateKeHoachHocKyInput,
    );
    return sendCreated(res, "Tao ke hoach hoc ky thanh cong", result);
  },

  async updateKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.updateSemesterPlan(
      params.id,
      req.validated?.body as UpdateKeHoachHocKyInput,
    );
    return sendSuccess(res, "Cap nhat ke hoach hoc ky thanh cong", result);
  },

  async listLopHocPhanDaMo(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.listOpenedSubjects(params.id);
    return sendSuccess(res, "Lay danh sach hoc phan da mo thanh cong", result);
  },

  async listNhomHocPhan(req: Request, res: Response) {
    const result = await keHoachService.listGroups(req.validated?.query as GroupListQuery);
    return sendSuccess(res, "Lay danh sach nhom hoc phan thanh cong", result);
  },

  async listNhomTheoLopHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.listGroupsByClassSubjectPlan(params.id);
    return sendSuccess(res, "Lay nhom hoc phan theo lop hoc phan thanh cong", result);
  },

  async createNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.createGroup(
      params.id,
      req.validated?.body as CreateNhomHocPhanInput,
    );
    return sendCreated(res, "Tao nhom hoc phan thanh cong", result);
  },

  async taoNhomNhanh(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.createGroupsQuick(
      params.id,
      req.validated?.body as TaoNhomNhanhInput,
    );
    return sendCreated(res, "Tao nhom hoc phan nhanh thanh cong", result);
  },

  async updateNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.updateGroup(
      params.id,
      req.validated?.body as UpdateNhomHocPhanInput,
    );
    return sendSuccess(res, "Cap nhat nhom hoc phan thanh cong", result);
  },

  async deleteNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.deleteGroup(params.id);
    return sendSuccess(res, "Xoa nhom hoc phan thanh cong", result);
  },

  async goiYHocPhan(req: Request, res: Response) {
    const result = await keHoachService.goiYHocPhan(req.validated?.body as GoiYHocPhanInput);
    return sendSuccess(res, "Goi y hoc phan thanh cong", result);
  },

  async moHocPhan(req: Request, res: Response) {
    const result = await keHoachService.moHocPhan(req.validated?.body as MoHocPhanInput);
    return sendCreated(res, "Mo hoc phan thanh cong", result);
  },

  async taoNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.taoNhomHocPhan(
      params.id,
      req.validated?.body as TaoNhomInput,
    );
    return sendSuccess(res, "Tao nhom hoc phan thanh cong", result);
  },

  async phanCongGiangVien(req: Request, res: Response) {
    const result = await keHoachService.phanCongGiangVien(req.validated?.body as PhanCongInput);
    return sendCreated(res, "Phan cong giang vien thanh cong", result);
  },

  async capNhatLichTheoTuan(req: Request, res: Response) {
    const result = await keHoachService.capNhatLichTheoTuan(
      req.validated?.body as CapNhatLichTuanInput,
    );
    return sendSuccess(res, "Cap nhat lich day theo tuan thanh cong", result);
  },

  async baoCaoTheoLop(req: Request, res: Response) {
    const result = await keHoachService.baoCaoTheoLop(
      req.validated?.query as BaoCaoTheoLopQuery,
    );
    return sendSuccess(res, "Lay bao cao theo lop thanh cong", result);
  },

  async baoCaoTheoGiangVien(req: Request, res: Response) {
    const result = await keHoachService.baoCaoTheoGiangVien(
      req.validated?.query as BaoCaoTheoGiangVienQuery,
    );
    return sendSuccess(res, "Lay bao cao theo giang vien thanh cong", result);
  },
};
