import { useTimestamp } from "@vueuse/core";

const timestamp = useTimestamp({ interval: 1000 });

export { timestamp };
