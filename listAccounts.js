const ethers = require('ethers');

async function listAccounts() {
  try {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');

    const accounts = await provider.listAccounts();
    const signer = await provider.getSigner();
    console.log('first:', signer.getAddress());
    const signer2 = await provider.getSigner();
    console.log('second:', signer2);
  } catch (error) {
    console.error('Error listing accounts:', error);
  }
}

listAccounts();