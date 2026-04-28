import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, "0.0.0.0", () => {
  //để render được trên các thiết bị khác nhau trong cùng mạng LAN, thay vì chỉ localhost
  console.log(`Server dang chay tren port ${env.port}`);
});
