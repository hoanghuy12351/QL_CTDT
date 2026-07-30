import ExcelJS from "exceljs";
import JSZip from "jszip";

const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const ZIP_CONTENT_TYPE = "application/zip";

const safeFileName = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "")
    .slice(0, 140);

const asNumber = (value: unknown) => Number(value ?? 0);

type CurriculumExportData = {
  maChuongTrinh: string;
  tenChuongTrinh: string;
  tongTinChi?: unknown;
  nganh?: { maNganh?: string | null; tenNganh?: string | null } | null;
  chuyenNganh?: { tenChuyenNganh?: string | null } | null;
  khoaHoc?: { tenKhoaHoc?: string | null } | null;
  lopChuongTrinh: Array<{
    lop: { maLop: string; tenLop: string };
  }>;
  chuongTrinhHocPhan: Array<{
    hocKyDuKien: number;
    thuTu?: number | null;
    dieuKienTienQuyet?: string | null;
    hocPhan: {
      maHocPhan: string;
      tenHocPhan: string;
      soTinChi?: unknown;
      soTietLyThuyet?: number | null;
      soTietThucHanh?: number | null;
      tongSoTiet?: number | null;
    };
  }>;
};

type ClassExportTarget = {
  code: string;
  name: string;
};

type ExportedFile = {
  fileName: string;
  buffer: Buffer;
};

const borderStyle: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const center: Partial<ExcelJS.Alignment> = {
  horizontal: "center",
  vertical: "middle",
  wrapText: true,
};

const bodyCenter: Partial<ExcelJS.Alignment> = {
  horizontal: "center",
  vertical: "middle",
  wrapText: true,
};

const bodyLeft: Partial<ExcelJS.Alignment> = {
  horizontal: "left",
  vertical: "middle",
  wrapText: true,
};

const infoLeft: Partial<ExcelJS.Alignment> = {
  horizontal: "left",
  vertical: "middle",
  wrapText: false,
  shrinkToFit: true,
};

const setCell = (
  sheet: ExcelJS.Worksheet,
  address: string,
  value: ExcelJS.CellValue,
  options: {
    bold?: boolean;
    size?: number;
    alignment?: Partial<ExcelJS.Alignment>;
    border?: boolean;
  } = {},
) => {
  const cell = sheet.getCell(address);
  cell.value = value;
  cell.font = {
    name: "Times New Roman",
    size: options.size ?? 12,
    bold: options.bold ?? false,
  };
  cell.alignment = options.alignment ?? bodyLeft;
  if (options.border) {
    cell.border = borderStyle;
  }
  return cell;
};

const applyHeaderCell = (cell: ExcelJS.Cell) => {
  cell.font = { name: "Times New Roman", size: 12, bold: true };
  cell.alignment = center;
  cell.border = borderStyle;
};

const buildFileName = (curriculum: CurriculumExportData, target?: ClassExportTarget) => {
  const classPart = target?.code || target?.name || "khong-lop";
  const base = safeFileName(`${curriculum.tenChuongTrinh}_${classPart}`);
  return `${base || "chuong-trinh-dao-tao"}.xlsx`;
};

