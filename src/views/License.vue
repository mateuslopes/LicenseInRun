<template>
  <div class="license">
    LICENSE
  </div>
</template>

<script>
export default {
  name: "License",
  components: {},
  data: function () {
    return {};
  },
  created: function () {},
  mounted: async function () {
    const b = this.bucket;
    if (!b || b.location != this.$route.params.id) {
      this.$store.commit("runStore/SetBucket", null);
      await this.$store
        .dispatch("runStore/LoadLicense", this.$route.params.id)
        .then((license) => {
          console.log("lic load", license)
        });
    }
    //
  },
  methods: {
    async reloadJigs() {
      this.$store.dispatch("runStore/ReloadJigs").then((jigs) => {});
    },
    async onAction(action, payload) {
      // console.log("action", action, payload);
      switch (action) {
        case "create-license":
          // this.$store
          //   .dispatch("runStore/CreateLicense", {
          //     parent_location: this.bucket.location,
          //     templateName: "max-rounds",
          //     p_ad: [[this.purseAddress, 1]],
          //   })
          //   .then(
          //     (resp) => {
          //       this.$toast.add({
          //         severity: "success",
          //         summary: "License created!",
          //         detail: "License is now waiting to be sent.",
          //         life: 3000,
          //       });
          //     },
          //     (err) => {
          //       this.$toast.add({
          //         severity: "error",
          //         summary: "License Error!",
          //         detail: err.message,
          //         life: 3000,
          //       });
          //     }
          //   );
          break;
      }
    },
  },
  computed: {
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
