import { TestnetAccount } from "@/config/config";

export class RunManager {
  connected = false;
  instance = null;
  balance = 0;

  getself() {
    return this;
  }

  setInstance(instance) {
    this.instance = instance;
    this.connected = true;
  }

  async connect(Run, network) {
    // const mockchain = new Run.plugins.Mockchain();

    if (network == "test") {
      console.log("Run connected to testnet");
      const run = new Run({
        // this.instance = new Run({
        // app: "XxxMmYyyyy",
        // debug: true,
        network: "test",
        owner: TestnetAccount.owner.privKey,
        purse: TestnetAccount.purse.privKey,
      });
      run.trust("*");
      await run.inventory.sync();
      this.instance = run;
    } else {
      console.log("Run connected to mock");
      const run = new Run({
        network: "mock",
        debug: true,
        // logger: console,
      });
      this.instance = run;
    }
    this.connected = true;
  }

  setLocalCache(cache) {
    this.instance.cache = cache;
  }

  async init(Run, network) {
    await this.connect(Run, network);
    await this.updateBalance();
  }

  ownerAddress() {
    return this.connected ? this.instance.owner.address : "a";
  }
  ownerPubKey() {
    return this.connected ? this.instance.owner.pubkey : "b";
  }
  //
  purseAddress() {
    return this.connected ? this.instance.purse.address : "s";
  }
  setBalance(balance) {
    this.balance = balance;
  }

  async updateBalance() {
    if (this.instance && this.instance.purse) {
      this.setBalance(await this.instance.purse.balance());
    }
  }

  async getJigs(filtered) {
    if (!filtered) {
      return await this.instance.inventory.jigs;
    } else if (typeof filtered == "function")
      return await this.instance.inventory.jigs.filter(filtered);
    else if (typeof filtered == "class")
      return await this.instance.inventory.jigs.find(
        (x) => x instanceof filtered
      );
    return;
  }
  async getJig(loc) {
    const jig = await this.instance.load(loc);
    await jig.sync();
    return jig;
  }

  async getCodes(filtered) {
    // console.log("getCodes", filtered, typeof filtered)
    if (!filtered) return this.instance.inventory.code;
    else if (typeof filtered == "function")
      return this.instance.inventory.code.filter(filtered);
    else if (typeof filtered == "string")
      return this.instance.inventory.code.find((c) => c.origin == filtered);
    // else if (typeof filtered == 'class')
    //   return this.instance.inventory.jigs.find(x => x instanceof filtered)
    return;
  }

  async trustCode(txid) {
    await this.instance.trust(txid);
  }

  async fetchMetadata(txid) {
    const rawtx = await run.blockchain.fetch(txid);
    const metadata = Run.util.metadata(rawtx);
    console.log(metadata);
    return metadata;
  }

  debug() {
    console.log("DEBUG RUN INSTANCE", this.instance);
    console.log(
      "RUN OWNER",
      this.instance.owner,
      this.ownerAddress(),
      this.ownerPubKey()
    );
    console.log("RUN PURSE", this.instance.purse, this.purseAddress());
    console.log("RUN LOGGER", this.instance.logger);
  }
}

export function getInstance() {
  const rm = new RunManager();
  return rm;
}
