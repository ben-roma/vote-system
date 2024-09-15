const Web3 = require('web3').default;
const fs = require('fs');
const path = require('path');

// Se connecter à Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Charger le contrat compilé
const contractPath = path.resolve(__dirname, '../build/contracts/VoteContract.json');
const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const abi = contractJSON.abi;
const contractAddress = '0xB17735e7f78C9EdaE2b99f9992C6930eA96B65fB';  // Adresse du contrat déployé

const voteContract = new web3.eth.Contract(abi, contractAddress);

module.exports = voteContract;
