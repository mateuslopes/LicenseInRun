<template>
  <div class="inbox">
    <LicensesListing :jigs="inboxLicenses" />
  </div>
</template>

<script>
import LicensesListing from "@/components/LicensesListing.vue";

export default {
  name: "Inbox",
  components: {
    LicensesListing,
  },
  data: function() {
    return {};
  },
  mounted: function(){
    this.$store.commit("runStore/SetBucket", null);
  },
  methods: {
    dbg() {
      console.log("dbg", this, this.$store.getters["runStore/jigs"]);
    },
    async reloadJigs() {
      this.$store.dispatch("runStore/ReloadJigs").then((jigs) => {});
    },
    async onAction(action, payload) {
      // console.log("action", action, payload);
      switch (action) {
        case "create-license":
          this.$store
            .dispatch("runStore/CreateLicense", {
              parent_location: this.bucket.location,
              templateName: "max-rounds",
              p_ad: [[this.purseAddress, 1]],
            })
            .then(
              (resp) => {
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
    inboxLicenses() {
      return this.$store.getters["runStore/GetInbox"] || [];
    },
    activeLicenses() {
      return this.$store.getters["runStore/GetActive"] || [];
    },
  },
};
</script>
