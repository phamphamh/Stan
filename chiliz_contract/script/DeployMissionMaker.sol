// SPDX-License-Identifier : MIT

pragma solidity ^0.8.30;

import { Script } from "forge-std/Script.sol";
import { Artist } from "../src/Artist.sol";
import { ArtistFactory } from "../src/ArtistFactory.sol";

contract DeployAristeFactory is Script {

	function run() external returns ( ArtistFactory ) {

		vm.startBroadcast();
		ArtistFactory _missionMaker = new ArtistFactory();
		vm.stopBroadcast();

		return ( _missionMaker  );
	}
}