import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/home/announcements",
    method: "get",
    response: () => {
      return Mock.mock({
        code: 0,
        msg: "",
        data: {
          total: 350,
          "records|10": [
            {
              "id|+1": 1,
              title: "@title(1, 10)",
              create_time: "@datetime(2024-07-11 HH:mm:ss)",
            },
          ],
        },
      });
    },
  },
] as MockMethod[];
