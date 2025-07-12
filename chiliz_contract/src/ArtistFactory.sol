// SPDX-License-Identifier : MIT

pragma solidity 0.8.19;

import { Artist } from "./Artist.sol";

contract ArtistFactory {

	mapping( uint256 => Artist )	private _artist;
	uint256							public _index;

	constructor(){
		_index = 0;
	}

	function newArtist( string memory _name, string memory _symbole ) public {
		_artist[ _index ] = new Artist( _name, _symbole, msg.sender );
		_index++;
	}

	function getArtist( uint256 index_ ) public view returns( Artist ){
		return ( _artist[ index_ ] );
	}

	function getArtistAddress( uint256 index_ ) public view returns( address ){
		return ( address( _artist[ index_ ] ) );
	}

}