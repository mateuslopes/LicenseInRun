# LicenseIn.Run
## Run your licenses onchain, anytime and anywhere.

The first NFL (Non Fungible Licenses) service, based on NFTs that provides new ways on licensing almost anything.

The project generates a testnet wallet automatically and saves it in the local storage.

I did not have the time to encrypt the seed on local storage, and neither the time to implement better deposit and withdraw functions, and also the option to save the seeds and all these security features. But, that will all be done very soon.

I also did not implemented the API for now, because I tried to focus more on Run plataform, so, I've tried to do the initial prove of concept using only a frontend and Bsv/Run as the backend infraestructure.

Sorry for this brief text. I will make more detailed instructions after I sleep.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Schema
Issuer
    create license bucket
        crud license
            dispatch
            validate

Receiver
    request a license
    activate
    pay
    transfer
    cancel
    verify
