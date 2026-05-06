import { serializeData } from "../../common/utils/serialize.js";

const loaiHocPhanLabels: Record<string, string> = {
  dai_hoc_thong_thuong: "Đại học thông thường",
  thuc_hanh: "Thực hành",
  do_an_du_an: "Đồ án / Dự án",
  thuc_tap: "Thực tập",
  do_an_khoa_luan_tot_nghiep: "Đồ án / Khóa luận tốt nghiệp",
  cao_hoc: "Cao học",
  huong_dan_luan_van: "Hướng dẫn luận văn",
  khac: "Khác",
};

export const mapHocPhan = <T>(item: T) => {
  const data = serializeData(item) as Record<string, unknown>;
  const loaiHocPhan =
    typeof data.loaiHocPhan === "string" ? data.loaiHocPhan : undefined;

  return {
    ...data,
    loaiHocPhanLabel: loaiHocPhan
      ? (loaiHocPhanLabels[loaiHocPhan] ?? loaiHocPhan)
      : null,
  };
};

export const mapHocPhanList = <T>(items: T[]) => items.map(mapHocPhan);
