// SPDX-License-Identifier : MIT

pragma solidity 0.8.19;

import { Artist } from "./Artist.sol";

contract ArtistFactory {

	mapping( uint256 => Artist )	private _artist;
	uint256							public _index;

	event							NewArtist( address);

	constructor(){
		_index = 0;
	}

	function newArtist( string memory _name, string memory _symbole ) public {
		_artist[ _index ] = new Artist( _name, _symbole, msg.sender );
		emit NewArtist( address(_artist[ _index ]) );
		_index++;
	}

	function getArtist( uint256 index_ ) public view returns( Artist ){
		return ( _artist[ index_ ] );
	}

	function getArtistAddress( uint256 index_ ) public view returns( address ){
		return ( address( _artist[ index_ ] ) );
	}

	function isContract(uint256 index_) public view returns (bool) {
    	address artistAddr = address(_artist[index_]);
    	uint256 size;
    	assembly {
       	 size := extcodesize(artistAddr)
    	}
    return size > 0;
}

}