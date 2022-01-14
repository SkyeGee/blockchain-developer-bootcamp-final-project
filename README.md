# blockchain-developer-bootcamp-final-project
## **Ether Coin Toss**
***URL for Deployed Version: [https://skyegee.github.io/blockchain-developer-bootcamp-final-project/***
***Screen recording link: [_}***

### Intoduction and Concept
This DApp is designed as a fun game between two people where equal amounts of token can be betted for a 50% chance to win the total tokens betted. 

Please note that the DApp currently uses the Rinkeby test network - please ensure that your account has sufficient test eth.
More test eth can be acquired here: ***https://faucet.rinkeby.io/***

## A basic walkthrough
- Once the "Start the Coin Toss!" button is pressed it will prompt you to connect your Metamask Account
- Once your account is connected you can specify the amount of eth you would like to bet
(Please check that you have sufficient rinkeby eth or the transcation won't go through)
- You will receive the CoinTossID once the transaction is approved
- Player2 can now match the amount of eth you betted, provide the CoinTossID and end the bet
- A random winner is picked and the winning account will receive all eth betted

## Running this Project Locally
### Prerequisites:
- have Node.js version 12.0 or newer installed
- CLI/Terminal
- text editor (I used VS Code)
### Dependencies:
- Hardhat (run: ***npm install --save-dev hardhat***)
- Yarn (run: ***yarn install***)
### Unit tests:
- use ***npx hardhat test*** to run unit tests
### Start the DApp:
- Run ***yarn start*** to run the DApp in localhost:3000


