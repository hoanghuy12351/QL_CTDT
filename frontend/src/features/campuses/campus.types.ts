export type CampusDto = {
  coSoId: number;
  maCoSo: string;
  tenCoSo: string;
  diaChi?: string | null;
};

export type Campus = {
  id: number;
  code: string;
  name: string;
  address: string | null;
};

export type CampusFormValues = {
  code: string;
  name: string;
  address: string;
};

export type CreateCampusPayload = {
  maCoSo: string;
  tenCoSo: string;
  diaChi?: string;
};

export type UpdateCampusPayload = Partial<CreateCampusPayload>;

export type CampusListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
