import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";
import dayjs from "dayjs";

export default [
  {
    url: "/api/home/submissions",
    method: "get",
    response: () => {
      const resp = Mock.mock({
        code: 0,
        msg: "",
        data: {
          "x|30": [""],
          "y1|30": ["@natural(1000, 2000)"],
          "y2|30": ["@natural(500, 1000)"],
        },
      });
      for (let i = 29; i >= 0; --i) {
        (resp.data as { x: string[] }).x[i] = dayjs()
          .subtract(29 - i, "day")
          .format("YYYY-MM-DD");
      }
      return resp;
    },
  },
] as MockMethod[];
