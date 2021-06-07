import * as RunManager from "@/libs/run-manager.js";
export default {
  install: (app) => {
    app.config.globalProperties.$runManager = RunManager;
  },
};
