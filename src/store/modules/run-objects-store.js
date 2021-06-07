// import * as LicHelpers from "@/store/modules/license-helpers.js";
import * as bsvMnemonic from 'bsv-mnemonic';
// import * as openpgp from 'openpgp';

let LOCAL_RUN = null;
let BUCKET_JIG_CLASS = null;
let _LAST_LOADED_LOCATION = null;
const BUCKET_JIG_CLASS_LOC =
  "9a59be77471f3f0625bfae00cdf254592e9dbc684a4e51e4616c917606eee5a8_o2";

function findJigLoc(loc) {
  let jigs = LOCAL_RUN.inventory.jigs.filter((j) => {
    return j.location === loc;
  });
  return jigs.length > 0 ? jigs[0] : [];
}

function findJigOrigin(origin) {
  let jigs = LOCAL_RUN.inventory.jigs.filter((j) => j.origin === origin);
  return jigs.length > 0 ? jigs[0] : [];
}

function filterJigs(filterFunc) {
  return LOCAL_RUN.inventory.jigs.filter(filterFunc);
}

function activatedJigs() {
  return filterJigs((j) => j.isA && j.isA());
}

function activableJigs() {
  return filterJigs((j) => j.canA && j.canA());
}

function activeJigs() {
  return filterJigs((j) => (j.canA && j.canA()) || (j.isA && j.isA()));
}

function inboxJigs() {
  return filterJigs((j) => (j.className == 'LIN_Payment' || j.canA && j.canA()) || (j.isA && j.isA()) || (j.isCnc && j.isCnc() && !j.isX()));
}

function validLocation(location) {
  return typeof location === "string" && location.length > 32;
}

function validateAddress(address) {
  let validAddress;
  // console.log("validateAddress", address, bsv.Address);
  try {
    validAddress = bsv.Address.fromString(address)
  } catch (e) {
    return false
  }
  return true;
}

function generateKeysFromSeed(seedWords, wordsList, Network) {
  let mnm;
  try {
    mnm = new bsvMnemonic(seedWords, wordsList);
  } catch {
    throw new Error("Invalid mnemonic words!");
  }
  var hdPrivateKey = bsv.HDPrivateKey.fromSeed(mnm.toSeed(), Network);

  // Derive both owner and purse private keys
  var ownerHDPrivKey = hdPrivateKey.deriveChild("m/44'/0'/0'");
  var purseHDPrivKey = hdPrivateKey.deriveChild("m/44'/1'/0'");

  // Generate owner private key, public key and address
  var ownerPrivKey = bsv.PrivateKey.fromString(ownerHDPrivKey.privateKey.toString(), Network);
  var ownerPubKey = bsv.PublicKey.fromPrivateKey(ownerPrivKey);
  var ownerAddress = ownerPubKey.toAddress();

  // Generate purse private key, public key and address
  var pursePrivKey = bsv.PrivateKey.fromString(purseHDPrivKey.privateKey.toString(), Network);
  var pursePubKey = bsv.PublicKey.fromPrivateKey(pursePrivKey);
  var purseAddress = pursePubKey.toAddress();

  //
  return {
    SeedWords: seedWords.toString(),
    Network: Network,
    owner: {
      path: "m/44'/0'/0'",
      privKey: ownerPrivKey.toString(),
      pubKey: ownerPubKey.toString(),
      address: ownerAddress.toString()
    },
    purse: {
      path: "m/44'/1'/0'",
      privKey: pursePrivKey.toString(),
      PublicKey: pursePubKey.toString(),
      address: purseAddress.toString()
    }
  };
}

function safeNetwork(n) {
  if (n == 'test' || n == 'testnet') return 'testnet';
  else if (n == 'main' || n == 'mainnet' || n == 'livenet') return 'livenet';
  return 'mock';
}

function generateWallet(Network) {
  const wordsList = bsvMnemonic.Words.ENGLISH;
  let m = new bsvMnemonic(wordsList);
  return generateKeysFromSeed(m.phrase, wordsList, Network);
}

function storeWallet(wlt) {
  window.localStorage.setItem("WALLET", JSON.stringify(wlt));
}

function getStoredWallet(Network) {
  let _network = safeNetwork(Network)
  var stored = window.localStorage.getItem("WALLET");
  if (!stored) {
    var wlt = generateWallet(_network);
    storeWallet(wlt)
    return wlt;
  } else
    return JSON.parse(stored);
}

