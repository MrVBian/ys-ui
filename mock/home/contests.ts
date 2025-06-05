import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/home/contests",
    method: "get",
    response: () => {
      return Mock.mock({
        code: 0,
        msg: "",
        data: {
          total: 11,
          "records|10": [
            {
              "id|+1": 1,
              title: "@title(1, 10)",
              start_time: "@datetime('yyyy-MM-dd HH:mm')",
              duration: "5小时",
              rule_type: "@pick('ICPC', 'OI', 'IOI', 'Codeforces', '蓝桥杯')",
              is_rating: "@boolean",
              max_user_rating: "@integer(1000, 3000)",
              is_timed: "@boolean",
              status: "@pick('未开始', '进行中')",
            },
          ],
        },
      });
    },
  },
] as MockMethod[];
