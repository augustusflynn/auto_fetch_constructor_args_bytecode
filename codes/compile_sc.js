
function _inputFormatter(setting) {
  const input = {
    language: 'Solidity',
    sources: {
      //   'test.sol': {
      //     content: 'contract C { function f() public { } }'
      //   }
    },
    settings: {
      // optimizer: {
      //   enabled: false,
      //   runs: 200
      // },
      // evmVersion: 'london',
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  // check xem co import nhieu source ko
  const importFile = setting.source.match(/\/\/\sFile:\s+.*\.sol\s?/g)
  if (importFile && importFile.length > 0) {
    for (let i = 0; i < importFile.length - 1; i++) {
      const startIndex = setting.source.indexOf(importFile[i])
      const endIndex = setting.source.indexOf(importFile[i + 1])

      // File: @openzeppelin/contracts/token/ERC20/IERC20.sol -> @openzeppelin/contracts/token/ERC20/IERC20.sol
      const fileName = importFile[i].replace('// File: ', '').replace('\r', '')
      let fileContent = setting.source.substring(startIndex, endIndex)
      // remove "// File: @openzeppelin/contracts/token/ERC20/IERC20.sol" at first
      fileContent = fileContent.replace(importFile[i], '')
      input.sources[fileName] = {
        content: `
        // SPDX-License-Identifier: MIT
        ${fileContent}
        `
      }
    }

    let mainFileContent = setting.source.substring(
      setting.source.indexOf(importFile[importFile.length - 1]),
      setting.source.length
    )
    mainFileContent = mainFileContent.replace(importFile[importFile.length - 1], '').replace('\r', '')

    input.sources[`${setting.prefix}${setting.contract_name}.sol`] = {
      content: mainFileContent
    }
  } else {
    input.sources[`${setting.prefix}${setting.contract_name}.sol`] = {
      content: setting.source
    }
  }

  if (setting.optimization_runs) {
    input.settings.optimizer = {
      enabled: true,
      runs: inputData.optimization_runs
    }
  }

  if (setting.evm_version) {
    input.settings.evmVersion = setting.evm_version
  }

  return input
}

async function compileUsingSolc(
  {
    deployed_bytecode,
    compiler_version,
    source,
    evm_version,
    contract_name
  },
  {
    testcaseName
  }
) {
  const solc = require('solc');
  solc.loadRemoteVersion(compiler_version, function (err, solcSnapshot) {
    if (err) {
      console.error(`solc loads compiler version ${compiler_version} failed: `, err)
      return
    }

    let contractData
    const TRY_LIST = ['project:/contracts/']
    for (const _case of TRY_LIST) {
      const input = _inputFormatter({ compiler_version, source, evm_version, contract_name, prefix: _case })
      const output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));
      console.log(output.contracts['project:/contracts/Contract1.sol']['Contract1']);
      const keys = Object.keys(output.contracts)
      const _contractName = keys[keys.length - 1]
      const _contractData = output.contracts[_contractName][_contractName.replace(/(\.sol|project:\/|contracts\/)/gi, '')]

      if (_contractData.evm.deployedBytecode.object === deployed_bytecode) {
        contractData = _contractData;
        break;
      }
    }
    console.info(`Testing - ${testcaseName}`)
    console.info(`Result: ${!!contractData ? "Pass" : "Failed"}`)
    console.info(`====================================================`)
  });
}

async function main(testcases) {
  for (const testcase of testcases) {
    compileUsingSolc(
      testcase.data,
      { testcaseName: testcase.name }
    )
  }
}

const TESTCASE = [
  {
    name: 'Compile Contract1 using Truffle',
    data: {
      deployed_bytecode: '608060405234801561001057600080fd5b506004361061002b5760003560e01c80636814beb714610030575b600080fd5b61003861004e565b6040516100459190610124565b60405180910390f35b60606040518060400160405280600d81526020017f48656c6c6f2c20576f726c642100000000000000000000000000000000000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b838110156100c55780820151818401526020810190506100aa565b838111156100d4576000848401525b50505050565b6000601f19601f8301169050919050565b60006100f68261008b565b6101008185610096565b93506101108185602086016100a7565b610119816100da565b840191505092915050565b6000602082019050818103600083015261013e81846100eb565b90509291505056fea2646970667358221220bb588511d3bff13f55e71bc27ab3b551cb2f19d27f7c088d1b03032cd2648c2964736f6c634300080b0033',
      contract_name: "Contract1",
      compiler_version: 'v0.8.11+commit.d7f03943',
      source: " // SPDX-License-Identifier: MIT\npragma solidity ^0.8.11;\n\ncontract Contract1 {\n  function greeter1() public pure returns (string memory) {\n    return \"Hello, World!\";\n  }\n}",
      evm_version: "london"
    }
  }
]

main(TESTCASE)