const createWorkbook = async (
  curriculum: CurriculumExportData,
  target?: ClassExportTarget,
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Quan ly CTDT";
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet("Chuong trinh dao tao", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });

  sheet.columns = [
    { key: "stt", width: 8 },
    { key: "semester", width: 8 },
    { key: "code", width: 16 },
    { key: "name", width: 44 },
    { key: "credits", width: 12 },
    { key: "theory", width: 10 },
    { key: "practice", width: 10 },
    { key: "total", width: 10 },
    { key: "prerequisite", width: 28 },
  ];

  sheet.mergeCells("A1:D1");
  sheet.mergeCells("E2:I2");
  setCell(sheet, "A1", "TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT HƯNG YÊN", {
    bold: true,
    alignment: center,
  });
  setCell(sheet, "E2", "CHƯƠNG TRÌNH ĐÀO TẠO ĐẠI HỌC CHÍNH QUY", {
    bold: true,
    size: 14,
    alignment: center,
  });

  sheet.mergeCells("B5:D5");
  sheet.mergeCells("B6:D6");
  sheet.mergeCells("H5:I5");
  sheet.mergeCells("G6:I6");
  sheet.getRow(5).height = 24;
  sheet.getRow(6).height = 24;

  setCell(sheet, "B5", `Ngành: ${curriculum.nganh?.tenNganh ?? ""}`, {
    bold: true,
    alignment: infoLeft,
  });
  setCell(sheet, "E5", "Mã ngành:", { bold: true, alignment: infoLeft });
  setCell(sheet, "F5", curriculum.nganh?.maNganh ?? "", { alignment: infoLeft });
  setCell(sheet, "H5", `Lớp: ${target?.code || target?.name || ""}`, {
    bold: true,
    alignment: infoLeft,
  });

  setCell(
    sheet,
    "B6",
    `Chuyên ngành: ${curriculum.chuyenNganh?.tenChuyenNganh ?? ""}`,
    { bold: true, alignment: infoLeft },
  );
  setCell(sheet, "E6", "Số tín chỉ:", { bold: true, alignment: infoLeft });
  setCell(sheet, "F6", asNumber(curriculum.tongTinChi), { alignment: infoLeft });
  setCell(sheet, "G6", `Khóa học: ${curriculum.khoaHoc?.tenKhoaHoc ?? ""}`, {
    bold: true,
    alignment: infoLeft,
  });

  sheet.mergeCells("A8:A9");
  sheet.mergeCells("B8:B9");
  sheet.mergeCells("C8:C9");
  sheet.mergeCells("D8:D9");
  sheet.mergeCells("E8:E9");
  sheet.mergeCells("F8:H8");
  sheet.mergeCells("I8:I9");

  [
    ["A8", "STT"],
    ["B8", "HK"],
    ["C8", "Mã MH"],
    ["D8", "Tên MH"],
    ["E8", "Số tín chỉ"],
    ["F8", "Số tiết"],
    ["F9", "LT"],
    ["G9", "TH/TN"],
    ["H9", "Tổng"],
    ["I8", "Điều kiện tiên quyết"],
  ].forEach(([address, value]) => {
    setCell(sheet, address, value, { bold: true, alignment: center, border: true });
  });

  for (let col = 1; col <= 9; col += 1) {
    applyHeaderCell(sheet.getRow(8).getCell(col));
    applyHeaderCell(sheet.getRow(9).getCell(col));
  }

  const rows = [...curriculum.chuongTrinhHocPhan].sort(
    (a, b) =>
      a.hocKyDuKien - b.hocKyDuKien ||
      (a.thuTu ?? 0) - (b.thuTu ?? 0) ||
      a.hocPhan.maHocPhan.localeCompare(b.hocPhan.maHocPhan),
  );

  rows.forEach((item, index) => {
    const row = sheet.getRow(index + 10);
    row.values = [
      index + 1,
      item.hocKyDuKien,
      item.hocPhan.maHocPhan,
      item.hocPhan.tenHocPhan,
      asNumber(item.hocPhan.soTinChi),
      item.hocPhan.soTietLyThuyet ?? 0,
      item.hocPhan.soTietThucHanh ?? 0,
      item.hocPhan.tongSoTiet ?? 0,
      item.dieuKienTienQuyet ?? "",
    ];
    row.height = 24;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Times New Roman", size: 12 };
      cell.border = borderStyle;
      cell.alignment = colNumber === 4 || colNumber === 9 ? bodyLeft : bodyCenter;
    });
  });

  const totalRow = sheet.getRow(rows.length + 10);
  totalRow.values = ["", "", "", "Tổng cộng", asNumber(curriculum.tongTinChi), "", "", "", ""];
  totalRow.eachCell((cell) => {
    cell.font = { name: "Times New Roman", size: 12, bold: true };
    cell.border = borderStyle;
    cell.alignment = bodyCenter;
  });

  sheet.views = [{ state: "frozen", ySplit: 9 }];

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
};

export const buildCurriculumExport = async (curriculum: CurriculumExportData) => {
  const activeClasses = curriculum.lopChuongTrinh
    .map((assignment) => ({
      code: assignment.lop.maLop,
      name: assignment.lop.tenLop,
    }))
    .filter(Boolean);
  const targets = activeClasses.length > 0 ? activeClasses : [undefined];
  const files: ExportedFile[] = [];

  for (const target of targets) {
    files.push({
      fileName: buildFileName(curriculum, target),
      buffer: await createWorkbook(curriculum, target),
    });
  }

  if (files.length === 1) {
    return {
      contentType: XLSX_CONTENT_TYPE,
      fileName: files[0].fileName,
      buffer: files[0].buffer,
    };
  }

  const zip = new JSZip();
  files.forEach((file) => zip.file(file.fileName, file.buffer));

  const zipName = `${safeFileName(curriculum.tenChuongTrinh) || "chuong-trinh-dao-tao"}.zip`;
  return {
    contentType: ZIP_CONTENT_TYPE,
    fileName: zipName,
    buffer: await zip.generateAsync({ type: "nodebuffer" }),
  };
};
