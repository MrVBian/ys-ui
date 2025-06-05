import { createApp } from "vue";
import "vfonts/Inter.css";
import "vfonts/FiraCode.css";
import "./style.less";
import App from "./App.vue";
import "virtual:uno.css";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
