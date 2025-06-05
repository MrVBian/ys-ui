import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/home/problems",
    method: "get",
    response: () => {
      return Mock.mock({
        code: 0,
        msg: "",
        "data|10": [
          {
            display_id: "Y@natural(1000, 9999)",
            title: "@title(1, 10)",
            create_time: "@datetime(2024-07-11 HH:mm:ss)",
          },
        ],
      });
    },
  },
] as MockMethod[];
