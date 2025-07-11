// SPDX-License-Identifier : MIT

pragma solidity ^0.8.30;

import { Script } from "forge-std/Script.sol";
import { STAN } from "../src/STAN.sol";
import { Mission } from "../src/Mission.sol";
import { MissionMaker } from "../src/MissionMaker.sol";

contract DeployMissionMaker is Script {

	STAN	_token;

	function run() external returns ( MissionMaker ) {

		_token = new STAN()

		vm.startBroadcast();
		MissionMaker _missionMaker = new MissionMaker( _token );
		vm.stopBroadcast();

		return ( _missionMaker  );
	}
}