<template>
  <div class="home">
    <Card>
      <template #content>
        <div class="text-center">
          <div>
            <h1 class="text-3xl mb-0">Welcome to</h1>
            <h1 class="text-7xl font-bold mb-0">LicenseIn</h1>
          </div>
          <blockquote
            class="
              py-4
              text-5xl
              w-full
              bg-blue-200
              text-gray-700
              my-8
              shadow-xl
            "
          >
            Run your licenses onchain,<br />
            anytime and anywhere.
          </blockquote>

          <h2 class="text-4xl bold w-10/12 mx-auto">
            The first NFL (Non Fungible Licenses) service, based on NFTs that provides new ways on licensing almost anything.
          </h2>
          <!-- <p class="py-6 text-2xl"></p> -->
        </div>
      </template>
    </Card>

    <div class="p-grid">
      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>License Buckets</template>
        <template #content
          ><div class="text-lg">
            Create licenses that are grouped into buckets that helps you
            organize and maintain track of your licenses.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-green-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-check-circle" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">On Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Time Based Licenses</template>
        <template #content
          ><div class="text-lg">
            Control parameters like your licenses lifetime and how much time you
            will add to them on each new payment.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-green-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-check-circle" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">On Run Hackathon</span>
          </div>
        </template>
      </Card>
      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Rounds Based Licenses</template>
        <template #content
          ><div class="text-lg">
            Create licenses with minimum payment to activate. Create licenses
            with maximum payments. Control exactly how much you want to offer.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-green-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-check-circle" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">On Run Hackathon</span>
          </div>
        </template>
      </Card>
      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Cancellable?</template>
        <template #content
          ><div class="text-lg">
            If you wish, you can configure your licenses to be cancellable or
            not.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-green-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-check-circle" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">On Run Hackathon</span>
          </div>
        </template>
      </Card>
      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Transferable?</template>
        <template #content
          ><div class="text-lg">
            If you wish, you can configure your licenses to be transferable and
            sellable, or just a unique property of the original buyer.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-green-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-check-circle" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">On Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>License Wallet Server Keys</template>
        <template #content
          ><div class="text-lg">
            So we can create, send, pay and control your licenses while you
            sleep.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-red-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-calendar" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">After Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>API Integration</template>
        <template #content
          ><div class="text-lg">
            Integrate our licenses with any software, IoT device, or any other
            device that can connect to the internet and make requests.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-red-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-calendar" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">After Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Split Payments</template>
        <template #content
          ><div class="text-lg">
            Split your license payments into multiple address and share or
            organize your income flow like you wish.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-red-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-calendar" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">After Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="p-sm-4 mt-4">
        <template #header>
          <img
            alt="user header"
            src="https://primefaces.org/primevue/showcase/demo/images/usercard.png"
            style="max-height: 100px"
          />
        </template>
        <template #title>Realtime Licenses</template>
        <template #content
          ><div class="text-lg">
            Use websockets to connect two or more people sharing and verifying
            their licenses while they sell their services ondemand.
          </div></template
        >
        <template #footer>
          <div class="text-center w-full text-red-600 pt-2">
            <div class="mb-2-2">
              <i class="pi pi-calendar" style="fontsize: 2rem"></i>
            </div>
            <span class="text-lg font-bold">After Run Hackathon</span>
          </div>
        </template>
      </Card>

      <Card class="my-12 pb-12 w-full">
        <template #content>
          <div class="text-center w-full">
            <h1 class="text-6xl font-semibold mb-4">
              And that, is just the beginning...
            </h1>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data: function () {
    return {};
  },
  created: () => {
    // console.log("home created")
  },
};
</script>
