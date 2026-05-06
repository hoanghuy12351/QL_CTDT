import type { SemesterReport, SemesterReportRow } from "./ke-hoach.report-types.js";

const safeFileName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDate = (value?: Date | null) => {
  if (!value) return "";

  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatWeekLabel = (week: SemesterReport["weeks"][number]) => {
  const dateRange = [formatDate(week.ngayBatDau), formatDate(week.ngayKetThuc)]
    .filter(Boolean)
    .join(" - ");

  return dateRange ? `Tuần ${week.soTuan}\n${dateRange}` : `Tuần ${week.soTuan}`;
};

const getCellType = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? "Number" : "String";

const cell = (
  value: unknown = "",
  options: { styleId?: string; mergeAcross?: number } = {},
) => {
  const attrs = [
    options.styleId ? `ss:StyleID="${options.styleId}"` : "",
    options.mergeAcross ? `ss:MergeAcross="${options.mergeAcross}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const type = getCellType(value);

  return `<Cell${attrs ? ` ${attrs}` : ""}><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
};

const row = (cells: string[], height?: number) =>
  `<Row${height ? ` ss:Height="${height}"` : ""}>${cells.join("")}</Row>`;

const columns = (count: number) => {
  const widths = [
    40, 150, 230, 55, 60, 90, 55, 55, 75, 90,
    ...Array.from({ length: Math.max(count - 10, 0) }, () => 85),
  ];

  return widths.map((width) => `<Column ss:Width="${width}"/>`).join("");
};

const buildScopedReport = (
  report: SemesterReport,
  rows: SemesterReportRow[],
): SemesterReport => {
  const lecturerIds = new Set(
    rows
      .map((item) => item.giangVienId)
      .filter((id): id is number => typeof id === "number"),
  );

  return {
    ...report,
    rows,
    summary: {
      totalRows: rows.length,
      totalClasses: new Set(rows.map((item) => item.lopId)).size,
      totalLecturers: lecturerIds.size,
      totalSubjects: new Set(rows.map((item) => item.hocPhanId)).size,
      totalAssignedPeriods: rows.reduce(
        (total, item) => total + item.soTietPhanCong,
        0,
      ),
      totalConvertedPeriods: rows.reduce(
        (total, item) => total + item.soTietQuyDoi,
        0,
      ),
    },
  };
};

const buildDetailSheet = (report: SemesterReport) => {
  const baseHeaders = [
    "STT",
    "Họ và tên",
    "Tên học phần",
    "Tín chỉ",
    "Số tiết",
    "Mã lớp",
    "Sĩ số",
    "Hệ số",
    "Nhóm",
    "Vai trò",
  ];
  const weekHeaders = report.weeks.map(formatWeekLabel);
  const allHeaders = [...baseHeaders, ...weekHeaders];
  const columnCount = allHeaders.length;
  const titleMerge = Math.max(columnCount - 1, 0);
  const totalWeeklyPeriods = report.weeks.map((week) =>
    report.rows.reduce(
      (total, item) => total + Number(item.weeklyPeriods[String(week.tuanId)] || 0),
      0,
    ),
  );

  return `
    <Worksheet ss:Name="Ke hoach giang day">
      <Table>${columns(columnCount)}
        ${row([cell("TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT HƯNG YÊN", { styleId: "Title", mergeAcross: titleMerge })])}
        ${row([cell(report.meta.tenKhoa || "KHOA/BỘ MÔN", { styleId: "Title", mergeAcross: titleMerge })])}
        ${row([cell("")])}
        ${row([cell(`KẾ HOẠCH GIẢNG DẠY ${report.meta.tenHocKy.toUpperCase()} NĂM HỌC ${report.meta.maNamHoc}`, { styleId: "MainTitle", mergeAcross: titleMerge })])}
        ${row([cell(report.meta.tenKeHoachHocKy, { styleId: "SubTitle", mergeAcross: titleMerge })])}
        ${row([cell("")])}
        ${row(allHeaders.map((header) => cell(header, { styleId: "Header" })), 34)}
        ${report.rows
          .map((item) =>
            row([
              cell(item.stt, { styleId: "BodyCenter" }),
              cell(item.tenGiangVien || "Chưa phân công", { styleId: "Body" }),
              cell(item.tenHocPhan, { styleId: "Body" }),
              cell(item.soTinChi, { styleId: "BodyCenter" }),
              cell(item.soTietPhanCong || item.tongSoTietHocPhan, { styleId: "BodyCenter" }),
              cell(item.maLop, { styleId: "BodyCenter" }),
              cell(item.siSo, { styleId: "BodyCenter" }),
              cell(item.heSoLop, { styleId: "BodyCenter" }),
              cell(item.maNhom, { styleId: "BodyCenter" }),
              cell(item.vaiTro, { styleId: "BodyCenter" }),
              ...report.weeks.map((week) =>
                cell(item.weeklyPeriods[String(week.tuanId)] || "", {
                  styleId: "BodyCenter",
                }),
              ),
            ]),
          )
          .join("")}
        ${row([
          cell("", { styleId: "Total" }),
          cell("Tổng cộng", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell(report.summary.totalAssignedPeriods, { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          cell("", { styleId: "Total" }),
          ...totalWeeklyPeriods.map((value) => cell(value || "", { styleId: "Total" })),
        ])}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>7</SplitHorizontal>
        <TopRowBottomPane>7</TopRowBottomPane>
        <SplitVertical>2</SplitVertical>
        <LeftColumnRightPane>2</LeftColumnRightPane>
        <ActivePane>0</ActivePane>
      </WorksheetOptions>
    </Worksheet>`;
};

const groupRows = (
  rows: SemesterReportRow[],
  getKey: (row: SemesterReportRow) => string,
  getLabel: (row: SemesterReportRow) => string,
) => {
  const map = new Map<
    string,
    { label: string; count: number; periods: number; converted: number }
  >();

  rows.forEach((item) => {
    const key = getKey(item);
    const current = map.get(key) ?? {
      label: getLabel(item),
      count: 0,
      periods: 0,
      converted: 0,
    };

    current.count += 1;
    current.periods += item.soTietPhanCong;
    current.converted += item.soTietQuyDoi;
    map.set(key, current);
  });

  return Array.from(map.values());
};

const buildSummarySheet = (report: SemesterReport) => `
  <Worksheet ss:Name="Tong hop">
    <Table>
      <Column ss:Width="180"/><Column ss:Width="260"/>
      ${row([cell("Thông tin báo cáo", { styleId: "MainTitle", mergeAcross: 1 })])}
      ${row([cell("Kế hoạch học kỳ", { styleId: "Header" }), cell(report.meta.tenKeHoachHocKy, { styleId: "Body" })])}
      ${row([cell("Năm học", { styleId: "Header" }), cell(report.meta.maNamHoc, { styleId: "Body" })])}
      ${row([cell("Học kỳ", { styleId: "Header" }), cell(report.meta.tenHocKy, { styleId: "Body" })])}
      ${row([cell("Khoa", { styleId: "Header" }), cell(report.meta.tenKhoa, { styleId: "Body" })])}
      ${row([cell("Ngày xuất", { styleId: "Header" }), cell(formatDate(report.meta.generatedAt), { styleId: "Body" })])}
      ${row([cell("")])}
      ${row([cell("Chỉ tiêu", { styleId: "Header" }), cell("Giá trị", { styleId: "Header" })])}
      ${row([cell("Số dòng phân công", { styleId: "Body" }), cell(report.summary.totalRows, { styleId: "BodyCenter" })])}
      ${row([cell("Số lớp", { styleId: "Body" }), cell(report.summary.totalClasses, { styleId: "BodyCenter" })])}
      ${row([cell("Số giảng viên", { styleId: "Body" }), cell(report.summary.totalLecturers, { styleId: "BodyCenter" })])}
      ${row([cell("Số học phần", { styleId: "Body" }), cell(report.summary.totalSubjects, { styleId: "BodyCenter" })])}
      ${row([cell("Tổng tiết phân công", { styleId: "Body" }), cell(report.summary.totalAssignedPeriods, { styleId: "BodyCenter" })])}
      ${row([cell("Tổng tiết quy đổi", { styleId: "Body" }), cell(report.summary.totalConvertedPeriods, { styleId: "BodyCenter" })])}
    </Table>
  </Worksheet>`;

const buildTeacherSummarySheet = (report: SemesterReport) => {
  const groups = groupRows(
    report.rows.filter((item) => item.giangVienId),
    (item) => String(item.giangVienId),
    (item) => `${item.maGiangVien ? `${item.maGiangVien} - ` : ""}${item.tenGiangVien}`,
  );

  return `
    <Worksheet ss:Name="Theo giang vien">
      <Table>
        <Column ss:Width="45"/><Column ss:Width="230"/><Column ss:Width="80"/><Column ss:Width="90"/><Column ss:Width="90"/>
        ${row(["STT", "Giảng viên", "Số dòng", "Tổng tiết", "Tiết quy đổi"].map((header) => cell(header, { styleId: "Header" })))}
        ${groups
          .map((item, index) =>
            row([
              cell(index + 1, { styleId: "BodyCenter" }),
              cell(item.label, { styleId: "Body" }),
              cell(item.count, { styleId: "BodyCenter" }),
              cell(item.periods, { styleId: "BodyCenter" }),
              cell(item.converted, { styleId: "BodyCenter" }),
            ]),
          )
          .join("")}
      </Table>
    </Worksheet>`;
};

const buildClassSummarySheet = (report: SemesterReport) => {
  const groups = groupRows(
    report.rows,
    (item) => String(item.lopId),
    (item) => `${item.maLop} - ${item.tenLop}`,
  );

  return `
    <Worksheet ss:Name="Theo lop">
      <Table>
        <Column ss:Width="45"/><Column ss:Width="230"/><Column ss:Width="80"/><Column ss:Width="90"/><Column ss:Width="90"/>
        ${row(["STT", "Lớp", "Số dòng", "Tổng tiết", "Tiết quy đổi"].map((header) => cell(header, { styleId: "Header" })))}
        ${groups
          .map((item, index) =>
            row([
              cell(index + 1, { styleId: "BodyCenter" }),
              cell(item.label, { styleId: "Body" }),
              cell(item.count, { styleId: "BodyCenter" }),
              cell(item.periods, { styleId: "BodyCenter" }),
              cell(item.converted, { styleId: "BodyCenter" }),
            ]),
          )
          .join("")}
      </Table>
    </Worksheet>`;
};

const styles = `
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Arial" ss:Size="10"/>
    </Style>
    <Style ss:ID="Title">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Arial" ss:Size="12" ss:Bold="1"/>
    </Style>
    <Style ss:ID="MainTitle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Size="14" ss:Bold="1"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Size="11"/>
    </Style>
    <Style ss:ID="Header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#1D4ED8" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
      </Borders>
    </Style>
    <Style ss:ID="Body">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
    </Style>
    <Style ss:ID="BodyCenter">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
    </Style>
    <Style ss:ID="Total">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/>
      <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
      </Borders>
    </Style>
  </Styles>`;

export const buildSemesterReportWorkbook = async (
  report: SemesterReport,
  rows: SemesterReportRow[] = report.rows,
) => {
  const scopedReport = buildScopedReport(report, rows);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Quản lý CTĐT</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  ${styles}
  ${buildSummarySheet(scopedReport)}
  ${buildDetailSheet(scopedReport)}
  ${buildTeacherSummarySheet(scopedReport)}
  ${buildClassSummarySheet(scopedReport)}
</Workbook>`;

  return Buffer.from(xml, "utf8");
};

export const buildReportFileName = (report: SemesterReport, suffix = "hoc-ky") => {
  const baseName = safeFileName(
    `${suffix}-${report.meta.maNamHoc}-${report.meta.tenHocKy}-${report.meta.tenKeHoachHocKy}`,
  );

  return `${baseName || "bao-cao"}.xls`;
};
