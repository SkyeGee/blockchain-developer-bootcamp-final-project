
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import EtherCoinToss from './artifacts/contracts/EtherCoinToss.sol/EtherCoinToss.json'

const ECFAddress = "0x3011dF4e89155b20fF9927Eb6Aa5E327d5191b26" 
function App() {
  const [wager, setWager] = useState()
  const [coinTossId, setCoinTossId] = useState()

  async function requestAccount() { // Function to connect with user's MetaMask wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

  async function startCoinToss() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount() // Request MetaMask account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // Get the signer
      const contract = new ethers.Contract(ECFAddress, EtherCoinToss.abi, signer); // Call the contract and pass in the smart contract address, abi & signer
      let updatedWager = ethers.utils.parseEther(wager.toString()); // Convert wager state variable to ethers.js format
      const tx = await contract.newCoinToss({ value: updatedWager }); // Call the contract function and pass in the wager
      tx.wait(); // Run the above function
      console.log(`You started the wager with ${ethers.utils.formatEther(updatedWager)} ETH`); // Console log the transaction
      let event = contract.on('EtherCoinTossed', (coinTossId) => { // Get the coin toss id from the smart contract event
        alert(`CoinTossID ${coinTossId} was tossed`);
      });
    event.wait();
   }
  }

  
  async function endCoinToss() {
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ECFAddress, EtherCoinToss.abi, signer);
    let updatedWager = ethers.utils.parseEther(wager.toString());
    const tx = await contract.endCoinToss(coinTossId, {value: updatedWager}); // Call the contract endCoinToss function and pass in the wager
    tx.wait();
    console.log(tx);
    let event = contract.on('EtherCoinFinishedToss', (winner) => {
      alert(`${winner} won the coin flip.`);
    });
    event.wait();
  }

  return (
    <div className="App">
    <header className="App-header">
      <h1>Ether Coin Toss</h1>
      <h4>Send your ETH to this contract for a 50% chance to double it! Send Your Coin Toss ID to a second player</h4>
    <p>!! Please note this uses the Rinkeby test network. Using any other network will result in lost funds. !!</p>
      <button value={wager} onClick={startCoinToss}>Start the coin toss!</button>
      <input onChange={e => setWager(e.target.value)} placeholder="Send your ETH"/>
      <br />
            <h2>End a wager</h2>
      <h4>Send ETH to a coin toss that has already begun</h4>
      <p>!! Make sure to send an equal amount of ETH as the person who started the Coin Toss otherwise the transaction will fail !!</p>
      <button value={wager} onClick={endCoinToss}>End a coin toss!</button>
      <input onChange={e => setWager(e.target.value)} placeholder="Send your ETH"/>
      <input value={coinTossId} onChange={e => setCoinTossId(e.target.value)} placeholder="Coin Toss ID"/>
  
    </header>
    </div>
  );
  

  

}
export default App;



