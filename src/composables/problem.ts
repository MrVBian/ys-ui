import { ref } from "vue";
import { createSharedComposable } from "@vueuse/core";

const useSharedProblemAction = createSharedComposable(() => {
  const running = ref(false);
  const submitting = ref(false);
  const runningOrSubmittingText = ref("等待评测...");
  const resultText = ref("");
  const currentLanguageId = ref<number>();
  const currentCode = ref("");
  const submissionId = ref("");
  return {
    running,
    submitting,
    runningOrSubmittingText,
    resultText,
    currentLanguageId,
    currentCode,
    submissionId,
  };
});

export { useSharedProblemAction };
