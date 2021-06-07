<template>
  <div class="help">
    <Card>
      <template #header>
        <img
          alt="user header"
          src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
          style="max-height: 100px"
        />
      </template>
      <template #title> HELP </template>
      <template #content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </template>
      <template #footer>
        <Button icon="pi pi-check" label="Save" />
        <Button
          icon="pi pi-times"
          label="Cancel"
          class="p-button-secondary"
          style="margin-left: 0.5em"
        />
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  name: "Help",
  components: {},
  data: function () {
    return {};
  },
  created: () => {
    // console.log("home created")
  },
};
</script>
