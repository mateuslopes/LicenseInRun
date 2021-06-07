<template>
  <div id="page" class="container mx-auto">
    <Toast />
    <ConfirmDialog></ConfirmDialog>

    <header id="header" class="flex flex-row justify-between pt-4">
      <div>
        <h1 class="text-4xl font-semibold">LicenseIn.Run</h1>
        <h2 class="text-xl">Run your licenses onchain, anytime and anywhere.</h2>
      </div>
    </header>

    <nav id="menubar" class="mt-2 py-2 bg-gray-700 text-white text-xl pl-4 border-b-2 border-gray-800">
      <router-link class="hover:underline pl-0 pr-3" to="/">Home</router-link> |
      <router-link class="hover:underline px-3" to="/licenses"
        >Licenses</router-link
      >
      |
      <!-- <router-link class="hover:underline px-3" to="/oldlicenses"
        >Old Licenses</router-link
      >
      | -->
      <!-- <router-link class="hover:underline px-3" to="/help">Help</router-link> | -->
      <router-link class="hover:underline px-3" to="/about">About</router-link>
    </nav>

    <section id="content">
      <router-view />
    </section>

    <footer
      class="
        w-full
        flex
        justify-center
        items-start
        bg-gray-700
        text-gray-100
        border-t-4 border-white-400
        pb-16
        pt-12
        mt-12
        border-t-2
        border-gray-800
      "
    >
      <div
        class="container flex flex-col md:flex-row justify-around items-start"
      >
        <div class="footer-col md:w-2/6">
          <blockquote class="text-lg">
            Our mission is to provide multiple kinds of licenses that lives onchain, available on everytime of every place in world.
          </blockquote>
        </div>
        
        <div class="footer-col">
          <div class="mt-4 text-left italic text-lg">
            StartedUp on <a href="https://run.network/" target="_blank">Run Hackathon</a> © 2021<br />
            Powered by <a href="https://bitcoinsv.com/" target="_blank">Bitcoin Satoshi Vision</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>


<script>
import ConfirmDialog from "primevue/confirmdialog";
export default {
  name: "App",
  components: {
    ConfirmDialog: ConfirmDialog,
  },
  // mounted() {}
};
</script>

<style lang="scss">
#content{
  min-height: 600px !important;
}
</style>
