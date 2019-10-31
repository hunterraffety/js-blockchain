// yarn add crypto-js to hash with sha256~
const sha256 = require('crypto-js/sha256')

// create a Block class with constructor.
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  //calculateHash method using
  calculateHash() {
    return sha256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString()
  }

  // proof of work
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log('Block mined: ' + this.hash)
  }
}

//blockchain class -- utilizes createInitialBlock method with dummy data.
class Blockchain {
  constructor() {
    this.chain = [this.createInitialBlock()]
    this.difficulty = 3
  }

  createInitialBlock() {
    return new Block(0, '01/01/2019', 'Initial Block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

let newCoin = new Blockchain()
console.log('Mining Block 1: ')
newCoin.addBlock(new Block(1, '10/30/2019', { amount: 5 }))

console.log('Mining Block 2: ')
newCoin.addBlock(new Block(2, '10/31/2019', { amount: 15 }))

// check if it's valid; basic
console.log('Is Blockchain valid? ' + newCoin.isChainValid())

// return values in printed format
console.log(JSON.stringify(newCoin, null, 4))

// manually alter value of the amount at initial value + 1 (initial value at 0 has no previous basis to check against or tamper with) but change the value explicitly by changing amount to 1000.
newCoin.chain[1].data = { amount: 1000 }
console.log('Is Blockchain valid? ' + newCoin.isChainValid())

// set the value of the hash to calculated value from the method; still won't be valid because previous hash will not match.
newCoin.chain[1].hash = newCoin.chain[1].calculateHash()
console.log('Is Blockchain valid? ' + newCoin.isChainValid())
