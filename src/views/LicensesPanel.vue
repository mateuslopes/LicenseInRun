<template>
  <div id="licenses" class="">
    <section
      id="wallet"
      class="
        flex flex-col
        sm:flex-row
        justify-around
        bg-gray-200
        border-b border-black
        shadow-lg
      "
    >
      <div
        class="
          w-full
          sm:w-1/2
          flex flex-row
          justify-center
          sm:justify-start
          items-center
          py-3
        "
      >
        <div class="px-2 pt-1">
          <span></span> <span class="pi pi-user"></span>
        </div>
        <div class="pl-2 text-base sm:text-sm md:text-lg">
          <span id="owner-address">{{ currentOwnerAddress }}</span>
        </div>
        <div class="pr-2">
          <Button class="p-button-icon-only p-button-rounded p-button-text"
            ><span @click="copyOwnerAddress()" class="pi pi-copy"></span
          ></Button>
        </div>
      </div>

      <!-- <div class="class"></div> -->
      <div
        class="
          w-full
          sm:w-1/2
          flex flex-row
          justify-around
          sm:justify-end
          py-3
          md:text-lg
        "
      >
        <div class="px-2 pt-2">
          <span class="pi pi-dollar"></span> {{ currentBalance }}
        </div>
        <div class="px-2 pt-2">
          <a class="hover:underline" @click="doDeposit()">Deposit</a>
        </div>
        <div class="px-2 pt-2">
          <a class="hover:underline" @click="doWithdraw()">Withdraw</a>
        </div>
        <div class="px-2 pt-1">
          <Button
            @click="doUpdateBalance()"
            class="p-button-icon-only p-button-rounded p-button-text"
            ><span class="pi pi-refresh"></span
          ></Button>
        </div>
      </div>
    </section>
    <section id="buckets px-4">
      <h2 class="text-4xl my-4">Manage Your Licenses</h2>
      <div>
        <TabMenu :model="filteredTabs" :exact="true">
          <!-- <template #item="{item}">
                <a :href="item.url" class="p-4 border-r-2 border-gray-300 hover:underline">{{item.label}}</a>
            </template> -->
        </TabMenu>
        <router-view />
      </div>
    </section>
  </div>

    <Dialog
      header="Deposit"
      v-model:visible="displays['deposit']"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
    >
      <div>
       <div class="mb-6">Make a very small deposit to this address just to be able 
         experiment. Remember, this is just a startint project. 
         We are not responsible for any losses you
          might have using this app.</div>

          <div id="qrcode" class="w-full mx-auto text-center ml-24"></div>

          <div class="mt-6 text-center w-full text-lg font-semibold">Purse address</div>
          <div class="mt-1 text-center w-full text-xl">{{purseAddress}}</div>
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          @click="showDialog('deposit', false)"
          class="p-button-text"
        />
      </template>
    </Dialog>
</template>

<script>
import useRunManager from "@/libs/compose/run-comp.js";
import * as QRCode from "easyqrcodejs";

export default {
  name: "LicensesPanel",
  components: {},
  data: function() {
    return {
      QrCode: null,
      qrcodeOptions: function() {
        return {
          text: this.purseAddress
        };
      },
      displays: {},
      localTabs: [
        { label: "LicenseIn Box", icon: "pi pi-fw pi-inbox", to: "/inbox" },
        { label: "Buckets", icon: "pi pi-fw pi-home", to: "/licenses" },
        { label: "Licenses", icon: "pi pi-fw pi-calendar", to: "/bucket" },
        // { label: "Payments", icon: "pi pi-fw pi-pencil", to: "/payments" },
        // { label: "Canceled", icon: "pi pi-fw pi-file", to: "/cancelled" }
      ],
    };
  },
  setup() {
    return {
      ...useRunManager(),
    };
  },
  // created: async function() {},
  mounted: async function() {},
  methods: {
    copyOwnerAddress() {
      /* Get the text field */
      var copyText = document.getElementById("myInput");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand("copy");

      /* Alert the copied text */
      return copyText.value;
    },
    doUpdateBalance() {
      this.$store.dispatch("runStore/UpdateBalance").then((resp) => {
        console.log("Balance updated", resp);
      });
    },
    doDeposit() {
      this.showDialog('deposit',true)
      if (!this.QrCode) {
        this.$nextTick();
        setTimeout(
          function() {
            const el = document.getElementById("qrcode");
            this.QrCode = new QRCode(el, this.qrcodeOptions());
          }.bind(this),
          1
        );
      }
    },
    doWithdraw() {
      this.$store.dispatch("runStore/WithdrawAccount").then(
        (resp) => {
        console.log("WithdrawAccount", resp);
        this.$toast.add({
                    severity: "success",
                    summary: "Confirmed",
                    detail: "Withdraw completed.",
                    life: 3000,
                  });
      },(err) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "Withdraw error!",
                    detail: err.message,
                    life: 3000,
                  });
                }
      
      );
    },
    showDialog(name, status) {
      this.displays[name] = status;
    },
    async reloadJigs() {
      this.$store.dispatch("runStore/ReloadJigs").then((jigs) => {
        console.log("Jigs Reloaded", jigs);
      });
    },
    // async onAction(action, payload) {
    //   console.log("action", action);
    //   switch (action) {
    //     case "create-bucket":
    //       await this.createBucket();
    //       break;
    //   }
    // },
  },
  computed: {
    purseAddress() {
      return this.$store.getters["runStore/purseAddress"];
    },
    currentBalance() {
      return this.$store.getters["runStore/balance"];
    },
    currentOwnerAddress() {
      return this.$store.getters["runStore/ownerAddress"];
    },
    filteredTabs() {
      const bucket = this.$store.getters["runStore/bucket"];
      const tabs = [];
      const countInbox = this.$store.getters["runStore/GetInbox"].length;
      if (bucket) {
        this.localTabs.forEach((tab, idx) => {
          const newTab = Object.assign({}, tab);
          if (idx == 0) {
            newTab.label = "LicenseIn Box (" + countInbox + ")";
          } else if (idx > 1) {
            newTab.to += "/" + bucket.location;
          }
          // console.log(idx, bucket.owner, this.currentOwnerAddress)
          if (
            idx != 2 ||
            (idx == 2 && bucket.owner === this.currentOwnerAddress)
          ) {
            tabs.push(newTab);
          }
        });
      } else {
        tabs.push(
          Object.assign({}, this.localTabs[0], {
            label: "LicenseIn Box (" + countInbox + ")",
          })
        );
        tabs.push(Object.assign({}, this.localTabs[1]));
      }
      return tabs;
    },
  },
};
</script>
