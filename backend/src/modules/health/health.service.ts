export const healthService = {
  check() {
    return {
      status: "ok",
      service: "ql_chuong_trinh_dao_tao_api",
      timestamp: new Date().toISOString(),
    };
  },
};
