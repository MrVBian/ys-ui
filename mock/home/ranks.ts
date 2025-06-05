import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/home/ranks",
    method: "get",
    response: () => {
      const resp = Mock.mock({
        code: 0,
        msg: "",
        "data|20": [
          {
            rank: 0,
            "uid|+1": 1,
            avatar: "",
            username: "@name",
            rating: "@natural(1000, 4000)",
          },
        ],
      });
      (resp.data as { rating: number }[]).sort(
        (a: { rating: number }, b: { rating: number }) => b.rating - a.rating,
      );
      for (let i = 0; i < (resp.data as { rank: number }[]).length; ++i) {
        (resp.data as { rank: number }[])[i].rank = i + 1;
      }
      return resp;
    },
  },
] as MockMethod[];
