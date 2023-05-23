const SimpleContract1 = artifacts.require("SimpleContract1");

module.exports = function (deployer) {
  deployer.deploy(SimpleContract1, "test");
};