function _cdt() {
  return Math.floor(Date.now() / 1000);
}

export const RunObjectsStoreModule = {
  namespaced: true,
  state: () => {
    return {
      jigs: [],
      issuers: [],
      payments: [],
      bucket: null,
      license: null,
      balance: 0,
      ownerAddress: "",
      purseAddress: "",
      network: "",
    };
  },
  mutations: {
    SetJigs(state, value) {
      state.jigs = value;
    },
    SetIssuers(state, value) {
      state.jigs = value;
    },
    SetPayments(state, value) {
      state.jigs = value;
    },
    SetBucket(state, value) {
      state.bucket = value;
    },
    SetLicense(state, value) {
      state.license = value;
    },
    SetBalance(state, value) {
      state.balance = value;
    },
    SetOwner(state, value) {
      state.ownerAddress = value.address;
    },
    SetPurse(state, value) {
      state.purseAddress = value.address;
    },
    SetNetwork(state, value) {
      state.network = value.network;
    },
  },
  actions: {
    async Init(context, network) {
      // console.log("Init RunObjects");
      return new Promise(async (resolve, reject) => {
        network = network || "test";
        const localWallet = getStoredWallet(network);
        let runOpts = {
          app: "LicensedIn",
          debug: true,
          trust: "*",
          network: network,
          // logger: console,
          // cache: new Run.plugins.LocalCache()
        };
        if (network == "test" || network == "main") {
          runOpts = Object.assign(runOpts, {
            owner: localWallet.owner.privKey,
            purse: localWallet.purse.privKey,
          });
        }
        LOCAL_RUN = new Run(runOpts);
        // console.log("RUN CONNECTED: ", LOCAL_RUN);
        context.commit("SetNetwork", LOCAL_RUN.network);
        context.commit("SetOwner", LOCAL_RUN.owner);
        context.commit("SetPurse", LOCAL_RUN.purse);
        context.dispatch("LoadStaticAssets").then((resp) => {
          // console.log("Init LoadStaticAssets", resp);
          context.dispatch("UpdateBalance").then((resp) => {
            // console.log("Init UpdateBalance", resp);
            context.dispatch("ReloadJigs").then((resp) => {
              // console.log("Init ReloadJigs", resp);
              resolve(true);
            });
          });
        });
      });
    },
    Get(context) {
      return new Promise((resolve, reject) => {});
    },
    LoadStaticAssets(context) {
      return new Promise(async (resolve, reject) => {
        BUCKET_JIG_CLASS = await LOCAL_RUN.load(BUCKET_JIG_CLASS_LOC);
        await BUCKET_JIG_CLASS.sync();
        resolve(BUCKET_JIG_CLASS);
      });
    },
    ReloadJigs(context) {
      // console.log("ReloadJigs", LOCAL_RUN);
      return new Promise(async (resolve, reject) => {
        await LOCAL_RUN.sync();
        await LOCAL_RUN.inventory.sync();
        const _jigs = LOCAL_RUN.inventory.jigs.slice();
        context.commit("SetJigs", _jigs);
        context.dispatch("UpdateBalance").then(() => {})
        resolve(_jigs);
      });
    },
    UpdateBalance(context) {
      // console.log("UpdateBalance");
      return new Promise(async (resolve) => {
        let balance = 0;
        if (LOCAL_RUN && LOCAL_RUN.purse) {
          balance = await LOCAL_RUN.purse.balance();
          context.commit("SetBalance", balance);
        }
        resolve(balance);
      });
    },
    RunLoad(context, location) {
      //   console.log("runload", _LAST_LOADED_LOCATION, location);
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        if (
          _LAST_LOADED_LOCATION &&
          _LAST_LOADED_LOCATION.location === location
        ) {
          resolve(_LAST_LOADED_LOCATION);
          return;
        }
        _LAST_LOADED_LOCATION = await LOCAL_RUN.load(location);
        await _LAST_LOADED_LOCATION.sync();
        resolve(_LAST_LOADED_LOCATION);
      });
    },
    LoadBucket(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        let _loaded = await LOCAL_RUN.load(location);
        await _loaded.sync();
        // TODO: console.log("Verify loaded bucket", _loaded)
        context.commit("SetBucket", _loaded);
        resolve(_loaded);
      });
    },
    LoadLicense(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        let _loaded = await LOCAL_RUN.load(location);
        await _loaded.sync();
        // TODO: console.log("Verify loaded license", _loaded)
        context.commit("SetLicense", _loaded);
        resolve(_loaded);
      });
    },
    CreateBucket(context, opts) {
      return new Promise(async (resolve) => {
        let _bucket = await new BUCKET_JIG_CLASS(opts);
        await _bucket.sync();
        context.dispatch("ReloadJigs");
        resolve(_bucket);
      });
    },
    DestroyBucket(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        const bucket = findJigLoc(location);
        try {
          bucket.destroy(_cdt());
          await bucket.sync();
        } catch (err) {
          reject(err);
          return;
        }
        context.dispatch("ReloadJigs");
        resolve(true);
      });
    },
    CreateLicense(context, options) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(options.parent_location)) {
          reject(false);
          return;
        }
        const bucket = findJigLoc(options.parent_location);
        console.log("CreateLicense", options, bucket);
        await bucket.sync();

        options.c_at = _cdt();
        console.log("CreateLicense2", options);
        try {
          // const childOpts =
          //   options.opts ||
          //   LicHelpers.getLicenseOptionsExample(
          //     options.templateName || "max-lifetime",
          //     options.p_ad
          //   );
          bucket.newChild(options);
          await bucket.sync();
          context.dispatch("ReloadJigs");
          resolve(bucket);
        } catch (err) {
          reject(err);
        }
      });
    },
    DispatchLicense(context, params) {
      // console.log("DispatchLicense", params.location, params.address)
      return new Promise(async (resolve, reject) => {
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        // console.log("licence",license)
        await license.sync();
        try {
          license.dispatch(_cdt(), params.address);
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    SendLicense(context, params) {
      // console.log("SendLicense", params.location, params.address)
      return new Promise(async (resolve, reject) => {
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        // console.log("licence",license)
        await license.sync();
        try {
          license.send(_cdt(), params.address);
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    CancelLicense(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(location);
        await license.sync();
        try {
          license.cancel(_cdt());
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    DepositLicense(context, params) {
      return new Promise(async (resolve, reject) => {
        if (isNaN(params.amount) || !(params.amount > 0)) {
          reject({
            message: "Insuficient deposit amount"
          });
          return;
        }
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        await license.sync();
        try {
          license.deposit(_cdt(), params.amount);
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    WithdrawLicense(context, params) {
      return new Promise(async (resolve, reject) => {
        // if (isNaN(params.amount) || !(params.amount > 0)) {
        //   reject({message:"Insuficient withdraw amount"})
        //   return
        // }
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        await license.sync();
        try {
          license.withdraw(_cdt());
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    ActivateLicense(context, params) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        await license.sync();
        try {
          license.activate(_cdt(), params.payload);
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    PayLicense(context, params) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(params.location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(params.location);
        await license.sync();
        try {
          license.pay(_cdt());
          await license.sync();
          context.dispatch("ReloadJigs");
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    },
    DestroyLicense(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(location);
        try {
          license.destroy(_cdt());
          await license.sync();
        } catch (err) {
          reject(err);
          return;
        }
        context.dispatch("ReloadJigs");
        resolve(true);
      });
    },
    ReturnOwnerLicense(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        const license = findJigLoc(location);
        try {
          license.returnOwner(_cdt());
          await license.sync();
        } catch (err) {
          reject(err);
          return;
        }
        context.dispatch("ReloadJigs");
        resolve(true);
      });
    },
    RedeemPayment(context, location) {
      return new Promise(async (resolve, reject) => {
        if (!validLocation(location)) {
          reject(false);
          return;
        }
        const paym = findJigLoc(location);
        try {
          paym.redeem(_cdt());
          await paym.sync();
        } catch (err) {
          reject(err);
          return;
        }
        context.dispatch("ReloadJigs");
        resolve(true);
      });
    },
    WithdrawAccount(context) {
      return new Promise(async (resolve, reject) => {
        const toAddress = await window.prompt("Type the withdraw destination address");
        if (!toAddress) return;
        if (!validateAddress(toAddress)) {
          reject({message: "Invalid address! Try another one."});
          return;
        }
        if (LOCAL_RUN.purse.address == toAddress) {
          reject({message: "Sorry! You cannot withdraw to your own addresses."});
          return;
        }

        const txtAmount = await window.prompt("Type the withdraw satoshis amount");
        if (!txtAmount) return;
        const amount = parseInt(txtAmount);
        if (isNaN(amount) || amount <= 0) {
          reject({message: "Invalid satoshis amount."});
          return;
        }
        const balance = await LOCAL_RUN.purse.balance();
        if (amount > balance) {
          reject({message: "Sorry! Not enough balance."});
          return;
        }

        const utxos = await LOCAL_RUN.purse.utxos()
        
        const fromAddress = LOCAL_RUN.purse.address;
        const fromPrivKey = LOCAL_RUN.purse.privkey;
        
        const tx = new bsv.Transaction()
          .from(utxos)
          .to(toAddress, amount)
          .change(fromAddress)
          .sign(fromPrivKey);
        // console.log("tx", tx);

        let areYouSure = await window.confirm("Are you sure you want to broadcast your withdraw transaction?");
        if (areYouSure) {
          try {
            await LOCAL_RUN.blockchain.broadcast(tx)
            context.dispatch("UpdateBalance").then(() => {})
          } catch (err) {
            console.log("error", err);
            reject({message: "Sorry! There was an error broadcasting the transaction."});
            return;
          }
          console.log("broadcasted", broadcasted);
        }

        resolve(true);
      });
    },
    // DepositAccount(context) {
    //   return new Promise(async (resolve, reject) => {
    //     resolve(true);
    //   });
    // },
  },
  getters: {
    jigs: (state, idx) => state.jigs || [],
    bucket: (state) => state.bucket || null,
    license: (state) => state.license || null,
    balance: (state) => state.balance || 0,
    ownerAddress: (state) => state.ownerAddress || "",
    purseAddress: (state) => state.purseAddress || "",
    GetJigLoc: (state) => (loc) => {
      return findJigLoc(loc) || "";
    },
    GetIssuer: (state, idx) => state.issuers[idx] || "",
    GetActivated: (state) => activatedJigs() || [],
    GetActivable: (state) => activableJigs() || [],
    GetActive: (state) => activeJigs() || [],
    GetInbox: (state) => inboxJigs() || [],
    network: (state) => state.network || "",
    isMock: (state) => state.network === "mock",
    isTest: (state) => state.network === "test",
    isMain: (state) => state.network === "main",
    checkJigFunction: (state) => (loc, funcName) => {
      const jig = findJigLoc(loc);
      switch (funcName) {
        case "isParOwn":
          return jig.isParOwn && jig.isParOwn();
        case "isVld":
          return jig.isVld && jig.isVld(_cdt());
        case "canP":
          return jig.canP && jig.canP();
        case "canS":
          return jig.canS && jig.canS();
        case "canA":
          return jig.canA && jig.canA();
        case "canDep":
          return jig.canDep && jig.canDep();
        case "canW":
          return jig.canW && jig.canW();
        case "canCnc":
          return jig.canCnc && jig.canCnc();
        case "canDsp":
          return jig.canDsp && jig.canDsp();
        case "canDstr":
          return jig.canDstr && jig.canDstr();
        case "isA":
          return jig.isA && jig.isA();
        case "isD":
          return jig.isD && jig.isD();
        case "isCnc":
          return jig.isCnc && jig.isCnc();
        case "isX":
          return jig.isX && jig.isX(_cdt());
        case "isPCX":
          return jig.isPCX && jig.isPCX(_cdt());
        case "hasPayBal":
          return jig.hasPayBal && jig.hasPayBal();
        case "lifeTm":
          return jig.lifeTm && jig.lifeTm(_cdt());
        case "lifeTmLft":
          return jig.lifeTmLft && jig.lifeTmLft(_cdt());
        case "lifeLft":
          return jig.lifeLft && jig.lifeLft(_cdt());
        case "hasLifeTmNext":
          return jig.hasLifeTmNext && jig.hasLifeTmNext(_cdt());
        case "isGteMin":
          return jig.isGteMin && jig.isGteMin();
        case "isLtMax":
          return jig.isLtMax && jig.isLtMax();
        case "isLteMax":
          return jig.isLteMax && jig.isLteMax();
      }
      return false;
    },
  },
};