// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";
error AlreadyRegister();
error NullAddress();

contract Mission {

	struct status{

		uint256	_index;
		uint8	_status;
		
	}

	CAP20 private 							_token;
	string	private							_description;
	string private	        				_name;
	mapping( address => status ) private	_fanStatus;
	address[] public						_fan;
	uint256	private							_reward;
	
	event	MissionComplete( address _mission, address _fan );
	event	Register( address _mission, address _fan );

	constructor ( CAP20 token_ , uint256 reward_ ){

		_reward = reward_;
		_token = token_;
	}


	/* REGISTER && UNREGISTER */

	function registerFan( address fan_ ) public {

		if ( fan_ == address(0))
			revert NullAddress();
		if ( _fanStatus[ fan_ ]._status != 0 )
			revert AlreadyRegister();
		_fanStatus[ fan_ ]._index = _fan.length;
		_fan.push( fan_ );
		_fanStatus[ fan_ ]._status = 2;
		emit Register( address( this ), fan_ );
	}

	function completeMission ( address fan_ ) public {

		_token.mint( fan_, _reward );
		_token.addToEarned( fan_ , _reward );
		_fanStatus[ fan_ ]._status = 1;
		emit MissionComplete( address( this ), fan_ );
	}


	/* SET FUNCTION*/

	function setDescription ( string memory description_ )  external{

		_description = description_;
	}

	function setName ( string memory name_ ) external {

		_name = name_ ;
	}

	/* GET VIEW FUNCTION */

	function getDescription() public view returns ( string memory description_ ){

		return ( _description );
	}

	function getName() public view returns ( string memory description_ ){

		return ( _name );
	}

	function balanceOfEarnedToken( address fan_ ) public view returns ( uint256 ){

		return ( _token.balanceOfEarned( fan_ ) );
	}

	function getMissionStatus ( address fan_ ) public view returns ( uint8  ){

		return ( _fanStatus[ fan_ ]._status );
	}

	function getReward () public view returns ( uint256 ){

		return ( _reward );
	}
}