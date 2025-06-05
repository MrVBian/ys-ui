import { h, Component } from "vue";
import { NIcon, IconProps } from "naive-ui";

export function renderIcon(
  icon: Component,
  props?: IconProps & Record<string, unknown>,
) {
  return () => h(NIcon, props, { default: () => h(icon) });
}
