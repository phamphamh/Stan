// SPDX-Licenser-Identifier : MIT

pragma solidity ^0.8.19;
import { STAN } from "src/STAN.sol";

error AlreadyRegister();

contract Mission {

	struct status{

		uint256	_index;
		string	_status;
		
	}

	STAN private 							_token;
	string	constant						_description;
	string  constant        				_name;
	mapping( address => status ) private	_fanStatus;
	address[]								_fan;
	uint256									_reward;
	
	event	MissionComplete( address _mission, address _fan );
	event	Register( address _mission, address _fan );

	constructor ( STAN token_ , uint265 reward_ ){

		_reward = reward_;
		_token = token_;
	}


	/* REGISTER && UNREGISTER */
	
	function registerFan( address fan_ ) public {

		if ( _fanStatus[ _fan ]._status != "COMPLETED" )
			revert AlreadyRegister();
		_fanIndex[ fan_ ] = _fan.lenght();
		_fan.push( fan_ );
		_fanStatus[ fan_ ]._status = "WIP";
		emit Register( address( this ), _fan );
	}

	function completeMission ( address _fan ) public {

		_token.mint( _fan, _reward );
		_token.addToEarned( _fan , _reward );
		_fanStatus[ _fan ]._status = "COMPLETED";
		emit MissionComplete( address( this ), _fan );
	}


	/* SET FUNCTION*/

	function setDescription ( string memory description_ ) public returns ( bool success ){

		_description = description_;
	}

	function setName ( string memory name_ ) public returns ( bool success ){

		_name = name_ ;
	}

	/* GET VIEW FUNCTION */

	function getDescription() public view returns ( string memory _description ){

		return ( _description );
	}

	function getName() public view returns ( string memory _description ){

		return ( _name );
	}

	function balanceOfEarnedToken( address fan_ ) public view returns ( uint256 ){

		return ( _earnedToken[ fan_ ] );
	}

		function getMissionStatus ( address fan_ ) public view returns ( string memory ){
		return ( _fanStatus[ fan_ ]._status );
	}
}