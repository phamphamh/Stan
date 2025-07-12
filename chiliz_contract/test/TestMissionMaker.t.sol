// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";
import {CAP20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import { Artist } from "../src/Artist.sol";
import { ArtistFactory } from "../src/ArtistFactory.sol";

contract TestArtistAndFactory is Test {
    
    ArtistFactory public factory;
    Artist public artist1;
    Artist public artist2;
    Artist public artist3;
    
    // Separate artist accounts (EOAs)
    address public artist1Account = address(0xAAAA);
    address public artist2Account = address(0xBBBB);
    address public artist3Account = address(0xCCCC);
    
    // Fan accounts
    address public fan1 = address(0x1111);
    address public fan2 = address(0x2222);
    address public fan3 = address(0x3333);
    address public fan4 = address(0x4444);
    address public fan5 = address(0x5555);
    
    function setUp() public {
        factory = new ArtistFactory();
        
        // Create artists with separate accounts
        vm.startPrank(artist1Account);
        factory.newArtist("Artist1 Token", "ART1");
        vm.stopPrank();
        
        vm.startPrank(artist2Account);
        factory.newArtist("Artist2 Token", "ART2");
        vm.stopPrank();
        
        vm.startPrank(artist3Account);
        factory.newArtist("Artist3 Token", "ART3");
        vm.stopPrank();
        
        artist1 = factory.getArtist(0);
        artist2 = factory.getArtist(1);
        artist3 = factory.getArtist(2);
        
        // Label addresses for better logs
        vm.label(artist1Account, "Artist1Account");
        vm.label(artist2Account, "Artist2Account");
        vm.label(artist3Account, "Artist3Account");
        vm.label(fan1, "Fan1");
        vm.label(fan2, "Fan2");
        vm.label(fan3, "Fan3");
        vm.label(fan4, "Fan4");
        vm.label(fan5, "Fan5");
        vm.label(address(artist1), "Artist1Contract");
        vm.label(address(artist2), "Artist2Contract");
        vm.label(address(artist3), "Artist3Contract");
    }
    
    // Utility function to log fan balances
    function logFanBalances(Artist artist, string memory artistName) internal view {
        console.log("=== %s Fan Balances ===", artistName);
        console.log("Fan1 - Balance: %s, Earned: %s", 
            artist.FanToken().balanceOf(fan1), 
            artist.FanToken().balanceOfEarnedToken(fan1));
        console.log("Fan2 - Balance: %s, Earned: %s", 
            artist.FanToken().balanceOf(fan2), 
            artist.FanToken().balanceOfEarnedToken(fan2));
        console.log("Fan3 - Balance: %s, Earned: %s", 
            artist.FanToken().balanceOf(fan3), 
            artist.FanToken().balanceOfEarnedToken(fan3));
        console.log("Fan4 - Balance: %s, Earned: %s", 
            artist.FanToken().balanceOf(fan4), 
            artist.FanToken().balanceOfEarnedToken(fan4));
        console.log("Fan5 - Balance: %s, Earned: %s", 
            artist.FanToken().balanceOf(fan5), 
            artist.FanToken().balanceOfEarnedToken(fan5));
        console.log("========================");
    }
    
    // Utility function to log mission status
    function logMissionStatus(Artist artist, uint256 missionId, string memory artistName) internal view {
        console.log("=== %s Mission %s Status ===", artistName, missionId);
        console.log("Mission Status: %s", artist.getMissionStatus(missionId));
        console.log("Fan1 Status: %s", artist.getStatuFanOnMission(missionId, fan1));
        console.log("Fan2 Status: %s", artist.getStatuFanOnMission(missionId, fan2));
        console.log("Fan3 Status: %s", artist.getStatuFanOnMission(missionId, fan3));
        console.log("Fan4 Status: %s", artist.getStatuFanOnMission(missionId, fan4));
        console.log("Fan5 Status: %s", artist.getStatuFanOnMission(missionId, fan5));
        console.log("============================");
    }
    
    function test_PermissionRestrictions_OnlyFanCanRegisterForThemselves() public {
        console.log("=== Starting Permission Test: Only Fan Can Register For Themselves ===");
        
        // Artist creates a mission
        vm.startPrank(artist1Account);
        uint256 missionId = artist1.openMission("Permission Test Mission", "Test mission for permissions", 100);
        vm.stopPrank();
        
        console.log("Artist created mission %s", missionId);
        
        // Test 1: Fan1 registers for themselves (should work)
        console.log("Test 1: Fan1 registering for themselves");
        vm.prank(fan1);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Fan1 successfully registered for themselves");
        
        // Test 2: Artist tries to register Fan1 (should fail)
        console.log("Test 2: Artist trying to register Fan1");
        vm.expectRevert();
        vm.prank(artist1Account);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Artist correctly blocked from registering Fan1");
        
        // Test 3: Fan2 tries to register Fan1 (should fail)
        console.log("Test 3: Fan2 trying to register Fan1");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Fan2 correctly blocked from registering Fan1");
        
        // Test 4: Fan2 registers for themselves (should work)
        console.log("Test 4: Fan2 registering for themselves");
        vm.prank(fan2);
        artist1.registerFanOnMission(missionId, fan2);
        console.log("Fan2 successfully registered for themselves");
        
        // Verify registration status
        console.log("Final registration status:");
        console.log("Fan1 status: %s", artist1.getStatuFanOnMission(missionId, fan1));
        console.log("Fan2 status: %s", artist1.getStatuFanOnMission(missionId, fan2));
        
        assertEq(artist1.getStatuFanOnMission(missionId, fan1), 1, "Fan1 should be registered");
        assertEq(artist1.getStatuFanOnMission(missionId, fan2), 1, "Fan2 should be registered");
        
        console.log("=== Permission Test: Registration Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_OnlyFanCanCompleteForThemselves() public {
        console.log("=== Starting Permission Test: Only Fan Can Complete For Themselves ===");
        
        // Artist creates a mission
        vm.startPrank(artist1Account);
        uint256 missionId = artist1.openMission("Completion Permission Mission", "Test mission for completion permissions", 100);
        vm.stopPrank();
        
        console.log("Artist created mission %s", missionId);
        
        // Register both fans
        vm.prank(fan1);
        artist1.registerFanOnMission(missionId, fan1);
        vm.prank(fan2);
        artist1.registerFanOnMission(missionId, fan2);
        
        console.log("Both fans registered for the mission");
        logFanBalances(artist1, "Artist1");
        
        // Test 1: Fan1 completes for themselves (should work)
        console.log("Test 1: Fan1 completing for themselves");
        vm.prank(fan1);
        artist1.completeFanMission(missionId, fan1);
        console.log("Fan1 successfully completed for themselves");
        logFanBalances(artist1, "Artist1");
        
        // Test 2: Artist tries to complete for Fan2 (should fail)
        console.log("Test 2: Artist trying to complete for Fan2");
        vm.expectRevert();
        vm.prank(artist1Account);
        artist1.completeFanMission(missionId, fan2);
        console.log("Artist correctly blocked from completing for Fan2");
        
        // Test 3: Fan1 tries to complete for Fan2 (should fail)
        console.log("Test 3: Fan1 trying to complete for Fan2");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.completeFanMission(missionId, fan2);
        console.log("Fan1 correctly blocked from completing for Fan2");
        
        // Test 4: Fan2 completes for themselves (should work)
        console.log("Test 4: Fan2 completing for themselves");
        vm.prank(fan2);
        artist1.completeFanMission(missionId, fan2);
        console.log("Fan2 successfully completed for themselves");
        
        // Final balances
        console.log("Final balances after completion:");
        logFanBalances(artist1, "Artist1");
        
        // Verify final state
        assertEq(artist1.FanToken().balanceOf(fan1), 100, "Fan1 should have 100 tokens");
        assertEq(artist1.FanToken().balanceOf(fan2), 100, "Fan2 should have 100 tokens");
        assertEq(artist1.getStatuFanOnMission(missionId, fan1), 2, "Fan1 should be completed");
        assertEq(artist1.getStatuFanOnMission(missionId, fan2), 2, "Fan2 should be completed");
        
        console.log("=== Permission Test: Completion Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_CrossFanInterference() public {
        console.log("=== Starting Permission Test: Cross-Fan Interference Prevention ===");
        
        // Artist creates multiple missions
        vm.startPrank(artist1Account);
        uint256 mission1 = artist1.openMission("Mission 1", "First mission", 50);
        uint256 mission2 = artist1.openMission("Mission 2", "Second mission", 75);
        vm.stopPrank();
        
        console.log("Created missions: %s (50 tokens), %s (75 tokens)", mission1, mission2);
        
        // Register fans on different missions
        vm.prank(fan1);
        artist1.registerFanOnMission(mission1, fan1);
        vm.prank(fan2);
        artist1.registerFanOnMission(mission2, fan2);
        
        console.log("Fan1 registered for mission %s", mission1);
        console.log("Fan2 registered for mission %s", mission2);
        
        // Test cross-fan interference attempts
        console.log("\n=== Testing Cross-Fan Interference ===");
        
        // Fan1 tries to complete Fan2's mission (should fail)
        console.log("Test 1: Fan1 trying to complete Fan2's mission");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.completeFanMission(mission2, fan2);
        console.log("Fan1 correctly blocked from completing Fan2's mission");
        
        // Fan2 tries to complete Fan1's mission (should fail)
        console.log("Test 2: Fan2 trying to complete Fan1's mission");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.completeFanMission(mission1, fan1);
        console.log("Fan2 correctly blocked from completing Fan1's mission");
        
        // Artist tries to complete for both fans (should fail)
        console.log("Test 3: Artist trying to complete for Fan1");
        vm.expectRevert();
        vm.prank(artist1Account);
        artist1.completeFanMission(mission1, fan1);
        console.log("Artist correctly blocked from completing for Fan1");
        
        console.log("Test 4: Artist trying to complete for Fan2");
        vm.expectRevert();
        vm.prank(artist1Account);
        artist1.completeFanMission(mission2, fan2);
        console.log("Artist correctly blocked from completing for Fan2");
        
        // Now let fans complete their own missions
        console.log("\n=== Legitimate Completions ===");
        
        vm.prank(fan1);
        artist1.completeFanMission(mission1, fan1);
        console.log("Fan1 completed their own mission");
        
        vm.prank(fan2);
        artist1.completeFanMission(mission2, fan2);
        console.log("Fan2 completed their own mission");
        
        // Final verification
        console.log("\n=== Final Verification ===");
        logFanBalances(artist1, "Artist1");
        
        assertEq(artist1.FanToken().balanceOf(fan1), 50, "Fan1 should have 50 tokens");
        assertEq(artist1.FanToken().balanceOf(fan2), 75, "Fan2 should have 75 tokens");
        assertEq(artist1.getStatuFanOnMission(mission1, fan1), 2, "Fan1 should be completed on mission1");
        assertEq(artist1.getStatuFanOnMission(mission2, fan2), 2, "Fan2 should be completed on mission2");
        
        console.log("=== Cross-Fan Interference Test Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_RegistrationAfterCompletion() public {
        console.log("=== Starting Permission Test: Registration After Completion ===");
        
        // Artist creates a mission
        vm.startPrank(artist1Account);
        uint256 missionId = artist1.openMission("Post-Completion Mission", "Test registration after completion", 100);
        vm.stopPrank();
        
        // Fan1 registers and completes
        vm.prank(fan1);
        artist1.registerFanOnMission(missionId, fan1);
        vm.prank(fan1);
        artist1.completeFanMission(missionId, fan1);
        
        console.log("Fan1 registered and completed mission");
        logFanBalances(artist1, "Artist1");
        
        // Test: Fan1 tries to register again (should fail due to already completed)
        console.log("Test: Fan1 trying to register again after completion");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Fan1 correctly blocked from re-registering after completion");
        
        // Test: Fan2 tries to register Fan1 (should fail due to permission)
        console.log("Test: Fan2 trying to register Fan1");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Fan2 correctly blocked from registering Fan1");
        
        // Test: Artist tries to register Fan1 (should fail due to permission)
        console.log("Test: Artist trying to register Fan1");
        vm.expectRevert();
        vm.prank(artist1Account);
        artist1.registerFanOnMission(missionId, fan1);
        console.log("Artist correctly blocked from registering Fan1");
        
        // Verify final state
        assertEq(artist1.getStatuFanOnMission(missionId, fan1), 2, "Fan1 should remain completed");
        assertEq(artist1.FanToken().balanceOf(fan1), 100, "Fan1 should have 100 tokens");
        
        console.log("=== Registration After Completion Test Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_OnlyArtistCanOpenMissions() public {
        console.log("=== Starting Permission Test: Only Artist Can Open Missions ===");
        
        // Test 1: Artist opens mission (should work)
        console.log("Test 1: Artist opening mission");
        vm.startPrank(artist1Account);
        uint256 missionId = artist1.openMission("Artist Mission", "Mission opened by artist", 100);
        vm.stopPrank();
        console.log("Artist successfully opened mission %s", missionId);
        
        // Test 2: Fan1 tries to open mission (should fail)
        console.log("Test 2: Fan1 trying to open mission");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.openMission("Fan Mission", "Mission opened by fan", 50);
        console.log("Fan1 correctly blocked from opening mission");
        
        // Test 3: Fan2 tries to open mission (should fail)
        console.log("Test 3: Fan2 trying to open mission");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.openMission("Fan Mission 2", "Another mission opened by fan", 75);
        console.log("Fan2 correctly blocked from opening mission");
        
        // Test 4: Artist opens another mission (should work)
        console.log("Test 4: Artist opening another mission");
        vm.startPrank(artist1Account);
        uint256 missionId2 = artist1.openMission("Second Artist Mission", "Second mission opened by artist", 150);
        vm.stopPrank();
        console.log("Artist successfully opened mission %s", missionId2);
        
        // Verify mission status
        console.log("Final mission status:");
        console.log("Mission %s status: %s", missionId, artist1.getMissionStatus(missionId));
        console.log("Mission %s status: %s", missionId2, artist1.getMissionStatus(missionId2));
        
        assertEq(artist1.getMissionStatus(missionId), 1, "Mission 1 should be open");
        assertEq(artist1.getMissionStatus(missionId2), 1, "Mission 2 should be open");
        assertEq(artist1.getArtistAddress(), artist1Account, "Artist address should be correct");
        
        console.log("=== Permission Test: Mission Opening Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_OnlyArtistCanCloseMissions() public {
        console.log("=== Starting Permission Test: Only Artist Can Close Missions ===");
        
        // Artist opens multiple missions
        vm.startPrank(artist1Account);
        uint256 mission1 = artist1.openMission("Mission 1", "First mission to close", 100);
        uint256 mission2 = artist1.openMission("Mission 2", "Second mission to close", 150);
        uint256 mission3 = artist1.openMission("Mission 3", "Third mission to close", 200);
        vm.stopPrank();
        
        console.log("Artist opened missions: %s, %s, %s", mission1, mission2, mission3);
        
        // Register fans on missions
        vm.prank(fan1);
        artist1.registerFanOnMission(mission1, fan1);
        vm.prank(fan2);
        artist1.registerFanOnMission(mission2, fan2);
        vm.prank(fan3);
        artist1.registerFanOnMission(mission3, fan3);
        
        console.log("Fans registered on missions");
        
        // Test 1: Artist closes mission (should work)
        console.log("Test 1: Artist closing mission 1");
        vm.startPrank(artist1Account);
        artist1.closeMission(mission1, address(0));
        vm.stopPrank();
        console.log("Artist successfully closed mission 1");
        
        // Test 2: Fan1 tries to close mission (should fail)
        console.log("Test 2: Fan1 trying to close mission 2");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.closeMission(mission2, address(0));
        console.log("Fan1 correctly blocked from closing mission");
        
        // Test 3: Fan2 tries to close mission (should fail)
        console.log("Test 3: Fan2 trying to close mission 3");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.closeMission(mission3, address(0));
        console.log("Fan2 correctly blocked from closing mission");
        
        // Test 4: Artist closes another mission (should work)
        console.log("Test 4: Artist closing mission 2");
        vm.startPrank(artist1Account);
        artist1.closeMission(mission2, address(0));
        vm.stopPrank();
        console.log("Artist successfully closed mission 2");
        
        // Test 5: Try to complete closed mission (should fail)
        console.log("Test 5: Fan1 trying to complete closed mission 1");
        vm.expectRevert();
        vm.prank(fan1);
        artist1.completeFanMission(mission1, fan1);
        console.log("Fan1 correctly blocked from completing closed mission");
        
        // Test 6: Complete open mission (should work)
        console.log("Test 6: Fan3 completing open mission 3");
        vm.prank(fan3);
        artist1.completeFanMission(mission3, fan3);
        console.log("Fan3 successfully completed open mission");
        
        // Verify final states
        console.log("Final mission status:");
        console.log("Mission 1 status: %s (should be closed)", artist1.getMissionStatus(mission1));
        console.log("Mission 2 status: %s (should be closed)", artist1.getMissionStatus(mission2));
        console.log("Mission 3 status: %s (should be open)", artist1.getMissionStatus(mission3));
        
        assertEq(artist1.getMissionStatus(mission1), 0, "Mission 1 should be closed");
        assertEq(artist1.getMissionStatus(mission2), 0, "Mission 2 should be closed");
        assertEq(artist1.getMissionStatus(mission3), 1, "Mission 3 should be open");
        assertEq(artist1.FanToken().balanceOf(fan3), 200, "Fan3 should have 200 tokens");
        
        console.log("=== Permission Test: Mission Closing Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_ArtistAddressVerification() public {
        console.log("=== Starting Permission Test: Artist Address Verification ===");
        
        // Test artist address for each artist
        console.log("Artist1 address: %s", artist1.getArtistAddress());
        console.log("Artist2 address: %s", artist2.getArtistAddress());
        console.log("Artist3 address: %s", artist3.getArtistAddress());
        
        assertEq(artist1.getArtistAddress(), artist1Account, "Artist1 address should match");
        assertEq(artist2.getArtistAddress(), artist2Account, "Artist2 address should match");
        assertEq(artist3.getArtistAddress(), artist3Account, "Artist3 address should match");
        
        // Test that each artist can only control their own missions
        console.log("\n=== Testing Artist-Specific Control ===");
        
        // Artist1 opens mission
        vm.startPrank(artist1Account);
        uint256 artist1Mission = artist1.openMission("Artist1 Mission", "Mission by artist1", 100);
        vm.stopPrank();
        
        // Artist2 opens mission
        vm.startPrank(artist2Account);
        uint256 artist2Mission = artist2.openMission("Artist2 Mission", "Mission by artist2", 150);
        vm.stopPrank();
        
        console.log("Artist1 opened mission %s", artist1Mission);
        console.log("Artist2 opened mission %s", artist2Mission);
        
        // Test: Artist1 tries to close Artist2's mission (should fail)
        console.log("Test: Artist1 trying to close Artist2's mission");
        vm.expectRevert();
        vm.startPrank(artist1Account);
        artist2.closeMission(artist2Mission, address(0));
        vm.stopPrank();
        console.log("Artist1 correctly blocked from closing Artist2's mission");
        
        // Test: Artist2 tries to close Artist1's mission (should fail)
        console.log("Test: Artist2 trying to close Artist1's mission");
        vm.expectRevert();
        vm.startPrank(artist2Account);
        artist1.closeMission(artist1Mission, address(0));
        vm.stopPrank();
        console.log("Artist2 correctly blocked from closing Artist1's mission");
        
        // Test: Each artist can close their own mission
        console.log("Test: Artist1 closing their own mission");
        vm.startPrank(artist1Account);
        artist1.closeMission(artist1Mission, address(0));
        vm.stopPrank();
        console.log("Artist1 successfully closed their own mission");
        
        console.log("Test: Artist2 closing their own mission");
        vm.startPrank(artist2Account);
        artist2.closeMission(artist2Mission, address(0));
        vm.stopPrank();
        console.log("Artist2 successfully closed their own mission");
        
        // Verify final states
        assertEq(artist1.getMissionStatus(artist1Mission), 0, "Artist1's mission should be closed");
        assertEq(artist2.getMissionStatus(artist2Mission), 0, "Artist2's mission should be closed");
        
        console.log("=== Artist Address Verification Test Completed Successfully ===");
    }
    
    function test_PermissionRestrictions_MissionLifecycleWithPermissions() public {
        console.log("=== Starting Permission Test: Mission Lifecycle With Permissions ===");
        
        // Artist creates mission
        vm.startPrank(artist1Account);
        uint256 missionId = artist1.openMission("Lifecycle Mission", "Test mission lifecycle", 100);
        vm.stopPrank();
        
        console.log("Artist created mission %s", missionId);
        
        // Register fans
        vm.prank(fan1);
        artist1.registerFanOnMission(missionId, fan1);
        vm.prank(fan2);
        artist1.registerFanOnMission(missionId, fan2);
        
        console.log("Fans registered for mission");
        
        // Fan1 completes mission
        vm.prank(fan1);
        artist1.completeFanMission(missionId, fan1);
        console.log("Fan1 completed mission");
        logFanBalances(artist1, "Artist1");
        
        // Artist closes mission before Fan2 can complete
        vm.startPrank(artist1Account);
        artist1.closeMission(missionId, address(0));
        vm.stopPrank();
        console.log("Artist closed mission");
        
        // Fan2 tries to complete closed mission (should fail)
        console.log("Test: Fan2 trying to complete closed mission");
        vm.expectRevert();
        vm.prank(fan2);
        artist1.completeFanMission(missionId, fan2);
        console.log("Fan2 correctly blocked from completing closed mission");
        
        // Fan3 tries to register for closed mission (should work - registration still allowed)
        console.log("Test: Fan3 registering for closed mission");
        vm.prank(fan3);
        artist1.registerFanOnMission(missionId, fan3);
        console.log("Fan3 successfully registered for closed mission");
        
        // Fan3 tries to complete closed mission (should fail)
        console.log("Test: Fan3 trying to complete closed mission");
        vm.expectRevert();
        vm.prank(fan3);
        artist1.completeFanMission(missionId, fan3);
        console.log("Fan3 correctly blocked from completing closed mission");
        
        // Verify final state
        console.log("Final mission status: %s", artist1.getMissionStatus(missionId));
        console.log("Fan1 status: %s", artist1.getStatuFanOnMission(missionId, fan1));
        console.log("Fan2 status: %s", artist1.getStatuFanOnMission(missionId, fan2));
        console.log("Fan3 status: %s", artist1.getStatuFanOnMission(missionId, fan3));
        
        assertEq(artist1.getMissionStatus(missionId), 0, "Mission should be closed");
        assertEq(artist1.getStatuFanOnMission(missionId, fan1), 2, "Fan1 should be completed");
        assertEq(artist1.getStatuFanOnMission(missionId, fan2), 1, "Fan2 should be registered but not completed");
        assertEq(artist1.getStatuFanOnMission(missionId, fan3), 1, "Fan3 should be registered but not completed");
        assertEq(artist1.FanToken().balanceOf(fan1), 100, "Fan1 should have 100 tokens");
        assertEq(artist1.FanToken().balanceOf(fan2), 0, "Fan2 should have 0 tokens");
        assertEq(artist1.FanToken().balanceOf(fan3), 0, "Fan3 should have 0 tokens");
        
        console.log("=== Mission Lifecycle With Permissions Test Completed Successfully ===");
    }
}