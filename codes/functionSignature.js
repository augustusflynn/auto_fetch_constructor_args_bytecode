const { toUtf8Bytes, keccak256 } = require("ethers/lib/utils")

console.log(keccak256(toUtf8Bytes('deprecate(address)')).slice(0, 11))