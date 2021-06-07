<template>
  <div class="home mt-6">
    <Panel header="Current Bucket" v-if="bucket">
      <p class="text-2xl">{{ bucket.title }}</p>
      <p class="text-base">{{ bucket.description }}</p>
    </Panel>

    <Button
      label="Create a License"
      icon="pi pi-plus"
      class="p-button-raised my-2 mt-6"
      @click="onAction('new-license')"
    />

    <LicensesListing :jigs="filteredLicenses" />

    <Dialog
      header="Create License"
      v-model:visible="displays['license']"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
    >
      <div class="p-grid mt-4 pb-12">
        <div class="p-col w-full">
          <label for="title" class="font-semibold">License title</label>
          <InputText
            id="title"
            type="text"
            class="w-full p-inputtext-lg"
            aria-describedby="title-help"
            v-model="licenseModel['title']"
          />
          <small id="title-help">A title for your license.</small>
        </div>
        <span class="p-col">
          <label for="title" class="font-semibold">Company Name</label>
          <InputText
            id="company"
            type="text"
            class="w-full p-inputtext-lg"
            aria-describedby="company-help"
            v-model="licenseModel['c_id']"
          />
          <!-- <small id="company-help">A company for your license.</small> -->
        </span>

        <div class="p-field w-full">
          <label for="description" class="font-semibold"
            >Describe your license</label
          >
          <Textarea
            v-model="licenseModel['description']"
            :autoResize="true"
            rows="3"
            class="w-full"
            aria-describedby="descr-help"
          />
          <small id="descr-help"
            >Describe more details about your licenses.</small
          >
        </div>

        <span class="p-field w-full">
          <label for="title" class="font-semibold"
            >Payments receiving address</label
          >
          <InputText
            id="payment-address"
            type="text"
            class="w-full p-inputtext-lg"
            aria-describedby="payment-address-help"
            v-model="licenseModel['p_ad']"
          />
          <small id="payment-address-help"
            >The address to receive all your licenses payments.</small
          >
        </span>

        <div class="p-col p-sm-6">
          <SelectButton
            v-model="licenseModel['cclb']"
            :options="cancelOptions"
            optionLabel="name"
            optionValue="value"
          />
        </div>
        <div class="p-col p-sm-6">
          <SelectButton
            v-model="licenseModel['trsf']"
            :options="transfOptions"
            optionLabel="name"
            optionValue="value"
          />
        </div>
        <div class="p-col p-sm-12">
          <label for="title" class="font-semibold">License Lifetime</label
          ><br />
          <Dropdown
            v-model="licenseModel['c_lft']"
            :options="lifetimeOptions"
            optionLabel="name"
            optionValue="value"
            class="w-full"
            placeholder="Select a lifetime option"
          />
          <small id="payment-address-help">The time between license activation and expiration date</small>
        </div>
        <div class="p-col p-sm-6">
          <label for="title" class="font-semibold">Payment Price (in satoshis)</label
          ><br />
          <InputNumber v-model="licenseModel['p_c_pr']" class="w-full" />
        </div>
        <div class="p-col p-sm-6">
          <label for="title" class="font-semibold"
            >Time added per payment</label
          ><br />

          <Dropdown
            v-model="licenseModel['p_c_tu']"
            :options="timeunitOptions"
            optionLabel="name"
            optionValue="value"
            class="w-full"
            placeholder="Select a time to be added"
          />
          <small id="payment-address-help">Each payment adds more time to the license</small>
        </div>
        
        <div class="p-col p-sm-6">
          <label for="title" class="font-semibold">Minimum payments</label
          ><br />
          <InputNumber v-model="licenseModel['p_c_min']" class="w-full" />
          <small id="payment-address-help">Minimum number of payments to activate the license</small>
        </div>
        <div class="p-col p-sm-6">
          <label for="title" class="font-semibold">Maximum payments</label
          ><br />
          <InputNumber v-model="licenseModel['p_c_max']" class="w-full" />
          <small id="payment-address-help">Unlimited number of payments if less than zero</small>
        </div>

        <div class="p-field w-full">
          <label for="payload" class="font-semibold"
            >Payload</label
          >
          <Textarea
            v-model="licenseModel['pld']"
            :autoResize="true"
            rows="2"
            class="w-full"
            aria-describedby="payload-help"
          />
          <small id="payload-help">Payload is any data text that you wish to add in your unique license.</small>
        </div>

      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showDialog('license', false)"
          class="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-save"
          @click="saveDialog('license')"
          class="p-button-success"
          autofocus
          :disabled="!canSaveLicense"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import LicensesListing from "@/components/LicensesListing.vue";

function licenseDefaults(opts){
  return Object.assign({
        title: "",
        description: "",
        c_id: "",
        p_ad: "",
        cclb: false,
        trsf: false,
        c_lft: -1,
        p_c_tu: 3600,
        p_c_pr: 100000,
        p_c_min: 1,
        p_c_max: -1,
        pld: ""
      }, opts);
}

