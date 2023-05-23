const SimpleContract2 = artifacts.require("SimpleContract2");

module.exports = function (deployer) {
  deployer.deploy(SimpleContract2, [1, 2, 3]);
};
