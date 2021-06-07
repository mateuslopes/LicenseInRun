import { ref, watch, computed, reactive } from "vue";
import * as RunMan from "../run-manager";

function getDefautConfig(options) {
  return Object.assign(
    {},
    {
      network: "test",
    },
    options
  );
}

export default function useRunManager() {
  // console.log("useFormModel start")
  const runConfig = ref(getDefautConfig());
  const runMan = reactive(RunMan.getInstance());

  async function runConnect(Run, network) {
    await runMan.init(Run, network);
  }

  async function updateBalance() {
    await runMan.updateBalance();
  }

  async function runActivate() {
    await runMan.instance.activate();
  }

  async function runSync() {
    await runMan.instance.sync();
  }

  watch(
    () => runMan.balance,
    (newbalance, prevBalance) => {
    }
  );

  // COMPUTED

  const ownerAddress = computed(() => {
    return runMan.ownerAddress();
  });

  const purseAddress = computed(() => {
    return runMan.purseAddress();
  });

  const purseBalance = computed(() => {
    return runMan.balance;
  });

  const hasBalance = computed(() => {
    return runMan.balance > 0;
  });

  function getJigs(filtered) {
    if (!filtered) {
      return runMan.instance.inventory.jigs;
    } else if (typeof filtered == "function") {
      return runMan.instance.inventory.jigs.filter((x) => {
        return x instanceof filtered;
      });
    } else if (typeof filtered == "class")
      return runMan.instance.inventory.jigs.find((x) => x instanceof filtered);
    return;
  }

  function runDebug() {
    runMan.debug();
  }

  function noBalanceError() {
    alert("There is no balance! Fund your purse.");
  }

  function jigDebug(jig) {
    console.log("JIG", jig);
    console.log("ORIGIN", jig.origin);
    console.log("LOCATION", jig.location);
    console.log("NONCE", jig.nonce);
    console.log("OWNER", jig.owner);
    console.log("SATOSHIS", jig.satoshis);
    console.log("-------------------");
  }

  // LIFE CYCLES

  return {
    runConnect,
    updateBalance,
    runActivate,
    runDebug,
    jigDebug,
    getJigs,
    //
    noBalanceError,
    runSync,
    //
    runConfig,
    runMan,
    ownerAddress,
    purseAddress,
    purseBalance,
    hasBalance,
  };
}
