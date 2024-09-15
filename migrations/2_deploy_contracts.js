const VoteContract = artifacts.require("VoteContract");

module.exports = function (deployer) {
  deployer.deploy(VoteContract);
};
