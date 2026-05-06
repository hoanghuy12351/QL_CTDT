import { axiosClient } from "../axiosClient";
import type { ApiResponse } from "../../types/api.types";
import type {
  ReportDownload,
  SemesterReport,
} from "../../features/reports/report.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const getFilenameFromDisposition = (value?: string) => {
  if (!value) return "bao-cao.xls";

  const encoded = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) return decodeURIComponent(encoded);

  const normal = value.match(/filename="?([^";]+)"?/i)?.[1];
  return normal ?? "bao-cao.xls";
};

const downloadReport = async (
  url: string,
  params: Record<string, string | number>,
): Promise<ReportDownload> => {
  const response = await axiosClient.get<Blob>(url, {
    params,
    responseType: "blob",
  });

  return {
    blob: response.data,
    fileName: getFilenameFromDisposition(response.headers["content-disposition"]),
  };
};

export const reportsApi = {
  getSemesterReport: async (keHoachHocKyId: number) => {
    const { data } = await axiosClient.get<ApiResponse<SemesterReport>>(
      "/admin/ke-hoach/bao-cao-hoc-ky",
      { params: { keHoachHocKyId } },
    );

    return unwrap(data);
  },

  exportSemesterReport: (keHoachHocKyId: number) =>
    downloadReport("/admin/ke-hoach/bao-cao-hoc-ky/export", {
      keHoachHocKyId,
    }),

  exportClassReport: (keHoachHocKyId: number, lopId: number) =>
    downloadReport("/admin/ke-hoach/bao-cao-theo-lop/export", {
      keHoachHocKyId,
      lopId,
    }),

  exportLecturerReport: (keHoachHocKyId: number, giangVienId: number) =>
    downloadReport("/admin/ke-hoach/bao-cao-theo-giang-vien/export", {
      keHoachHocKyId,
      giangVienId,
    }),
};
