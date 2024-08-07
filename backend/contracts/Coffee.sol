// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Coffee {
    event NewMemo(
        string name,
        uint256 amount,
        uint256 timestamp,
        address userAddress,
        string message
    );

    struct Memo {
        string name;
        uint256 amount;
        uint256 timestamp;
        address userAddress;
        string message;
    }

    Memo[] memo;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owne can call this function");
        _;
    }

    //  solidity loads the data from the storage to memory to ensure returned data is a copy and not a reference.
    function getMemos() public view returns (Memo[] memory) {
        return memo;
    }

    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "value must be greater than zero bruh !");

        memo.push(
            Memo(_name, msg.value, block.timestamp, msg.sender, _message)
        );
    }

    function withdrawFunds() public onlyOwner {
        //require(owner.send(address(this).balance));

        // call method is better than send.
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    //Adding the view modifier indicates that this function will not modify the state of the contract. It only reads the balance of the contract.

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
