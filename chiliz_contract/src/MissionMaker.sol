//SPDX-License-Identifier : MIT

pragma solidity ^0.8.19;

import { Mission } from "Mission.sol";
import { STAN } from "MissionMaker.sol";

error DeployMissionFailed();

contract MissionMaker{

	struct _status {

		uint256 _index;
		string  _status;
	}

	constructor( STAN token_ ){
		
		_owner = msg.sender;
		_token = token_;
	}

	Mission[]                       _mission;
	mapping( address => _status )   _missionStatus; 
	address immutable 				_owner;
	STAN    immutable  				_token;

	function newMisssion( string memory name_, string memory description_, uint256 _reward ) public returns ( address ){
		 
		Mission _new = new Mission( _token, _reward );
		_new.setName( _name );
		_new.setDescription( _description );
		_missionStatus[ address ( _new ) ]._status = "LIVE";
		_missionStatus[ address ( _new ) ]._index = _mission.lenght();
		_mission.push( _new );
		return ( address( _new ) );
	}

	function getMission() public returns ( Mission ){

	}

}