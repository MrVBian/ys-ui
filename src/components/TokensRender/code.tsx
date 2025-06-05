import { ref, defineComponent } from "vue";
import { NButton, NCode, NIcon, NScrollbar, useThemeVars } from "naive-ui";
import {
  Clipboard24Regular,
  ClipboardCheckmark24Regular,
} from "@vicons/fluent";

export default defineComponent({
  name: "MyCode",
  props: {
    code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "plaintext",
    },
    maxHeight: String,
  },
  setup(props) {
    const copied = ref(false);
    const themeVars = useThemeVars();
    return () => (
      <div
        class="relative p-5px rounded-3px"
        style={`border: 1px solid ${themeVars.value.dividerColor}`}
      >
        <NScrollbar
          xScrollable={true}
          style={{ maxHeight: props.maxHeight ? props.maxHeight : "" }}
        >
          <NCode {...props} />
        </NScrollbar>
        <NButton
          size="tiny"
          tertiary={true}
          type={copied.value ? "success" : "default"}
          class="absolute top-5px right-5px"
          onClick={() => {
            if (copied.value) return;
            navigator.clipboard.writeText(props.code).then(() => {
              copied.value = true;
              setTimeout(() => {
                copied.value = false;
              }, 1500);
            });
          }}
        >
          {{
            icon: () => (
              <NIcon>
                {copied.value ? (
                  <ClipboardCheckmark24Regular />
                ) : (
                  <Clipboard24Regular />
                )}
              </NIcon>
            ),
          }}
        </NButton>
      </div>
    );
  },
});
