const { expect } = require("chai");
const { ethers } = require('hardhat')
describe('EtherCoinToss', function  () {
   // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let EtherCoinToss;
  let hardhatEtherCoinToss;
  let player1;
  let player2;
  

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [player1, player2] = await ethers.getSigners()
    const EtherCoinToss = await ethers.getContractFactory('EtherCoinToss')
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardhatEtherCoinToss = await EtherCoinToss.deploy();
  });
// You can nest describe calls to create subsections.
describe("Deployment", function () {
   // `it` is another Mocha function. This is the one you use to define your
   // tests. It receives the test name, and a callback function.
    it("deploys successfully", async() => {
      const address = hardhatEtherCoinToss.address;
      expect(address).to.not.equal(0x0)
      expect(address).to.not.equal('')
      expect(address).to.not.equal(null)
      expect(address).to.not.equal(undefined)
    
    });
   // If the callback function is async, Mocha will `await` it.
  //  it("Should set the initial values", async function () {
  //    // Expect receives a value, and wraps it in an Assertion object. These
  //    // objects have a lot of utility methods to assert values.

  //    // This test expects the owner variable stored in the contract to be equal
  //    // to our Signer's owner.
  //    expect(await hardhatEtherCoinToss.keyHash).to.equal(0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311);
  //    expect(await hardhatEtherCoinToss.fee).to.equal(0.1 * 10**18);
  //  });
   // If the callback function is async, Mocha will `await` it.
   
   // it("Should assign the total supply of ether to the player", async function () {
   //   const ownerBalance = await hardhatToken.balanceOf(owner.address);
   //   expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
   // });
 });

 describe("Transactions", function () {
   it("Should emit event if coin toss is started", async function () {
     // Transfer 1 ether from loser to winner
      const tx = await hardhatEtherCoinToss.newCoinToss();
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interface = new ethers.utils.Interface(["event EtherCoinTossed(uint256 indexed theCoinTossID)"]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog("EtherCoinTossed", data, topics);
      expect(event.theCoinTossID).to.equal(300);
     //const player1Balance = await hardhatEtherCoinToss.balanceOf(player1.address);
     // expect(player1Balance).to.equal(1);
// // Transfer 50 tokens from addr1 to addr2
//       // We use .connect(signer) to send a transaction from another account
//       await hardhatToken.connect(addr1).transfer(addr2.address, 50);
//       const addr2Balance = await hardhatToken.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
     });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialPlayer1Balance = await hardhatEtherCoinToss.balanceOf(player1.address);

      // Try to send 1 token from player1 (0 tokens) to player2 (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatEtherCoinToss.connect(player1).transfer(player2.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Player1 balance shouldn't have changed.
      expect(await hardhatEtherCoinToss.balanceOf(player1.address)).to.equal(
        initialPlayer1Balance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialPlayer1Balance = await hardhatEtherCoinToss.balanceOf(player1.address);

      // Transfer 1 ether from player1 to player2.
      await hardhatEtherCoinToss.transfer(player2.address, 1);
// Transfer another 0.5 ether from player1 to player2.
await hardhatEtherCoinToss.transfer(player.address, 0.5);

// Check balances.
const finalPlayer1Balance = await hardhatEtherCoinToss.balanceOf(player1.address);
expect(finalPlayer1Balance).to.equal(initialPlayer1Balance.sub(1.5));

const player2Balance = await hardhatEtherCoinToss.balanceOf(player2.address);
expect(player2Balance).to.equal(1);

// const addr2Balance = await hardhatToken.balanceOf(addr2.address);
// expect(addr2Balance).to.equal(50);
});
});
});

