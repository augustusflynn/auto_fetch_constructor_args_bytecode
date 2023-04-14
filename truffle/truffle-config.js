const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {


    oasys_testnet: {

      provider: () => new HDWalletProvider(

        "50fbb089651e93a172c3ea7ae399c3230571996fa6cedc3cbb77cfb9a93f4e86",

        `https://rpc.testnet.oasys.games/`

      ),

      network_id: 9372,   // This network is yours, in the cloud.

      confirmations: 10,

      networkCheckTimeout: 1000000,

      timeoutBlocks: 100000,

      skipDryRun: true,

    },

    tcgv_testnet: {

      provider: () => new HDWalletProvider(

        "50fbb089651e93a172c3ea7ae399c3230571996fa6cedc3cbb77cfb9a93f4e86",

        `https://testnet.rpc.tcgverse.xyz/`

      ),

      network_id: 12005,   // This network is yours, in the cloud.

      confirmations: 10,

      networkCheckTimeout: 1000000,

      timeoutBlocks: 100000,

      skipDryRun: true,

    },

    homev_testnet: {

      provider: () => new HDWalletProvider(

        "50fbb089651e93a172c3ea7ae399c3230571996fa6cedc3cbb77cfb9a93f4e86",

        `https://rpc.testnet.oasys.homeverse.games/`

      ),

      network_id: 40875,   // This network is yours, in the cloud.

      confirmations: 10,

      networkCheckTimeout: 1000000,

      timeoutBlocks: 100000,

      skipDryRun: true,

    },

    saakuv_testnet: {

      provider: () => new HDWalletProvider(

        "50fbb089651e93a172c3ea7ae399c3230571996fa6cedc3cbb77cfb9a93f4e86",

        `https://rpc-testnet.saakuru.network`

      ),

      network_id: 247253,   // This network is yours, in the cloud.

      confirmations: 10,

      networkCheckTimeout: 1000000,

      timeoutBlocks: 100000,

      skipDryRun: true,

    },

    oasys_mainnet: {

      provider: () => new HDWalletProvider(

        "c95e15ffa7265ef4cdbf2db261404ed7e9bdcd9d6f3c1e8605aabcd55c92fb12",

        `https://rpc.mainnet.oasys.games/`

      ),

      network_id: 248,   // This network is yours, in the cloud.

      confirmations: 10,

      networkCheckTimeout: 1000000,

      timeoutBlocks: 100000,

      skipDryRun: true,

    }

  },

  mocha: {  },

  compilers: {

    solc: {

      version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)

      settings: {          // See the solidity docs for advice about optimization and evmVersion

        // optimizer: {

        //   enabled: false,

        //   runs: 200

        // },

        //  evmVersion: "byzantium"

        // }

      }

    }

  }

};