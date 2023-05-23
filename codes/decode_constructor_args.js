const { ethers } = require("ethers");

const Log = console.info
// Replace with the deployed bytecode of the contract you want to decode
const CONTRACT_CREATION_BYTECODE = '0x608060405234801561001057600080fd5b506040516101683803806101688339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b60b3806100b56000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80630dbe671f14602d575b600080fd5b60336047565b604051603e91906064565b60405180910390f35b60005481565b6000819050919050565b605e81604d565b82525050565b6000602082019050607760008301846057565b9291505056fea26469706673582212201e890a9199ed3743a2cc3ca86f7a0980c1e36a49e9e8b757d26c3c9cbdc206b464736f6c634300080b00330000000000000000000000000000000000000000000000000000000000000001'

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "a_",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "a",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
const address = '0xf8dD17b02ae10979AFAE110680B36155261Ae99c'
// Create an ethers provider pointing to the network where the contract was deployed
const provider = new ethers.providers.JsonRpcProvider("https://testnet.rpc.tcgverse.xyz/");

// ==============================================================================================

function parseDecoded(toParse) {
  const typeLength = TYPE.split(",").length;
  const parsed = Object.keys(toParse).map(function (id) {
    const d = toParse[id];
    return (typeof d === "object" && d.length !== undefined) ?
      JSON.stringify(parseDecoded(d)).replace(/"/g, "")
      :
      d.toString();
  });
  //Quick fix to hide array length
  //TODO write more elegant solution
  if (parsed.length > typeLength && parsed[parsed.length - 1] && Number(parsed[parsed.length - 1]).toString() === parsed[parsed.length - 1]) {
    parsed.splice(parsed.length - 1, 1);
  }
  return parsed;
}

function matchRegExpValues(values) {
  const regEx = new RegExp(/(\[[0-9a-z\s:!@#'",$%^&?*)(\\+=._-]+,?\],?|("[0-9a-z\s:!@#'$%^&?*)(\\+=.,_-]+",?|"",?)|([0-9a-z\s:!@#'$%^&?*)(\\/+=._-]+,?|,))/gi);
  const matched = values.match(regEx);

  if (values[values.length - 1] === ",") {
    matched.push("");
  }
  return matched;
}

function testStringRegExpValues(values) {
  const regEx = new RegExp(/^".*"$/gi);
  return regEx.test(values);
}

function testRegExpValues(values) {
  const regEx = new RegExp(/(,+)/gi);
  return regEx.test(values);
}

function testArrayRegExpValues(values) {
  const regEx = new RegExp(/\[.*\]/gi);
  return regEx.test(values);
}

function stripArray(value) {
  const regEx = new RegExp(/^\[|\]$/gi);
  return value.replace(regEx, "");
}

function parseForEncode(values) {
  const matched = matchRegExpValues(values);

  return matched ?
    matched.map((val) => {
      let overlook = false;
      let snoop = false;

      if (!val || val === ",") {
        return "";
      }
      if (val[val.length - 1] === ",") {
        val = val.substring(0, val.length - 1);
      }
      if (val && testArrayRegExpValues(val)) {
        val = stripArray(val);
        snoop = true;
      }
      if (testStringRegExpValues(val)) {
        val = val.substring(1, val.length - 1);
        overlook = true;
      }
      if (snoop || (!overlook && testRegExpValues(val))) {
        val = parseForEncode(val);
      }
      return val;
    }) : [];
}

// ==============================================================================
const Eth = require('web3-eth')
const eth = new Eth('https://testnet.rpc.tcgverse.xyz/')
const web3AbiCoder = eth.abi

const TYPE = 'uint256'
const ENCODED_VALUE = '000000000000000000000000000000000000000000000000000000174876e800000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a546574686572205553440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045553445400000000000000000000000000000000000000000000000000000000'
const VALUE = '1324234324'


/**
 * 
 * @param {*} types_ "uint256,string,address"
 * @param {*} value_ "0x0000000000000000000000000000010234234324..0000345345"
 * @returns 
 */
function decodeData(types_, value_) {
  try {
    let types = types_.split(",");
    let value = value_;

    if (!value.startsWith("0x"))
      value = "0x" + value;

    Log(types);
    Log(value)

    let decoded = web3AbiCoder.decodeParameters(types, value);

    decoded = parseDecoded(decoded);
    Log(decoded);
    return decoded
  }
  catch (e) {
    throw new Error(e);
  }
}


/**
 * 
 * @param {*} types_ "uint256,string,address"
 * @param {*} value_ "2,asdasd,0x000...000"
 * @returns 
 */
function encodeData(types_, value_) {
  try {
    let types = types_.split(",");
    let values = parseForEncode(value_);

    Log(types, values);

    if (types.length !== values.length)
      throw new Error("Types/values mismatch");

    let encoded = web3AbiCoder.encodeParameters(types, values);
    Log(encoded);
    return encoded;
  }
  catch (e) {
    throw new Error(e);
  }
}

// =================================================================

/**
 * STEP1: try decode constructor args to get length of constructor args bytecode
 * STEP2: get the real constructor args bytecode in contract creation bytecode
 * STEP3: save & decode
 */


const constructorAbi = abi.find(_func => _func.type === 'constructor')
const inputTypes = constructorAbi.inputs.map(_inp => _inp.internalType).join(',')
// TODO LATER
const inputValue = "1"

const constructorArgsBytecodeLength = encodeData(inputTypes, inputValue).replace('0x', '').length
const realConstructorArgsBytecode = CONTRACT_CREATION_BYTECODE.slice(
  CONTRACT_CREATION_BYTECODE.length - constructorArgsBytecodeLength,
  CONTRACT_CREATION_BYTECODE.length
)

decodeData(inputTypes, `0x${realConstructorArgsBytecode}`)
