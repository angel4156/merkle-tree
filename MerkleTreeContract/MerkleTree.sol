// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * @dev Modifier 'onlyOwner' becomes available, where owner is the contract deployer
 */
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerkleProof is Ownable {

    constructor() {}

    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        bytes32 _hash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 ele = proof[i];
            if (_hash <= ele) {
                // Hash(current computed hash + current element of the proof)
                _hash = hashFunc(_hash, ele);
            } else {
                // Hash(current element of the proof + current computed hash)
                _hash = hashFunc(ele, _hash);
            }
        }
        return _hash == root;
    }

    function hashFunc(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }

    function getTime(bytes32[] memory _proof, bytes32 _root) external view returns (uint256) {
        require(verify(_proof, _root, keccak256(abi.encodePacked(msg.sender))) == true, "Not on whitelist");
        return block.timestamp;
    }

}