<script setup lang="ts">
import { computed } from "vue";
import { type UploadFileInfo } from "naive-ui";
import { token } from "@/composables/auth";

const props = defineProps<{
  value: string;
}>();

const emits = defineEmits<{
  (e: "update:value", value: string): void;
}>();

const fileList = computed<UploadFileInfo[]>(() =>
  props.value
    ? [
        {
          id: "id",
          name: "name",
          url: props.value,
          status: "finished",
        },
      ]
    : [],
);

const handleFinish = ({
  file,
  event,
}: {
  file: UploadFileInfo;
  event?: ProgressEvent;
}) => {
  const target = event?.target as XMLHttpRequest;
  if (target) {
    emits(
      "update:value",
      `http://localhost:8000/static/img/${target.response}`,
    );
  }
  return file;
};

const handleError = ({
  file,
  event,
}: {
  file: UploadFileInfo;
  event?: ProgressEvent;
}) => {
  const target = event?.target as XMLHttpRequest;
  if (target) {
    window.$message.error(target.response);
  }
  return file;
};
</script>

<template>
  <n-upload
    class="upload-image"
    action="/api/upload/image"
    :default-file-list="fileList"
    :headers="
      () => ({
        Authorization: 'Bearer ' + token,
      })
    "
    list-type="image-card"
    :max="1"
    @finish="handleFinish"
    @error="handleError"
  />
</template>
<style scoped>
.upload-image:deep(.n-image img) {
  object-fit: contain !important;
}
</style>
