// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract Artist{

	error MissionOutOfBand();
	error MissionAlreadyComplete();
	error YouCantAchieveForSomeoneElse();
	error YouAreNotTheArtist();

	struct	_mission{

		string							__name;
		string							__description;
		uint8							__missionStatus;
		uint256							__reward;
		mapping( address => uint8)		__register;
	}

	address							public 		artistAddress;
	CAP20							public 		FanToken;
	mapping( uint256 => _mission )	private		Mission;
	uint256							private		nb_mission;
	uint8							constant	REGISTER = 1;
	uint8							constant	COMPLETE = 2;

	event	MissionOpen( uint256, address );
	event	MissionClose( uint256, address );
	error	MissionAlreadyClosed( uint256 );
	event	Register( uint256 , address );
	event	Complete( uint256, address );

	constructor( string memory name_, string memory symbole_, address artistAddress_ ){
		FanToken = new CAP20( name_, symbole_ , address(this) );
		nb_mission = 0;
		artistAddress = artistAddress_;
	}
	
	function openMission( string memory name_, string memory description_, uint256 reward_ ) public onlyArtist returns ( uint256 ){

		Mission[ nb_mission ].__name = name_;
		Mission[ nb_mission ].__description = description_;
		Mission[ nb_mission ].__missionStatus = 1;
		Mission[ nb_mission ].__reward = reward_;
		nb_mission++;
		emit MissionOpen( nb_mission - 1, msg.sender );
		return ( nb_mission -1 );
	}

	function completeFanMission( uint256 nb_mission_, address fanAddress_ ) public{
		
		if ( msg.sender != fanAddress_ )
			revert YouCantAchieveForSomeoneElse();
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		if ( Mission[ nb_mission_ ].__missionStatus == 0)
			revert MissionAlreadyClosed( nb_mission_ );
		uint256	reward_ = Mission[ nb_mission_ ].__reward;
		Mission[ nb_mission_ ].__register[ fanAddress_] = COMPLETE;
		FanToken.addToEarned( fanAddress_, reward_ );
		FanToken._mint( fanAddress_, reward_ );
		emit Complete( nb_mission_, fanAddress_ );
	}

	function closeMission( uint256 nb_mission_, address fanAddress_ ) public onlyArtist{
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		Mission[ nb_mission_ ].__missionStatus = 0;
		emit MissionClose( nb_mission_ , fanAddress_ );
	}

	function registerFanOnMission( uint256 nb_mission_ , address fanAddress_ ) public {
	
		if ( msg.sender != fanAddress_ )
			revert YouCantAchieveForSomeoneElse();
		if ( Mission[ nb_mission_ ].__register[ fanAddress_ ] == COMPLETE )
			revert MissionAlreadyComplete();
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		Mission[ nb_mission_ ].__register[ fanAddress_ ] = REGISTER;
		emit Register( nb_mission_, fanAddress_ );
	}

	function getStatuFanOnMission( uint256 nb_mission_ , address fanAddress_ ) public view returns ( uint8 ){

		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__register[ fanAddress_ ] );
	}

	function getMissionStatus( uint256 nb_mission_ )  public view returns ( uint8 ){
		
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__missionStatus );
	}

	function getArtistAddress() public view returns( address ){
		return ( artistAddress );
	}

	modifier onlyArtist(){
		if ( msg.sender != artistAddress )
			revert YouAreNotTheArtist();
		_;
	}
}