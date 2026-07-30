import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { buildPaginationMeta } from "../../common/helpers/pagination.js";
import { AppError } from "../../common/utils/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateDinhMucInput,
  GenerateDinhMucInput,
  ListDinhMucQuery,
  LoaiDinhMuc,
  UpdateDinhMucInput,
} from "./dinh-muc-giang-vien.validation.js";

const TY_LE_DINH_MUC: Record<LoaiDinhMuc, number> = {
  giang_vien_thuong: 100,
  truong_bo_mon: 80,
  pho_truong_bo_mon: 85,
  tro_giang: 70,
};

const LOAI_THEO_CHUC_VU: Record<string, LoaiDinhMuc> = {
  giang_vien: "giang_vien_thuong",
  truong_bo_mon: "truong_bo_mon",
  pho_truong_bo_mon: "pho_truong_bo_mon",
  tro_giang: "tro_giang",
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const tinhDinhMuc = (loaiDinhMuc: LoaiDinhMuc, gioTieuChuanInput = 270) => {
  const gioTieuChuan = toNumber(gioTieuChuanInput, 270);
  const tyLeDinhMuc = TY_LE_DINH_MUC[loaiDinhMuc] ?? 100;
  const gioPhaiDay = Number(((gioTieuChuan * tyLeDinhMuc) / 100).toFixed(1));
  const gioMienGiam = Number((gioTieuChuan - gioPhaiDay).toFixed(1));

  return {
    tyLeDinhMuc,
    gioTieuChuan,
    gioMienGiam,
    gioPhaiDay,
  };
};

type DinhMucRow = {
  dinhMucId: number;
  giangVienId: number;
  namHocId: number;
  loaiDinhMuc: string;
  tyLeDinhMuc: number | string;
  gioTieuChuan: number | string;
  gioMienGiam: number | string;
  gioPhaiDay: number | string;
  ghiChu?: string | null;
  ngayTao?: Date | string | null;
  ngayCapNhat?: Date | string | null;
  maGiangVien?: string | null;
  hoTen?: string | null;
  chucVu?: string | null;
  hocVi?: string | null;
  chucDanh?: string | null;
  maNamHoc?: string | null;
  tenBoMon?: string | null;
  maBoMon?: string | null;
};

const mapRow = (row: DinhMucRow) => ({
  dinhMucId: Number(row.dinhMucId),
  giangVienId: Number(row.giangVienId),
  namHocId: Number(row.namHocId),
  loaiDinhMuc: row.loaiDinhMuc,
  tyLeDinhMuc: toNumber(row.tyLeDinhMuc),
  gioTieuChuan: toNumber(row.gioTieuChuan),
  gioMienGiam: toNumber(row.gioMienGiam),
  gioPhaiDay: toNumber(row.gioPhaiDay),
  ghiChu: row.ghiChu ?? null,
  ngayTao: row.ngayTao ?? null,
  ngayCapNhat: row.ngayCapNhat ?? null,
  giangVien: {
    giangVienId: Number(row.giangVienId),
    maGiangVien: row.maGiangVien ?? "",
    hoTen: row.hoTen ?? "",
    chucVu: row.chucVu ?? "giang_vien",
    hocVi: row.hocVi ?? "",
    chucDanh: row.chucDanh ?? "",
    boMon: {
      maBoMon: row.maBoMon ?? "",
      tenBoMon: row.tenBoMon ?? "",
    },
  },
  namHoc: {
    namHocId: Number(row.namHocId),
    maNamHoc: row.maNamHoc ?? "",
  },
});

const selectDinhMucSql = `
  SELECT
    dm.dinh_muc_id AS dinhMucId,
    dm.giang_vien_id AS giangVienId,
    dm.nam_hoc_id AS namHocId,
    dm.loai_dinh_muc AS loaiDinhMuc,
    dm.ty_le_dinh_muc AS tyLeDinhMuc,
    dm.gio_tieu_chuan AS gioTieuChuan,
    dm.gio_mien_giam AS gioMienGiam,
    dm.gio_phai_day AS gioPhaiDay,
    dm.ghi_chu AS ghiChu,
    dm.ngay_tao AS ngayTao,
    dm.ngay_cap_nhat AS ngayCapNhat,
    gv.ma_giang_vien AS maGiangVien,
    gv.ho_ten AS hoTen,
    COALESCE(gv.chuc_vu, 'giang_vien') AS chucVu,
    gv.hoc_vi AS hocVi,
    gv.chuc_danh AS chucDanh,
    nh.ma_nam_hoc AS maNamHoc,
    bm.ma_bo_mon AS maBoMon,
    bm.ten_bo_mon AS tenBoMon
  FROM dinh_muc_giang_vien dm
  JOIN giang_vien gv ON gv.giang_vien_id = dm.giang_vien_id
  JOIN nam_hoc nh ON nh.nam_hoc_id = dm.nam_hoc_id
  LEFT JOIN bo_mon bm ON bm.bo_mon_id = gv.bo_mon_id
`;

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Giang vien da co dinh muc trong nam hoc nay", HTTP_STATUS.CONFLICT);
    }

    if (error.code === "P2003") {
      throw new AppError("Du lieu lien ket khong hop le", HTTP_STATUS.BAD_REQUEST);
    }
  }

  throw error;
};

