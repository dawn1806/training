const { expect } = require("chai");

let counter;

describe("Counter", function () {
  async function init() {
    const [owner, otherAccount] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy(0);
    await counter.deployed();
    console.log("counter: ", counter.address);
  }

  before(async function () {
    await init();
  });

  it("owner call", async function () {
    await counter.count();
    expect(await counter.counter()).to.equal(1);
  });

  it("other call", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    counter = await counter.connect(otherAccount);
    await expect(counter.count()).to.be.revertedWith("invalid call");
  });
});
