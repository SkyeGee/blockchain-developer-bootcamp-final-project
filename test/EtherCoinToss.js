const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("EtherCoinToss", function () {
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

  let amountOfMoney = 1;
  // EtherCoinTossStruct memory c = EtherCoinTossStructs[coinTossID]; // Store the coin toss game in memory

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [player1, player2] = await ethers.getSigners();
    EtherCoinToss = await ethers.getContractFactory("EtherCoinToss");
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardhatEtherCoinToss = await EtherCoinToss.deploy();
  });
  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.
    it("deploys successfully", async () => {
      const address = hardhatEtherCoinToss.address;
      expect(address).to.not.equal(0x0);
      expect(address).to.not.equal("");
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(undefined);
    });
  });

  describe("Events", function () {
    it("Should emit event if coin toss is started", async function () {
      const tx = await hardhatEtherCoinToss.newCoinToss({
        value: amountOfMoney,
      });
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interface = new ethers.utils.Interface([
        "event EtherCoinTossed(uint256 indexed theCoinTossID)",
      ]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog("EtherCoinTossed", data, topics);
      expect(event.theCoinTossID).to.equal(300);
    });


    it("Should fail if player does not have enough tokens", async function () {
      const player1Balance = await ethers.provider.getBalance(player1.address);
      await hardhatEtherCoinToss
        .newCoinToss({
          value: player1Balance + 1,
        })
        .catch((error) => {
          expect(error.message).to.equal(
            `sender doesn't have enough funds to send tx. The max upfront cost is: ${
              player1Balance + 1
            } and the sender's account only has: ${player1Balance}'`
          );
          // expect(error.message).to.equal(
          //   `sender doesn't have enough funds to send tx. The max upfront cost is: 99999987529598395357667 and the sender's account only has: ${player1Balance}'`
          // );
        });
    });
  });
  describe("Events", function () {
    xit("Should emit event if coin toss is finished", async function () {
      const _player1Balance = await ethers.provider.getBalance(player1.address);
      const _player2Balance = await ethers.provider.getBalance(player2.address);
      const tx = await hardhatEtherCoinToss.endCoinToss(300);

      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interface = new ethers.utils.Interface([
        "event EtherCoinFinishedToss(address indexed winner)",
      ]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog(
        "EtherCoinFinishedToss",
        data,
        topics
      );
      expect(event.c.winner).to.equal(player1.address || player2.address);

      const finalPlayer1Balance = await ethers.provider.getBalance(
        player1.address
      );

      const finalPlayer2Balance = await ethers.provider.getBalance(
        player2.address
      );

      if (event.c.winner === player1.address) {
        expect(finalPlayer1Balance).to.not.equal(_player1Balance);
        expect(finalPlayer2Balance).to.equal(_player2Balance);
      }
      if (event.c.winner === player2.address) {
        expect(finalPlayer2Balance).to.not.equal(_player2Balance);
        expect(finalPlayer1Balance).to.equal(_player1Balance);
      }
    });

    it("Should not start if game doesn't exist", async function () {
      await hardhatEtherCoinToss.endCoinToss(301).catch((error) => {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: reverted with reason string 'Game doesn't exist'"
        );
      });
    });

    it("Should not start if  value entered by second player is not the same as enterd by first player", async function () {
      await hardhatEtherCoinToss
        .endCoinToss(300, { value: amountOfMoney })
        .catch((error) => {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: reverted with reason string 'value needs to be the same as starting Wager'"
          );
        });
    });
    xit("Should not start if player2 equals player1", async function () {
      player1 = player2;
      await hardhatEtherCoinToss.endCoinToss(300).catch((error) => {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: reverted with reason string 'You cannot play against yourself'"
        );
      });
    });
    xit("Should not start if game is already finished", async function () {
      hardhatEtherCoinToss.EtherCoinTossStructs[300] =
        // Create a new coin toss game identified by coinTossID
        {
          ID: 300,
          betStarter: player1,
          startingWager: 3000,
          betEnder: player1,
          endingWager: 3000,
          etherTotal: 0,
          winner: player1,
          loser: player1,
        };
      await hardhatEtherCoinToss.endCoinToss(300).catch((error) => {
        expect(error.message).to.equal(
          "Returned error: VM Exception while processing transaction: revert Game already finished -- Reason given: Game already finished."
        );
      });
    });

    xit("Should update balances after transfers", async function () {
      //const initialPlayer1Balance = await hardhatEtherCoinToss.balanceOf(player1.address);

      const _player1Balance = await ethers.provider.getBalance(player1.address);
      await hardhatEtherCoinToss.newCoinToss({ value: 1 });

      const _player2Balance = await ethers.provider.getBalance(player2.address);
      await hardhatEtherCoinToss.endCoinToss(301, { value: 1 });
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interface = new ethers.utils.Interface([
        "event EtherCoinFinishedToss(address indexed winner)",
      ]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog(
        "EtherCoinFinishedToss",
        data,
        topics
      );

      const finalPlayer1Balance = await ethers.provider.getBalance(
        player1.address
      );
      const finalPlayer2Balance = await ethers.provider.getBalance(
        player2.address
      );

      if (event.c.winner === player1.address) {
        expect(finalPlayer1Balance).to.not.equal(_player1Balance);
        expect(finalPlayer2Balance).to.equal(_player2Balance);
      }
      if (event.c.winner === player2.address) {
        expect(finalPlayer2Balance).to.not.equal(_player2Balance);
        expect(finalPlayer1Balance).to.equal(_player1Balance);
      }
    });
  });
});
