import { useStorage } from "@vueuse/core";

const webConfig = useStorage("web-config", {
  problem_difficulties: [
    { id: 1, name: "入门", color: "" },
    { id: 2, name: "简单", color: "green" },
    { id: 3, name: "中等", color: "orange" },
    { id: 4, name: "较难", color: "red" },
    { id: 5, name: "困难", color: "purple" },
  ],
});

export { webConfig };
