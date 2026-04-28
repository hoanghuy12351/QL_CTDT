import { serializeData } from "../../common/utils/serialize.js";

export const mapAdminRecord = <T>(record: T) => serializeData(record);
