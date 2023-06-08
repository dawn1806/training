// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Token is ERC721 {

    string public baseURI;

    constructor() ERC721(unicode"小猫", "LCAT") {
        
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) external {
        baseURI = uri;
    }

    function safeMint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }
    
}
