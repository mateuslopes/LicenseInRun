<template>
  <div class="home">
    <!-- <span @click="dbg()">buckets1</span> -->
    <Button
      label="Create a bucket"
      icon="pi pi-plus"
      class="p-button-raised my-2 mt-6"
      @click="onAction('new-bucket')"
    />
    <DataTable :value="filteredBuckets" responsiveLayout="scroll">
      <!-- <Column field="idx" header="#"></Column>
      <Column field="name" header="Name"></Column> -->
      <Column field="title" header="Title"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="actions" header="Can Send">
        <template #body="slotProps">
          {{
            slotProps.data.children.filter((c) =>
              canCheck(c.location, "canDsp")
            ).length
          }}
        </template>
      </Column>
      <!-- <Column field="actions" header="Canceled">
        <template #body="slotProps">
          {{
            slotProps.data.children.filter((c) =>
              canCheck(c.location, "isCnc")
            ).length
          }}
        </template>
      </Column>
      <Column field="actions" header="Expired">
        <template #body="slotProps">
          {{
            slotProps.data.children.filter((c) =>
              canCheck(c.location, "isX")
            ).length
          }}
        </template>
      </Column> -->
      <Column field="actions" header="Total">
        <template #body="slotProps">
          {{
            slotProps.data.children.length
          }}
        </template>
      </Column>
      <Column field="actions" header="User Actions">
        <template #body="slotProps">
          <Button
            v-tooltip.top="'Edit'"
            v-if="false"
            @click="onAction('edit-bucket', slotProps.data)"
            class="p-button-icon-only p-button-rounded p-button-outlined m-1"
            ><span class="pi pi-pencil"></span
          ></Button>
          <Button
            v-tooltip.top="'Open'"
            @click="onAction('open-bucket', slotProps.data)"
            class="p-button-icon-only p-button-rounded p-button-outlined m-1"
            ><span class="pi pi-eye"></span
          ></Button>
          <Button
            v-tooltip.top="'Delete'"
            @click="onAction('destroy-bucket', slotProps.data)"
            class="
              p-button-icon-only p-button-rounded p-button-outlined
              m-1
              p-button-danger
            "
            ><span class="pi pi-trash"></span
          ></Button>
          <Button
            @click="onAction('debug', slotProps.data)"
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

    <Dialog
      header="Licenses Bucket"
      v-model:visible="displays.bucket"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
    >
    
        
        <div class="p-field w-full">
          <label for="title">Bucket title</label>
          <InputText
            id="title"
            type="text"
            class="w-full p-inputtext-lg"
            aria-describedby="title-help"
            v-model="bucketModel['title']"
          />
          <small id="title-help">A title for your licenses collection.</small>
          
        </div>
      
      <div class="p-field w-full">
          <label for="description">Describe your group of licenses</label>
          <Textarea v-model="bucketModel['description']" :autoResize="true" rows="5" class="w-full" aria-describedby="descr-help" />
          <small id="descr-help">Describe more details about your licenses.</small>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showDialog('bucket', false)"
          class="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-save"
          @click="saveDialog('bucket')"
          class="p-button-success"
          autofocus
          :disabled="!canSaveBucket"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: "Bucket",
  components: {},
  data: function() {
    return {
      displays: {},
      bucketModel: {},
    };
  },
  mounted: function() {
    // console.log("Bucket mounted", this.$store, this.jigs, this.jigs.length)
    this.$store.commit("runStore/SetBucket", null);
  },
  methods: {
    showDialog(name, status) {
      this.displays[name] = status;
    },
    saveDialog(name){
      switch(name){
        case "bucket":
          if (!this.canSaveBucket) return;
          this.onAction("create-bucket", this.bucketModel)
          this.showDialog('bucket', false);
          break;
      }

    },
    dbg() {
      console.log("dbg", this, this.$store.getters["runStore/jigs"]);
    },
    canCheck(loc, funcName) {
      return this.$store.getters["runStore/checkJigFunction"](loc, funcName);
    },
    async onAction(action, payload) {
      console.log("action", action, payload);
      switch (action) {
        case "new-bucket":
          this.showDialog("bucket", true);
          break;
        case "create-bucket":
          await this.$store.dispatch("runStore/CreateBucket", payload).then(
            () => {
              this.$toast.add({
                severity: "success",
                summary: "Confirmed!",
                detail: "New licenses bucket created.",
                life: 3000,
              });
            },
            (err) => {
              this.$toast.add({
                severity: "error",
                summary: "Bucket Error!",
                detail: err.message,
                life: 3000,
              });
            }
          );

          break;
        case "open-bucket":
          await this.$store.commit("runStore/SetBucket", payload);
          this.$router.push("/bucket/" + payload.location);
          break;
        case "destroy-bucket":
          this.$confirm.require({
            message:
              "Sure to delete this bucket!!? Your licenses might be homeless.",
            header: "Bucket Delete Confirmation",
            icon: "pi pi-trash",
            acceptClass: "p-button-danger",
            accept: () => {
              this.$store
                .dispatch("runStore/DestroyBucket", payload.location)
                .then((resp) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "Confirmed",
                    detail: "License bucket deleted.",
                    life: 3000,
                  });
                });
            },
            reject: () => {
              this.$toast.add({
                severity: "success",
                summary: "Rejected!",
                detail: "Bucket license will be safe now.",
                life: 3000,
              });
            },
          });
          break;
        case "debug":
          if (action === "debug") {
            this.$store
              .dispatch("runStore/RunLoad", payload.location)
              .then((jig) => {
                jig.debug();
              });
            return;
          }
          break;
      }
    },
  },
  computed: {
    canSaveBucket(){
      return this.bucketModel.title > "" && this.bucketModel.description > ""
    },
    filteredBuckets() {
      return this.$store.getters["runStore/jigs"].filter(
        (j) => j.className == "LIN_BucketContract"
      );
    },
  },
};
</script>
