// SPDX-License-Identifier : MIT

pragma solidity ^0.8.30;

import { Script } from "forge-std/Script.sol";
import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import { Mission } from "../src/Mission.sol";
import { MissionMaker } from "../src/MissionMaker.sol";

contract DeployMissionMaker is Script {

	CAP20	_token;

	function run() external returns ( MissionMaker ) {

		_token = new CAP20( "STAN", "STN" );

		vm.startBroadcast();
		MissionMaker _missionMaker = new MissionMaker( _token );
		vm.stopBroadcast();

		return ( _missionMaker  );
	}
}