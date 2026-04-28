import { serializeData } from "../../common/utils/serialize.js";

export const mapHocPhan = <T>(item: T) => serializeData(item);

export const mapHocPhanList = <T>(items: T[]) => items.map(mapHocPhan);
