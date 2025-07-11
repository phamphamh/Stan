//SPDX-License-Identifier : MIT

pragma solidity ^0.8.19;

import { Mission } from "./Mission.sol";
import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";

error DeployMissionFailed();

contract MissionMaker{

	struct _status {

		uint256 _index;
		string  _status;
	}

	constructor( CAP20 token_ ){
		
		_owner = msg.sender;
		_token = token_;
	}

	Mission[]                       _mission;
	mapping( address => _status )   _missionStatus; 
	address immutable 				_owner;
	CAP20    immutable  				_token;

	function newMisssion( string memory name_, string memory description_, uint256 _reward ) public returns ( uint256 ){
		 
		uint256	index;

		Mission _new = new Mission( _token, _reward );
		_new.setName( name_ );
		_new.setDescription( description_ );
		_missionStatus[ address ( _new ) ]._status = "LIVE";
		_missionStatus[ address ( _new ) ]._index = _mission.length;
		index =  _mission.length;
		_mission.push( _new );
		return ( index );
	}


}