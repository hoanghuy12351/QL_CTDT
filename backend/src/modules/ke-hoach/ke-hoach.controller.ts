import type { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.js";
import { keHoachService } from "./ke-hoach.service.js";
import type {
  AssignmentListQuery,
  BaoCaoHocKyQuery,
  BaoCaoTheoGiangVienQuery,
  BaoCaoTheoLopQuery,
  CapNhatLichTuanInput,
  CreateKeHoachDaoTaoInput,
  CreateKeHoachHocKyInput,
  CreateNhomHocPhanInput,
  GoiYHocPhanInput,
  GroupListQuery,
  KeHoachDaoTaoIdParam,
  KeHoachHocKyIdParam,
  ListQuery,
  MoHocPhanInput,
  PhanCongInput,
  TaoNhomInput,
  TaoNhomNhanhInput,
  UpdateKeHoachDaoTaoInput,
  UpdateKeHoachHocKyInput,
  UpdateNhomHocPhanInput,
  UpdatePhanCongInput,
} from "./ke-hoach.validation.js";

const sendExcelFile = (res: Response, fileName: string, buffer: Buffer) => {
  res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
  );
  res.setHeader("Content-Length", String(buffer.length));

  return res.send(buffer);
};

export const keHoachController = {
  async listKeHoachDaoTao(req: Request, res: Response) {
    const result = await keHoachService.listTrainingPlans(
      req.validated?.query as ListQuery,
    );

    return sendSuccess(
      res,
      "Lay danh sach ke hoach dao tao thanh cong",
      result,
    );
  },

  async createKeHoachDaoTao(req: Request, res: Response) {
    const result = await keHoachService.createTrainingPlan(
      req.validated?.body as CreateKeHoachDaoTaoInput,
    );

    return sendSuccess(res, "Tao ke hoach dao tao thanh cong", result, 201);
  },

  async detailKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.detailTrainingPlan(params.id);

    return sendSuccess(res, "Lay chi tiet ke hoach dao tao thanh cong", result);
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

  async duyetKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.duyetKeHoachDaoTao(params.id);

    return sendSuccess(res, "Duyet ke hoach nam hoc thanh cong", result);
  },

  async batDauKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.batDauKeHoachDaoTao(params.id);

    return sendSuccess(
      res,
      "Bat dau thuc hien ke hoach nam hoc thanh cong",
      result,
    );
  },

  async moLaiKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.moLaiKeHoachDaoTao(params.id);

    return sendSuccess(res, "Mo lai ke hoach nam hoc thanh cong", result);
  },

  async dongKeHoachDaoTao(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachDaoTaoIdParam;
    const result = await keHoachService.dongKeHoachDaoTao(params.id);

    return sendSuccess(res, "Dong ke hoach nam hoc thanh cong", result);
  },

  async listKeHoachHocKy(req: Request, res: Response) {
    const result = await keHoachService.listSemesterPlans(
      req.validated?.query as ListQuery,
    );

    return sendSuccess(res, "Lay danh sach ke hoach hoc ky thanh cong", result);
  },

  async createKeHoachHocKy(req: Request, res: Response) {
    const result = await keHoachService.createSemesterPlan(
      req.validated?.body as CreateKeHoachHocKyInput,
    );

    return sendSuccess(res, "Tao ke hoach hoc ky thanh cong", result, 201);
  },

  async detailKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.detailSemesterPlan(params.id);

    return sendSuccess(res, "Lay chi tiet ke hoach hoc ky thanh cong", result);
  },

  async updateKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.updateSemesterPlan(
      params.id,
      req.validated?.body as UpdateKeHoachHocKyInput,
    );

    return sendSuccess(res, "Cap nhat ke hoach hoc ky thanh cong", result);
  },

  async duyetKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.approveSemesterPlan(params.id);

    return sendSuccess(res, "Duyet va khoa ke hoach hoc ky thanh cong", result);
  },

  async moLaiKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.reopenSemesterPlan(params.id);

    return sendSuccess(res, "Mo lai ke hoach hoc ky thanh cong", result);
  },

  async dongKeHoachHocKy(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.closeSemesterPlan(params.id);

    return sendSuccess(res, "Dong ke hoach hoc ky thanh cong", result);
  },

  async listLopHocPhanDaMo(req: Request, res: Response) {
    const params = req.validated?.params as KeHoachHocKyIdParam;
    const result = await keHoachService.listOpenedSubjects(params.id);

    return sendSuccess(
      res,
      "Lay danh sach lop hoc phan da mo thanh cong",
      result,
    );
  },

  async goiYHocPhan(req: Request, res: Response) {
    const result = await keHoachService.goiYHocPhan(
      req.validated?.body as GoiYHocPhanInput,
    );

    return sendSuccess(res, "Goi y hoc phan thanh cong", result);
  },

  async moHocPhan(req: Request, res: Response) {
    const result = await keHoachService.moHocPhan(
      req.validated?.body as MoHocPhanInput,
    );

    return sendSuccess(res, "Mo hoc phan thanh cong", result, 201);
  },

  async taoNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.taoNhomHocPhan(
      params.id,
      req.validated?.body as TaoNhomInput,
    );

    return sendSuccess(res, "Tao nhom hoc phan thanh cong", result, 201);
  },

  async listNhomHocPhan(req: Request, res: Response) {
    const result = await keHoachService.listGroups(
      req.validated?.query as GroupListQuery,
    );

    return sendSuccess(res, "Lay danh sach nhom hoc phan thanh cong", result);
  },

  async listNhomTheoLopHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.listGroupsByClassSubjectPlan(params.id);

    return sendSuccess(
      res,
      "Lay danh sach nhom theo lop hoc phan thanh cong",
      result,
    );
  },

  async createNhomHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.createGroup(
      params.id,
      req.validated?.body as CreateNhomHocPhanInput,
    );

    return sendSuccess(res, "Tao nhom hoc phan thanh cong", result, 201);
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

  async taoNhomNhanh(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.createGroupsQuick(
      params.id,
      req.validated?.body as TaoNhomNhanhInput,
    );

    return sendSuccess(res, "Tao nhom hoc phan nhanh thanh cong", result, 201);
  },

  async listPhanCongGiangDay(req: Request, res: Response) {
    const result = await keHoachService.listAssignments(
      req.validated?.query as AssignmentListQuery,
    );

    return sendSuccess(
      res,
      "Lay danh sach phan cong giang day thanh cong",
      result,
    );
  },

  async listGiangVienTheoHocPhan(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.listGiangVienTheoHocPhan(params.id);

    return sendSuccess(
      res,
      "Lay danh sach giang vien theo hoc phan thanh cong",
      result,
    );
  },

  async detailLichTuanPhanCong(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.detailAssignmentWeeklySchedule(
      params.id,
    );

    return sendSuccess(
      res,
      "Lay lich day theo tuan cua phan cong thanh cong",
      result,
    );
  },
  async phanCongGiangVien(req: Request, res: Response) {
    const result = await keHoachService.phanCongGiangVien(
      req.validated?.body as PhanCongInput,
    );

    return sendSuccess(res, "Phan cong giang vien thanh cong", result, 201);
  },

  async updatePhanCongGiangDay(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.updateAssignment(
      params.id,
      req.validated?.body as UpdatePhanCongInput,
    );

    return sendSuccess(res, "Cap nhat phan cong giang day thanh cong", result);
  },

  async deletePhanCongGiangDay(req: Request, res: Response) {
    const params = req.validated?.params as { id: number };
    const result = await keHoachService.deleteAssignment(params.id);

    return sendSuccess(res, "Xoa phan cong giang day thanh cong", result);
  },

  async capNhatLichTheoTuan(req: Request, res: Response) {
    const result = await keHoachService.capNhatLichTheoTuan(
      req.validated?.body as CapNhatLichTuanInput,
    );

    return sendSuccess(res, "Cap nhat lich day theo tuan thanh cong", result);
  },

  async baoCaoHocKy(req: Request, res: Response) {
    const result = await keHoachService.baoCaoHocKy(
      req.validated?.query as BaoCaoHocKyQuery,
    );

    return sendSuccess(res, "Lay bao cao hoc ky thanh cong", result);
  },

  async xuatBaoCaoHocKy(req: Request, res: Response) {
    const result = await keHoachService.xuatBaoCaoHocKy(
      req.validated?.query as BaoCaoHocKyQuery,
    );

    return sendExcelFile(res, result.fileName, result.buffer);
  },

  async xuatBaoCaoTheoLop(req: Request, res: Response) {
    const result = await keHoachService.xuatBaoCaoTheoLop(
      req.validated?.query as BaoCaoTheoLopQuery,
    );

    return sendExcelFile(res, result.fileName, result.buffer);
  },

  async xuatBaoCaoTheoGiangVien(req: Request, res: Response) {
    const result = await keHoachService.xuatBaoCaoTheoGiangVien(
      req.validated?.query as BaoCaoTheoGiangVienQuery,
    );

    return sendExcelFile(res, result.fileName, result.buffer);
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
