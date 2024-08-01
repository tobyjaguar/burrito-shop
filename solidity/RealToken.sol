// SPDX-License-Identifier: GPL-3.0
// Created by: Toby Algya on July 31, 2024.
pragma solidity 0.8.17;

import './ERC20.sol';

contract RealmToken is ERC20 {
  address payable public owner;

  constructor()
    ERC20("Realm Token", "REALM")
  {
    owner = payable(msg.sender);
  }

  modifier onlyOwner() {
    require(msg.sender != address(0), "sender cannot be zero");
    require(msg.sender == owner, "sender must be owner");
    _;
  }

  function setOwner(address payable _newOwner)
    public
    onlyOwner
    returns (bool)
  {
    owner = _newOwner;
    return true;
  }

  function mint(address _recipient, uint256 _amt)
    public
    override
    onlyOwner
  {
    _mint(_recipient, _amt);
  }

  function burn(uint256 _amt)
    public
    returns (bool)
  {
    _burn(msg.sender, _amt);
    return true;
  }

  function superBurn(address _address, uint256 _amt)
    public
    onlyOwner
    returns (bool)
  {
    _burn(_address, _amt);
    return true;
  }

  function kill()
    public
    onlyOwner
  {
    selfdestruct(owner);
  }

}