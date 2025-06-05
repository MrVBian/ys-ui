import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/home/carousels",
    method: "get",
    response: () => {
      return Mock.mock({
        code: 0,
        msg: "",
        data: [
          "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg",
          "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg",
          "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
        ],
      });
    },
  },
] as MockMethod[];
