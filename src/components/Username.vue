<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  showAvatar?: boolean;
  router?: boolean;
  user: {
    id?: number;
    username: string;
    nickname?: string;
    real_name?: string;
    avatar?: string;
  };
}>();

const name = computed(() => {
  return props.user.real_name || props.user.nickname || props.user.username;
});
const avatarLetter = computed(() => {
  return props.user.username.slice(0, 1).toUpperCase();
});

const toUserHome = () => {
  if (props.router) {
    // window.$router.push({
    //   name: "user",
    //   params: {
    //     username: props.user.username,
    //   },
    // });
  }
};
</script>

<template>
  <n-flex
    v-bind="$attrs"
    @click="toUserHome"
    :class="{ 'cursor-pointer': router }"
  >
    <template v-if="showAvatar">
      <n-avatar v-if="user.avatar" round :size="22" :src="user.avatar" />
      <n-avatar v-else round :size="22">
        {{ avatarLetter }}
      </n-avatar>
    </template>
    <n-popover trigger="hover">
      <template #trigger>
        <span>{{ name }}</span>
      </template>
      <span>{{ user.username }}</span>
    </n-popover>
  </n-flex>
</template>