export default {
  name: "Bucket",
  components: {
    LicensesListing,
  },
  data: function() {
    return {
      displays: {},
      licenseModel: licenseDefaults({p_ad: this.$store.getters["runStore/ownerAddress"]}),
      cancelOptions: [
        { name: "Cancellable", value: true },
        { name: "Not cancellable", value: false },
      ],
      transfOptions: [
        { name: "Transferable", value: true },
        { name: "Not transferable", value: false },
      ],
      lifetimeOptions: [
        { name: "Lifetime License (unlimited)", value: -1 },
        { name: "1 minutes", value: 1 * 60 },
        { name: "5 minutes", value: 5 * 60 },
        { name: "10 minutes", value: 10 * 60 },
        { name: "15 minutes", value: 15 * 60 },
        { name: "30 minutes", value: 30 * 60 },
        { name: "45 minutes", value: 45 * 60 },
        { name: "1 hour", value: 60 * 60 },
        { name: "2 hours", value: 2 * 3600 },
        { name: "6 hours", value: 6 * 3600 },
        { name: "12 hours", value: 12 * 3600 },
        { name: "1 day", value: 24 * 3600 },
        { name: "1 week", value: 7 * 24 * 3600 },
        { name: "2 weeks", value: 14 * 24 * 3600 },
        { name: "1 month", value: 30 * 24 * 3600 },
        { name: "3 months", value: 91 * 24 * 3600 },
        { name: "6 months", value: 182 * 24 * 3600 },
        { name: "1 year", value: 365 * 24 * 3600 },
      ],
      timeunitOptions: [
        { name: "15 seconds", value: 15 },
        { name: "30 seconds", value: 30 },
        { name: "45 seconds", value: 45 },
        { name: "1 minutes", value: 1 * 60 },
        { name: "5 minutes", value: 5 * 60 },
        { name: "10 minutes", value: 10 * 60 },
        { name: "15 minutes", value: 15 * 60 },
        { name: "30 minutes", value: 30 * 60 },
        { name: "45 minutes", value: 45 * 60 },
        { name: "1 hour", value: 60 * 60 },
        { name: "2 hours", value: 2 * 3600 },
        { name: "6 hours", value: 6 * 3600 },
        { name: "12 hours", value: 12 * 3600 },
        { name: "1 day", value: 24 * 3600 },
        { name: "1 week", value: 7 * 24 * 3600 },
        { name: "2 weeks", value: 14 * 24 * 3600 },
        { name: "1 month", value: 30 * 24 * 3600 },
        { name: "3 months", value: 91 * 24 * 3600 },
        { name: "6 months", value: 182 * 24 * 3600 },
        { name: "1 year", value: 365 * 24 * 3600 },
      ],
    };
  },
  created: function() {},
  mounted: async function() {
    const b = this.bucket;
    if (!b || b.location != this.$route.params.id) {
      this.$store.commit("runStore/SetBucket", null);
      await this.$store
        .dispatch("runStore/LoadBucket", this.$route.params.id)
        .then((bucket) => {});
    }
    //
  },
  methods: {
    showDialog(name, status) {
      this.displays[name] = status;
    },
    saveDialog(name) {
      switch (name) {
        case "license":
          if (!this.canSaveLicense) return;
          this.onAction("create-license", this.licenseModel);
          this.showDialog("license", false);
          break;
      }
    },
    async reloadJigs() {
      this.$store.dispatch("runStore/ReloadJigs").then((jigs) => {});
    },
    async onAction(action, payload) {
      // console.log("action", action, payload);
      switch (action) {
        case "new-license":
          this.showDialog("license", true);
          break;
        case "create-license":
          payload.parent_location = this.bucket.location;
          payload.p_ad = [[payload.p_ad, 1]];
          // {
          //     parent_location: this.bucket.location,
          //     templateName: "max-rounds",
          //     p_ad: [[this.purseAddress, 1]],
          //   }
          this.$store
            .dispatch("runStore/CreateLicense", payload)
            .then(
              (resp) => {
                this.licenseModel = licenseDefaults({p_ad: this.$store.getters["runStore/ownerAddress"]});
                this.$toast.add({
                  severity: "success",
                  summary: "License created!",
                  detail: "License is now waiting to be sent.",
                  life: 3000,
                });
              },
              (err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "License Error!",
                  detail: err.message,
                  life: 3000,
                });
              }
            );
          break;
      }
    },
  },
  computed: {
    canSaveLicense() {
      return this.licenseModel.title > "" 
      && this.licenseModel.description > ""
      && this.licenseModel.c_id > ""
      && this.licenseModel.p_c_pr > 546
      && this.licenseModel.p_ad > ""
      && this.licenseModel.p_c_min >= 1;
    },
    purseAddress() {
      return this.$store.getters["runStore/purseAddress"];
    },
    jigs() {
      return this.$store.getters["runStore/jigs"];
    },
    bucket() {
      return this.$store.getters["runStore/bucket"];
    },
    filteredLicenses() {
      const b = this.bucket;
      if (!b) return [];
      return this.jigs.filter(
        (j) => j.parent && j.parent.origin == this.bucket.origin
      );
    },
  },
};
</script>