export const dinhMucGiangVienService = {
  async list(query: ListDinhMucQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: string[] = [];
    const params: unknown[] = [];

    if (query.namHocId) {
      where.push("dm.nam_hoc_id = ?");
      params.push(query.namHocId);
    }

    if (query.boMonId) {
      where.push("gv.bo_mon_id = ?");
      params.push(query.boMonId);
    }

    if (query.keyword?.trim()) {
      where.push("(gv.ma_giang_vien LIKE ? OR gv.ho_ten LIKE ? OR gv.email LIKE ?)");
      const keyword = `%${query.keyword.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await prisma.$queryRawUnsafe<DinhMucRow[]>(
      `${selectDinhMucSql} ${whereSql} ORDER BY nh.ma_nam_hoc DESC, gv.ho_ten ASC LIMIT ? OFFSET ?`,
      ...params,
      limit,
      skip,
    );

    const countRows = await prisma.$queryRawUnsafe<Array<{ total: bigint | number }>>(
      `SELECT COUNT(*) AS total
       FROM dinh_muc_giang_vien dm
       JOIN giang_vien gv ON gv.giang_vien_id = dm.giang_vien_id
       JOIN nam_hoc nh ON nh.nam_hoc_id = dm.nam_hoc_id
       LEFT JOIN bo_mon bm ON bm.bo_mon_id = gv.bo_mon_id
       ${whereSql}`,
      ...params,
    );

    const totalItems = Number(countRows[0]?.total ?? 0);

    return {
      items: rows.map(mapRow),
      pagination: buildPaginationMeta(page, limit, totalItems),
    };
  },

  async detail(id: number) {
    const rows = await prisma.$queryRawUnsafe<DinhMucRow[]>(
      `${selectDinhMucSql} WHERE dm.dinh_muc_id = ? LIMIT 1`,
      id,
    );

    if (!rows[0]) {
      throw new AppError("Khong tim thay dinh muc giang vien", HTTP_STATUS.NOT_FOUND);
    }

    return mapRow(rows[0]);
  },

  async create(input: CreateDinhMucInput) {
    const loaiDinhMuc = input.loaiDinhMuc;
    const computed = tinhDinhMuc(loaiDinhMuc, input.gioTieuChuan);

    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO dinh_muc_giang_vien
          (giang_vien_id, nam_hoc_id, loai_dinh_muc, ty_le_dinh_muc, gio_tieu_chuan, gio_mien_giam, gio_phai_day, ghi_chu)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        input.giangVienId,
        input.namHocId,
        loaiDinhMuc,
        computed.tyLeDinhMuc,
        computed.gioTieuChuan,
        computed.gioMienGiam,
        computed.gioPhaiDay,
        input.ghiChu ?? null,
      );

      await prisma.$executeRawUnsafe(
        `UPDATE giang_vien SET dinh_muc_gio = ? WHERE giang_vien_id = ?`,
        computed.gioPhaiDay,
        input.giangVienId,
      );

      const rows = await prisma.$queryRawUnsafe<DinhMucRow[]>(
        `${selectDinhMucSql} WHERE dm.giang_vien_id = ? AND dm.nam_hoc_id = ? LIMIT 1`,
        input.giangVienId,
        input.namHocId,
      );

      return mapRow(rows[0]);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async update(id: number, input: UpdateDinhMucInput) {
    const current = await this.detail(id);
    const loaiDinhMuc = (input.loaiDinhMuc ?? current.loaiDinhMuc) as LoaiDinhMuc;
    const gioTieuChuan = input.gioTieuChuan ?? current.gioTieuChuan;
    const computed = tinhDinhMuc(loaiDinhMuc, gioTieuChuan);

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE dinh_muc_giang_vien
         SET giang_vien_id = ?, nam_hoc_id = ?, loai_dinh_muc = ?, ty_le_dinh_muc = ?,
             gio_tieu_chuan = ?, gio_mien_giam = ?, gio_phai_day = ?, ghi_chu = ?, ngay_cap_nhat = NOW()
         WHERE dinh_muc_id = ?`,
        input.giangVienId ?? current.giangVienId,
        input.namHocId ?? current.namHocId,
        loaiDinhMuc,
        computed.tyLeDinhMuc,
        computed.gioTieuChuan,
        computed.gioMienGiam,
        computed.gioPhaiDay,
        input.ghiChu === undefined ? current.ghiChu : input.ghiChu,
        id,
      );

      await prisma.$executeRawUnsafe(
        `UPDATE giang_vien SET dinh_muc_gio = ? WHERE giang_vien_id = ?`,
        computed.gioPhaiDay,
        input.giangVienId ?? current.giangVienId,
      );

      return this.detail(id);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async remove(id: number) {
    const current = await this.detail(id);
    await prisma.$executeRawUnsafe(
      `DELETE FROM dinh_muc_giang_vien WHERE dinh_muc_id = ?`,
      id,
    );
    return current;
  },

  async generate(input: GenerateDinhMucInput) {
    const where: string[] = ["gv.trang_thai = 'dang_giang_day'"];
    const params: unknown[] = [];

    if (input.boMonId) {
      where.push("gv.bo_mon_id = ?");
      params.push(input.boMonId);
    }

    const lecturers = await prisma.$queryRawUnsafe<
      Array<{
        giangVienId: number;
        chucVu?: string | null;
        dinhMucGio?: string | number | null;
      }>
    >(
      `SELECT gv.giang_vien_id AS giangVienId,
              COALESCE(gv.chuc_vu, 'giang_vien') AS chucVu,
              gv.dinh_muc_gio AS dinhMucGio
       FROM giang_vien gv
       WHERE ${where.join(" AND ")}`,
      ...params,
    );

    let created = 0;
    let skipped = 0;

    for (const lecturer of lecturers) {
      const exists = await prisma.$queryRawUnsafe<Array<{ total: bigint | number }>>(
        `SELECT COUNT(*) AS total FROM dinh_muc_giang_vien WHERE giang_vien_id = ? AND nam_hoc_id = ?`,
        lecturer.giangVienId,
        input.namHocId,
      );

      if (Number(exists[0]?.total ?? 0) > 0) {
        skipped += 1;
        continue;
      }

      const loaiDinhMuc = LOAI_THEO_CHUC_VU[String(lecturer.chucVu ?? "giang_vien")] ?? "giang_vien_thuong";
      const gioTieuChuan = toNumber(lecturer.dinhMucGio, 0) > 0
        ? toNumber(lecturer.dinhMucGio, input.gioTieuChuanMacDinh)
        : input.gioTieuChuanMacDinh;
      const computed = tinhDinhMuc(loaiDinhMuc, gioTieuChuan);

      await prisma.$executeRawUnsafe(
        `INSERT INTO dinh_muc_giang_vien
          (giang_vien_id, nam_hoc_id, loai_dinh_muc, ty_le_dinh_muc, gio_tieu_chuan, gio_mien_giam, gio_phai_day, ghi_chu)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        lecturer.giangVienId,
        input.namHocId,
        loaiDinhMuc,
        computed.tyLeDinhMuc,
        computed.gioTieuChuan,
        computed.gioMienGiam,
        computed.gioPhaiDay,
        "Sinh định mức tự động theo chức vụ giảng viên",
      );

      await prisma.$executeRawUnsafe(
        `UPDATE giang_vien SET dinh_muc_gio = ? WHERE giang_vien_id = ?`,
        computed.gioPhaiDay,
        lecturer.giangVienId,
      );

      created += 1;
    }

    return {
      created,
      skipped,
      totalLecturers: lecturers.length,
    };
  },
};
