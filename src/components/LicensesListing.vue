<template>
  <div class="licenses-listing">
    
    <DataTable :value="jigs" responsiveLayout="scroll">
      <!-- <Column field="name" header="Name"></Column> -->
      <Column field="title" header="Title"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="expired" header="Expired">
        <template #body="slotProps">
          {{ canCheck(slotProps.data.location, "isX") }}
        </template>
      </Column>
      <Column field="valid" header="Is Valid?">
        <template #body="slotProps">
          {{ canCheck(slotProps.data.location, "isVld") }}
        </template>
      </Column>
      <Column field="lifetimeLeft" header="Time to expire">
        <template #body="slotProps">
          {{ canCheck(slotProps.data.location, "lifeTmLft") }}
        </template>
      </Column>
      <Column field="lifeLeft" header="Valid time available">
        <template #body="slotProps">
          {{ canCheck(slotProps.data.location, "lifeLft") }}
        </template>
      </Column>
      <Column field="satoshis" header="Satoshis"></Column>
      <Column field="actions" header="User Actions">
        <template #body="slotProps">
          <Button v-if="slotProps.data.className != 'LIN_Payment'"
            v-tooltip.top="'Open License'"
            @click="onChildAction('open-license', slotProps.data)"
            class="p-button-icon-only p-button-rounded p-button-outlined m-1"
            ><span class="pi pi-eye"></span
          ></Button>
          <Button
            v-if="canCheck(slotProps.data.location, 'canDsp')"
            v-tooltip.top="'Send'"
            @click="onChildAction('dispatch', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-success
            "
            ><span class="pi pi-send"></span
          ></Button>
          <Button
            v-if="canCheck(slotProps.data.location, 'canP')"
            v-tooltip.top="'Pay'"
            @click="onChildAction('pay', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-success
            "
            ><span class="pi pi-money-bill"></span
          ></Button>
          <Button
            v-if="canCheck(slotProps.data.location, 'canDep')"
            v-tooltip.top="'Deposit Funds'"
            @click="onChildAction('deposit', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-success
            "
            ><span class="pi pi-arrow-up"></span
          ></Button>
          
          <Button
            v-if="slotProps.data.className == 'LIN_Payment'"
            v-tooltip.top="'Redeem Payment'"
            @click="onChildAction('redeem', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-success
            "
            ><span class="pi pi-dollar"></span
          ></Button>
          <Button
            v-if="canCheck(slotProps.data.location, 'canW')"
            v-tooltip.top="'Withdraw'"
            @click="onChildAction('withdraw', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-warning
            "
            ><span class="pi pi-arrow-down"></span
          ></Button>
          <Button
            v-if="canCheck(slotProps.data.location, 'canA')"
            v-tooltip.top="'Activate License'"
            @click="onChildAction('activate', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-primary
            "
            ><span class="pi pi-check-circle"></span
          ></Button>

          <Button
            v-if="canCheck(slotProps.data.location, 'canCnc')"
            v-tooltip.top="'Cancel'"
            @click="onChildAction('cancel', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-danger
            "
            ><span class="pi pi-times"></span
          ></Button>
          <Button
            v-if="false"
            @click="onChildAction('destroy', slotProps.data)"
            v-tooltip.top="'Delete'"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-danger
            "
            ><span class="pi pi-trash"></span
          ></Button>
          <Button
            v-if="slotProps.data.className != 'LIN_Payment' && !(canCheck(slotProps.data.location, 'isParOwn'))"
            @click="onChildAction('returnOwner', slotProps.data)"
            v-tooltip.top="'Return to creator'"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-danger
            "
            ><span class="pi pi-backward"></span
          ></Button>
          <Button
            @click="onChildAction('debug', slotProps.data)"
            v-tooltip.top="'Debug'"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-info
            "
            ><span class="pi pi-info"></span
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  name: "LicensesListing",
  props: {
    jigs: {
      type: Array,
      default: []
    }
  },
  methods: {
    async reloadJigs() {
      this.$store.dispatch("runStore/ReloadJigs").then((jigs) => {});
    },
    canCheck(loc, funcName) {
      return this.$store.getters["runStore/checkJigFunction"](loc, funcName);
    },
    async onChildAction(action, jigData) {
      const cdt = Math.floor(Date.now() / 1000);
      console.log("onChildAction", action, jigData, jigData.location)
      if (action === "debug") {
        this.$store
          .dispatch("runStore/RunLoad", jigData.location)
          .then((jig) => {
            jig.debug(cdt);
            jig.debug2(cdt);
          });
        return;
      }
      
      const jig = this.$store.getters["runStore/GetJigLoc"](jigData.location);
      await jig.sync();

      switch (action) {
        case "open-license":
          this.$router.push('/license/'+jig.location);
          break;
        case "dispatch":
          let own_addr = window.prompt("New owner address:");
          if (own_addr > "") {
            this.$confirm.require({
              message: "Confirm sending this license to " + own_addr + " ?",
              header: "Send license confirmation",
              icon: "pi pi-send",
              acceptClass: "p-button-success",
              accept: () => {
                this.$store
                  .dispatch("runStore/DispatchLicense", {location: jig.location, address: own_addr})
                  .then(
                    (resp) => {
                      this.$toast.add({
                        severity: "success",
                        summary: "License sent!",
                        detail: "License is now waiting for payments.",
                        life: 3000,
                      });
                    },
                    (err) => {
                      this.$toast.add({
                        severity: "error",
                        summary: "License error!",
                        detail: err.message,
                        life: 3000,
                      });
                    }
                  );
              },
            });
          }
          break;
        case "export":
          const opts = jig.exp();
          opts.c_at = cdt;
          console.log("export opts", opts);
          break;
        case "deposit":
          const amount = parseInt(
            window.prompt("Type the deposit amount:"),
            10
          );
          
          this.$store.dispatch("runStore/DepositLicense", {location: jig.location, amount: amount}).then(
              (resp) => {
                this.$toast.add({
                  severity: "success",
                  summary: "Deposited "+amount+" satoshis!",
                  detail: "",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "Deposit error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
        case "redeem":
          console.log("Redeem", jig)
          this.$store.dispatch("runStore/RedeemPayment", jig.location).then(
              (resp) => {
                this.$toast.add({
                  severity: "success",
                  summary: "Payment redeemed!",
                  detail: "",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "Redeem error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
        case "withdraw":
          // const amount = parseInt(
          //   window.prompt("Type the withdraw amount:"),
          //   10
          // );
          this.$store.dispatch("runStore/WithdrawLicense", {location: jig.location}).then(
              (resp) => {
                this.$toast.add({
                  severity: "success",
                  summary: "Withdrawed unlocked satoshis!",
                  detail: "",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "Withdraw error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
        case "activate":
          // TODO: Better activation payload
          this.$store.dispatch("runStore/ActivateLicense", {location: jig.location}).then(
              (resp) => {
                this.$toast.add({
                  severity: "success",
                  summary: "License activated!",
                  detail: "",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "Activation error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
        case "cancel":
          this.$confirm.require({
            message: "Are you sure to cancel this license?",
            header: "Cancel license confirmation",
            icon: "pi pi-times",
            acceptClass: "p-button-danger",
            accept: () => {
              this.$store.dispatch("runStore/CancelLicense", jig.location).then(
                (resp) => {
                  this.$toast.add({
                    severity: "success",
                    summary: "License cancelled!",
                    detail: "",
                    life: 3000,
                  });
                },
                (err) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "Cancel error!",
                    detail: err.message,
                    life: 3000,
                  });
                }
              );
            },
          });

          break;
        case "pay":
          this.$store.dispatch("runStore/PayLicense", {location: jig.location}).then(
              (resp) => {
                this.$toast.add({
                  severity: "success",
                  summary: "License paid!",
                  detail: "",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "Payment error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
        case "send":
          let own_addr2 = window.prompt("New owner address:");
          if (own_addr2 > "") {
            this.$confirm.require({
              message: "Confirm sending this license to " + own_addr2 + " ?",
              header: "Send license confirmation",
              icon: "pi pi-send",
              acceptClass: "p-button-success",
              accept: () => {
                this.$store
                  .dispatch("runStore/SendLicense", {location: jig.location, address: own_addr2})
                  .then(
                    (resp) => {
                      this.$toast.add({
                        severity: "success",
                        summary: "License sent!",
                        detail: "",
                        life: 3000,
                      });
                    },
                    (err) => {
                      this.$toast.add({
                        severity: "error",
                        summary: "Send license error!",
                        detail: err.message,
                        life: 3000,
                      });
                    }
                  );
              },
            });
          }
          break;
        case "destroy":
          this.$confirm.require({
            message:
              "Sure to delete this license? This operation is irreversible.",
            header: "Delete license confirmation",
            icon: "pi pi-trash",
            acceptClass: "p-button-danger",
            accept: () => {
              this.$store
                .dispatch("runStore/DestroyLicense", jig.location)
                .then((resp) => {
                  this.$toast.add({
                    severity: "success",
                    summary: "Confirmed",
                    detail: "License deleted.",
                    life: 3000,
                  });
                }, (err) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "Delete license error!",
                    detail: err.message,
                    life: 3000,
                  });
                });
            },
          });
          break;
        case "returnOwner":
          this.$confirm.require({
            message: "Are you sure to return this license to the creator?",
            header: "Return license confirmation",
            icon: "pi pi-times",
            acceptClass: "p-button-danger",
            accept: () => {
              this.$store.dispatch("runStore/ReturnOwnerLicense", jig.location).then(
                (resp) => {
                  this.$toast.add({
                    severity: "success",
                    summary: "License returned to the creator!",
                    detail: "",
                    life: 3000,
                  });
                },
                (err) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "Return license error!",
                    detail: err.message,
                    life: 3000,
                  });
                }
              );
            },
          });
          break;
      }
    },
  },
  computed: {},
};
</script>
