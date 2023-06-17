### Target 合约 （本文使用 create2 创建这个合约）

```solidity
contract Target {
    address public immutable owner;
    uint256 public count;

    constructor(address _owner, uint256 _count) {
        owner = _owner;
        count = _count;
    }

    function test() public {
        require(msg.sender == owner, "only owner");
        count = 100;
    }
}
```

这里故意给 Target 合约设置 2 个构造函数参数：\_owner 和 \_count，目的是完整演示 Create2 创建合约的方法。下面需要传这个两个参数创建合约。

### Create2 工厂合约

> create2 有两种方式，这里一一列出

1. create2 第一种创建合约的方法，这是最新的，旧版需要汇编

```
// 以下的各个方法都在 Factory 合约内，为了突出重点，下面的方法不再给出Factory{}包裹
contract Factory {
    function deploy(address _owner, uint256 _count, bytes32 _salt)
        public
        returns (address)
    {
        return address(new Target{salt: _salt}(_owner, _count));
    }
}
```

2. create2 第二种创建合约的方法，旧版汇编的方式

```
// @_bytecode Target合约字节码，下面有方法可以方便获取
// @_salt 盐值，下面有公共方法可以获取盐值
function deployAssembly(bytes memory _bytecode, bytes32 _salt) public returns (address addr) {
    assembly {
        addr := create2(
            0,
            add(_bytecode, 32),
            mload(_bytecode),
            _salt
        )

        if iszero(extcodesize(addr)) {
            revert(0, 0)
        }
    }
}
```

3. 第 2 步 Target 合约的字节码，可以抽象出一个公共方法来获取合约字节码

```
// 要部署合约的字节码, _owner 和 _count 是构造函数的参数
function getBytecode(address _owner, uint256 _count) public pure returns (bytes memory) {
    bytes memory bytecode = type(Target).creationCode;
    return abi.encodePacked(bytecode, abi.encode(_owner, _count));
}
```

4. 预测 Target 合约地址

```
function getAddress(bytes memory _bytecode, bytes32 _salt) public view returns (address) {
    bytes32 addrHash = keccak256(abi.encodePacked(
        bytes1(0xff), // 这里可以写 hex'ff'  不能写 "0xff"
        address(this), // 这里是调用create2的合约，在本文中就是当前的Factory合约
        _salt, // 盐值
        keccak256(_bytecode) // 这里可以提前进行 keccak256 后写到这里，写法是 bytes32(0xABC...) 或 hex'ABC...'，不能写 "0xABC..."
    ));
    // 将最后 20 个字节的哈希值转换为地址
    return address(uint160(uint(addrHash)));
}
```

5. 公共方法

```
// 生成盐值，盐值可以是任意值，也可以是地址，字符串等，这里只是个例子
function hash(uint256 n) public pure returns (bytes32) {
    return keccak256(abi.encode(n));
}

// 生成合约字节码的hash，用于提前hash字节码，通过参数传递给预测地址的方法
// 预测地址的时候，除了上面 getAddress 方法传递字节码以外，还可以将字节码hash后传入，这种情况要注意写法，上面getAddress方法每个参数有说明，不再赘述
function hash(bytes memory bytecode) public pure returns (bytes32) {
    return keccak256(bytecode);
}
```
