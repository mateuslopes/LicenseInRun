// plugins/helpers-plugin.ts
const Helpers = require("@/libs/helpers.js");

export default {
  install: (app) => {
    app.config.globalProperties.$helpers = {
      cloneJson: Helpers.cloneJson,
      findIndexBy: Helpers.findIndexBy,
      createId: Helpers.createId,
      saveToLS: Helpers.saveToLS,
      getFromLS: Helpers.getFromLS,
    };
  },
};
