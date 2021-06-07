import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { RunObjectsStoreModule } from "./modules/run-objects-store";

export default createStore({
  modules: {
    runStore: RunObjectsStoreModule,
  },
  plugins: [createPersistedState()],
  state() {
    return {};
  },
  mutations: {},
  actions: {
    initAppData(context) {
      return Promise.all([context.dispatch("runStore/Init")]);
    },
  },
  getters: {},
});
