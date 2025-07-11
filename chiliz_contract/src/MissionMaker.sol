// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { Mission } from "./Mission.sol";
import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";



contract MissionMaker{


	error DeployMissionFailed();
	error IndexOutOfBounds();
	error MissionAlreadyExists();

	struct _status {

		uint256 _index;
		string  status_;
	}

	constructor( CAP20 token_ ){
		
		_owner = msg.sender;
		_token = token_;
	}

	Mission[]   private                    	_mission;
	mapping( Mission => _status )   private 	_missionStatus; 
	address public 							_owner;
	CAP20   public  						_token;

	function newMisssion( string memory name_, string memory description_, uint256 _reward ) public returns ( uint256 ){
		 
		uint256	index;

		Mission _new = new Mission( _token, _reward );
		_new.setName( name_ );
		_new.setDescription( description_ );
		_missionStatus[ _new ].status_ = "LIVE";
		_missionStatus[ _new ]._index = _mission.length + 1;
		index =  _mission.length;
		_mission.push( _new );
		return ( index );
	}

	function getMission( uint256 index_ ) public view returns ( Mission ){
		if ( index_ >= _mission.length ){
			revert IndexOutOfBounds();
		}
		return _mission[ index_ ];
	}

	function getMissionStatus( Mission mission_ ) public view returns ( _status memory ){
		if ( _missionStatus[ mission_ ]._index == 0 ){
			revert IndexOutOfBounds();
		}
		return _missionStatus[ mission_ ];
	}


	function getMissionIndex( Mission mission_ ) public view returns ( uint256 ){
		if ( _missionStatus[ mission_ ]._index == 0 ){
			revert IndexOutOfBounds();
		}
		return _missionStatus[ mission_ ]._index;
	}


}