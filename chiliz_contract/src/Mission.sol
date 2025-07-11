// SPDX-Licenser-Identifier : MIT

pragma solidity ^0.8.19;
import { STAN } from "STAN.sol";


error AlreadyRegister();

contract Mission {

	STAN private 							_token;
	string	constant						_description;
	string  constant        				_name;
	mapping( address => uint256 ) private	_fanIndex;
	address[]								_fan;
	uint256									_reward;
	

	constructor ( STAN token_ , uint265 reward_ ){

		_reward = reward_;
		_token = token_;
	}

	function registerFan( address fan_ ) public {

		if ( _fanIndex[ fan_ ] != 0 )
			revert AlreadyRegister();
		_fanIndex[ fan_ ] = _fan.lenght();
		_fan.push( fan_ );
	}

	function balanceOfEarnedToken( address fan_ ) public returns ( uint256 ){

		return ( _earnedToken[ fan_ ] );
	}

	function getDescription() public view return ( string memory _description ){

		return ( _description );
	}

	function setDescription ( string memory description_ ) public returns ( bool success ){

		_description = description_;
	}

	function getName() public view return ( string memory _description ){

		return ( _name );
	}

	function setName ( string memory name_ ) public returns ( bool success ){

		_name = name_ ;
	}

	function completeMission ( address _fan ) public {

		_token.mint( _fan, _reward );
		_token.addToEarned( _fan , _reward );
	}
}