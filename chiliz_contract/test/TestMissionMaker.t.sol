// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";
import {CAP20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import { Artist } from "../src/Artist.sol";
import { ArtistFactory } from "../src/ArtistFactory.sol";

contract TestArtistAndFactory is Test {
}