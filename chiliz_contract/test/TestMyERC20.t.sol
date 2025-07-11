// SPDX-Licence-Identifier : MIT

pragma solidity ^0.8.30;

import { Vm } from "forge-std/Vm.sol";
import { stdError } from "forge-std/StdError.sol";
import { DeployMyToken } from "../script/DeployMyToken.s.sol";
import { ERC20 } from "../src/ERC20.sol";
import { Test } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";

contract MyTokenTest is Test{

	ERC20        	_token;
	DeployMyToken   _deploy;
	address         USER;
	address         USER1;
	address			USER2;
	address			tmp;

	function setUp() external {

		_deploy = new DeployMyToken();
		_token = _deploy.run();
		USER = address( 1 );
		USER1 = address( 2 );
		USER2 = address( 3 );
		tmp = address( this );
	}

	function testMint() public{

		_token.mint( USER, 10 );
		console.log( _token.balanceOf( USER ) );
	}

	function testTransfer() public{
		
		_token.mint( USER, 10 );
		vm.startPrank( USER );
		console.log( _token.getAddress() );
		_token.approve( tmp, 3);
		_token.transfer( USER1 , 5 );
		vm.stopPrank();

		assertEq(_token.balanceOf(USER), 5);
		assertEq(_token.balanceOf(USER1), 5);

		_token.transferFrom(USER, USER1, 1);

		assertEq(_token.balanceOf(USER), 4);
		assertEq(_token.balanceOf(USER1), 6);
	}

	function testTransferFrom() public{
		
		_token.mint( USER, 20 );
		vm.startPrank( USER );
		_token.approve( tmp, 5);
		vm.stopPrank();

		_token.transferFrom(USER, USER1, 3);

		assertEq(_token.balanceOf(USER), 17);
		assertEq(_token.balanceOf(USER1), 3);
	}

	function testTransferFromRevert() public{
		
		_token.mint( USER, 20 );
		vm.startPrank( USER );
		_token.approve( tmp, 5);
		vm.stopPrank();

		vm.expectRevert();
		_token.transferFrom(USER, USER1, 6);

	}

	function testTransferFromNoneApprove() public{
		
		_token.mint( USER, 20 );
		vm.expectRevert();
		_token.transferFrom(USER, USER1, 6);

	}

	function testAllowance() public{

		_token.mint( USER, 20 );
		vm.startPrank( USER );
		_token.approve( tmp , 10);
		vm.stopPrank();

		_token.transferFrom(USER, USER1, 6);
		_token.transferFrom(USER, USER1, 1);
		console.log( "allowance remaining", _token.allowance( USER , tmp ));
		_token.transferFrom(USER, USER1, 1);
		_token.transferFrom(USER, USER1, 1);
		console.log( "allowance remaining", _token.allowance( USER , tmp ));
		_token.transferFrom(USER, USER1, 1);
		console.log( "allowance remaining", _token.allowance( USER , tmp ));
		
		vm.startPrank( USER );
		_token.approve( USER1 , 10);
		vm.stopPrank();

		vm.startPrank( USER1 );
		_token.transferFrom(USER, tmp, 10);
		vm.stopPrank();

		console.log("USER balance :", _token.balanceOf( USER ));
		console.log("USER1 balance :", _token.balanceOf( USER1 ));
		console.log("tmp balance :", _token.balanceOf( tmp ));
	}

	function testDoubleToken() public{

		_token.mint
	}
}