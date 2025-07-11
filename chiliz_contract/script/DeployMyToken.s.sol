// SPDX-License-Identifier : MIT

pragma solidity ^0.8.30;

import { Script } from "forge-std/Script.sol";
import { ERC20 } from "../src/ERC20.sol";

contract DeployMyToken is Script {

	ERC20	_token;

	function run() external returns ( ERC20 ) {

		vm.startBroadcast();
		_token = new ERC20();
		vm.stopBroadcast();

		return ( _token );
	}
}