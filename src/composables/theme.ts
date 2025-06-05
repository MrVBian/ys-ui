import { computed } from "vue";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  storageKey: "theme",
  initialValue: "auto",
});

const toggleTheme = useToggle(isDark);

const echartsTheme = computed(() => (isDark.value ? "dark" : null));

export { isDark, toggleTheme, echartsTheme };
