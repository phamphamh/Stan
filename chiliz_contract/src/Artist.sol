// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { CAP20 } from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract Artist{

	error MissionOutOfBand();
	error RewardOutOfBand();
	error MissionAlreadyComplete();
	error YouCantAchieveForSomeoneElse();
	error YouAreNotTheArtist();
	error RewardAlreadyClaim();
	error RewardClose_();

	struct	_mission{

		string							__name;
		string							__description;
		uint8							__missionStatus;
		uint256							__reward;
		mapping( address => uint8)		__register;
	}

	struct _reward{

		string							__name;
		string							__description;
		uint8							__rewardStatus;
		uint256							__price;
		mapping( address => uint8)		__claim;
	}

	address							public 		artistAddress;
	CAP20							public 		FanToken;
	mapping( uint256 => _mission )	private		Mission;
	mapping( uint256 => _reward )	private		Reward;
	uint256							private		nb_mission;
	uint256							private		nb_reward;

	event	MissionOpen( uint256, address );
	event	MissionClose( uint256, address );
	error	MissionAlreadyClosed( uint256 );
	event	Register( uint256 , address );
	event	Complete( uint256, address );
	event	RewardClaim( uint256, address );
	event	RewardOpen( uint256 );
	event	RewardClose( uint256 );

	constructor( string memory name_, string memory symbole_, address artistAddress_ ){
		FanToken = new CAP20( name_, symbole_ , address(this) );
		nb_mission = 0;
		nb_reward = 0;
		artistAddress = artistAddress_;
	}
	
	/* Open function*/

	function openMission( string memory name_, string memory description_, uint256 reward_ ) public onlyArtist returns ( uint256 ){

		Mission[ nb_mission ].__name = name_;
		Mission[ nb_mission ].__description = description_;
		Mission[ nb_mission ].__missionStatus = 1;
		Mission[ nb_mission ].__reward = reward_;
		nb_mission++;
		emit MissionOpen( nb_mission - 1, msg.sender );
		return ( nb_mission - 1 );
	}

	function openReward( string memory name_, string memory description_, uint256 price_ ) public onlyArtist() returns ( uint256 ){

		Reward[ nb_reward ].__name = name_;
		Reward[ nb_reward ].__description = description_;
		Reward[ nb_reward ].__price = price_;
		Reward[ nb_reward ].__rewardStatus = 1;
		nb_reward++;
		emit RewardOpen( nb_reward - 1);
		return ( nb_reward - 1);
	}
	/*-------------------------------*/

	/* Close fonction */

	function closeReward( uint256 nb_reward_ ) public onlyArtist{
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		Reward[ nb_reward_ ].__rewardStatus = 2;
		emit RewardClose( nb_reward_ );
	}

	function closeMission( uint256 nb_mission_, address fanAddress_ ) public onlyArtist{
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		Mission[ nb_mission_ ].__missionStatus = 2;
		emit MissionClose( nb_mission_ , fanAddress_ );
	}

	/*-------------------------------*/
	/* Claim && complete */

	function completeFanMission( uint256 nb_mission_, address fanAddress_ ) public{
		
		if ( msg.sender != fanAddress_ || msg.sender == artistAddress)
			revert YouCantAchieveForSomeoneElse();
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		if ( Mission[ nb_mission_ ].__missionStatus == 2)
			revert MissionAlreadyClosed( nb_mission_ );
		uint256	reward_ = Mission[ nb_mission_ ].__reward;
		Mission[ nb_mission_ ].__register[ fanAddress_] = 2;
		FanToken.addToEarned( fanAddress_, reward_ );
		FanToken._mint( fanAddress_, reward_ );
		emit Complete( nb_mission_, fanAddress_ );
	}

	function claimRewardFan( uint256 nb_reward_, address fanAddress_ ) public {

		if ( msg.sender != fanAddress_ || msg.sender == artistAddress )
			revert YouCantAchieveForSomeoneElse();
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		if ( Reward[ nb_reward_ ].__claim[ fanAddress_ ] == 2 )
			revert RewardAlreadyClaim();
		if ( Reward[ nb_reward_ ].__rewardStatus == 2)
			revert RewardClose_();
		if ( FanToken.balanceOfEarnedToken( fanAddress_ ) < Reward[ nb_reward_ ].__price )
			revert ( "You don't have enough fan token" );
		Reward[ nb_reward_ ].__claim[ fanAddress_ ] = 2;
		FanToken._burn( fanAddress_, ( Reward[ nb_reward_ ].__price * 100 ) / 40 );
		FanToken.transfer( artistAddress, ( Reward[ nb_reward_ ].__price * 100 ) / 60);
		emit RewardClaim( nb_reward_, fanAddress_);
	}	

	/* Register fan*/

	function registerFanOnMission( uint256 nb_mission_ , address fanAddress_ ) public {
	
		if ( msg.sender != fanAddress_ || msg.sender == artistAddress )
			revert YouCantAchieveForSomeoneElse();
		if ( Mission[ nb_mission_ ].__register[ fanAddress_ ] == 2 || Mission[ nb_mission_ ].__missionStatus == 2)
			revert MissionAlreadyComplete();
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		Mission[ nb_mission_ ].__register[ fanAddress_ ] = 1;
		emit Register( nb_mission_, fanAddress_ );
	}

	/* Get fan statue */

	function getStatuFanOnMission( uint256 nb_mission_ , address fanAddress_ ) public view returns ( uint8 ){

		if ( nb_mission_ >= nb_mission)
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__register[ fanAddress_ ] );
	}

	function getStatuFanOnReward( uint256 nb_reward_ , address fanAddress_ ) public view returns ( uint8 ){
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		return ( Reward[ nb_reward_ ].__claim[ fanAddress_ ] );
	}

	/* Contract Info getter*/

	function getArtistAddress() public view returns( address ){
		return ( artistAddress );
	}

	function getFanToken() public view returns( address ){
		return ( address( FanToken ) );
	}

	/* Mission getter front */

	function getMissionName( uint256 nb_mission_) public view returns( string memory ){
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__name );
	}

	function getMissionDescription( uint256 nb_mission_) public view returns( string memory ){
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__description );
	}

	function getMissionStatus( uint256 nb_mission_ ) public view returns( uint8 ){
		if ( nb_mission_ >= nb_mission )
			revert MissionOutOfBand();
		return ( Mission[ nb_mission_ ].__missionStatus );
	}

	/* Reward getter front */

	function getRewardName( uint256 nb_reward_ ) public view returns ( string memory ){
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		return ( Reward[nb_reward_].__name );
	}

	function getRewardDescription( uint256 nb_reward_ ) public view returns ( string memory ){
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		return ( Reward[nb_reward_].__description );
	}

	function getRewardStatus( uint256 nb_reward_ ) public view returns ( uint8 ){
		if ( nb_reward_ >= nb_reward )
			revert RewardOutOfBand();
		return ( Reward[nb_reward_].__rewardStatus );
	}

	/* Artist permission */

	modifier onlyArtist(){
		if ( msg.sender != artistAddress )
			revert YouAreNotTheArtist();
		_;
	}
}