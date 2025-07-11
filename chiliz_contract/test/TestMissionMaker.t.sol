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
    
    address public fan1 = address(0x1111);
    address public fan2 = address(0x2222);
    address public fan3 = address(0x3333);
    address public fan4 = address(0x4444);
    address public fan5 = address(0x5555);
    
    function setUp() public {
        factory = new ArtistFactory();
        
        // Create multiple artists
        factory.newArtist("Artist1 Token", "ART1");
        factory.newArtist("Artist2 Token", "ART2");
        factory.newArtist("Artist3 Token", "ART3");
        
        artist1 = factory.getArtist(0);
        artist2 = factory.getArtist(1);
        artist3 = factory.getArtist(2);
        
        // Label addresses for better logs
        vm.label(fan1, "Fan1");
        vm.label(fan2, "Fan2");
        vm.label(fan3, "Fan3");
        vm.label(fan4, "Fan4");
        vm.label(fan5, "Fan5");
        vm.label(address(artist1), "Artist1");
        vm.label(address(artist2), "Artist2");
        vm.label(address(artist3), "Artist3");
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
    
    function test_MultiFanMultiArtist_CompleteScenario() public {
        console.log("=== Starting Multi-Fan Multi-Artist Complete Scenario ===");
        
        // Artist 1 creates missions
        vm.startPrank(address(artist1));
        uint256 mission1_1 = artist1.openMission("First Mission", "Complete this mission", 100);
        uint256 mission1_2 = artist1.openMission("Second Mission", "Another mission", 150);
        uint256 mission1_3 = artist1.openMission("Third Mission", "Final mission", 200);
        vm.stopPrank();
        
        // Artist 2 creates missions
        vm.startPrank(address(artist2));
        uint256 mission2_1 = artist2.openMission("Artist2 Mission 1", "First mission from artist 2", 120);
        uint256 mission2_2 = artist2.openMission("Artist2 Mission 2", "Second mission from artist 2", 180);
        vm.stopPrank();
        
        // Artist 3 creates missions
        vm.startPrank(address(artist3));
        uint256 mission3_1 = artist3.openMission("Artist3 Mission 1", "First mission from artist 3", 90);
        vm.stopPrank();
        
        console.log("Created missions:");
        console.log("Artist1: Mission %s (100 tokens), Mission %s (150 tokens), Mission %s (200 tokens)", 
            mission1_1, mission1_2, mission1_3);
        console.log("Artist2: Mission %s (120 tokens), Mission %s (180 tokens)", mission2_1, mission2_2);
        console.log("Artist3: Mission %s (90 tokens)", mission3_1);
        
        // Register fans on missions
        console.log("\n=== Registering Fans on Missions ===");
        
        // Artist 1 missions - all fans register
        vm.prank(fan1); artist1.registerFanOnMission(mission1_1, fan1);
        vm.prank(fan2); artist1.registerFanOnMission(mission1_1, fan2);
        vm.prank(fan3); artist1.registerFanOnMission(mission1_1, fan3);
        vm.prank(fan4); artist1.registerFanOnMission(mission1_1, fan4);
        vm.prank(fan5); artist1.registerFanOnMission(mission1_1, fan5);
        
        // Artist 2 missions - some fans register
        vm.prank(fan1); artist2.registerFanOnMission(mission2_1, fan1);
        vm.prank(fan2); artist2.registerFanOnMission(mission2_1, fan2);
        vm.prank(fan3); artist2.registerFanOnMission(mission2_1, fan3);
        
        // Artist 3 missions - different fans register
        vm.prank(fan3); artist3.registerFanOnMission(mission3_1, fan3);
        vm.prank(fan4); artist3.registerFanOnMission(mission3_1, fan4);
        vm.prank(fan5); artist3.registerFanOnMission(mission3_1, fan5);
        
        console.log("All fans registered on their respective missions");
        
        // Log initial balances
        console.log("\n=== Initial Balances ===");
        logFanBalances(artist1, "Artist1");
        logFanBalances(artist2, "Artist2");
        logFanBalances(artist3, "Artist3");
        
        // Complete missions with different patterns
        console.log("\n=== Completing Missions ===");
        
        // Artist 1: Complete mission 1 with all fans
        console.log("Completing Artist1 Mission %s with all fans", mission1_1);
        vm.prank(fan1); artist1.completeFanMission(mission1_1, fan1);
        vm.prank(fan2); artist1.completeFanMission(mission1_1, fan2);
        vm.prank(fan3); artist1.completeFanMission(mission1_1, fan3);
        vm.prank(fan4); artist1.completeFanMission(mission1_1, fan4);
        vm.prank(fan5); artist1.completeFanMission(mission1_1, fan5);
        
        // Artist 2: Complete mission 1 with some fans
        console.log("Completing Artist2 Mission %s with fans 1, 2, 3", mission2_1);
        vm.prank(fan1); artist2.completeFanMission(mission2_1, fan1);
        vm.prank(fan2); artist2.completeFanMission(mission2_1, fan2);
        vm.prank(fan3); artist2.completeFanMission(mission2_1, fan3);
        
        // Artist 3: Complete mission 1 with different fans
        console.log("Completing Artist3 Mission %s with fans 3, 4, 5", mission3_1);
        vm.prank(fan3); artist3.completeFanMission(mission3_1, fan3);
        vm.prank(fan4); artist3.completeFanMission(mission3_1, fan4);
        vm.prank(fan5); artist3.completeFanMission(mission3_1, fan5);
        
        // Log balances after first round
        console.log("\n=== Balances After First Round ===");
        logFanBalances(artist1, "Artist1");
        logFanBalances(artist2, "Artist2");
        logFanBalances(artist3, "Artist3");
        
        // Complete more missions
        console.log("\n=== Completing Additional Missions ===");
        
        // Artist 1: Complete mission 2 with some fans
        console.log("Completing Artist1 Mission %s with fans 1, 3, 5", mission1_2);
        vm.prank(fan1); artist1.completeFanMission(mission1_2, fan1);
        vm.prank(fan3); artist1.completeFanMission(mission1_2, fan3);
        vm.prank(fan5); artist1.completeFanMission(mission1_2, fan5);
        
        // Artist 2: Complete mission 2 with different fans
        console.log("Completing Artist2 Mission %s with fans 4, 5", mission2_2);
        vm.prank(fan4); artist2.completeFanMission(mission2_2, fan4);
        vm.prank(fan5); artist2.completeFanMission(mission2_2, fan5);
        
        // Artist 1: Complete mission 3 with remaining fans
        console.log("Completing Artist1 Mission %s with fans 2, 4", mission1_3);
        vm.prank(fan2); artist1.completeFanMission(mission1_3, fan2);
        vm.prank(fan4); artist1.completeFanMission(mission1_3, fan4);
        
        // Log final balances
        console.log("\n=== Final Balances ===");
        logFanBalances(artist1, "Artist1");
        logFanBalances(artist2, "Artist2");
        logFanBalances(artist3, "Artist3");
        
        // Log mission statuses
        console.log("\n=== Final Mission Statuses ===");
        logMissionStatus(artist1, mission1_1, "Artist1");
        logMissionStatus(artist1, mission1_2, "Artist1");
        logMissionStatus(artist1, mission1_3, "Artist1");
        logMissionStatus(artist2, mission2_1, "Artist2");
        logMissionStatus(artist2, mission2_2, "Artist2");
        logMissionStatus(artist3, mission3_1, "Artist3");
        
        // Verify expected balances
        console.log("\n=== Verification ===");
        assertEq(artist1.FanToken().balanceOf(fan1), 100 + 150, "Fan1 Artist1 balance incorrect");
        assertEq(artist1.FanToken().balanceOf(fan2), 100 + 200, "Fan2 Artist1 balance incorrect");
        assertEq(artist1.FanToken().balanceOf(fan3), 100 + 150, "Fan3 Artist1 balance incorrect");
        assertEq(artist1.FanToken().balanceOf(fan4), 100 + 200, "Fan4 Artist1 balance incorrect");
        assertEq(artist1.FanToken().balanceOf(fan5), 100 + 150, "Fan5 Artist1 balance incorrect");
        
        assertEq(artist2.FanToken().balanceOf(fan1), 120, "Fan1 Artist2 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan2), 120, "Fan2 Artist2 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan3), 120, "Fan3 Artist2 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan4), 180, "Fan4 Artist2 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan5), 180, "Fan5 Artist2 balance incorrect");
        
        assertEq(artist3.FanToken().balanceOf(fan1), 0, "Fan1 Artist3 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan2), 0, "Fan2 Artist3 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan3), 90, "Fan3 Artist3 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan4), 90, "Fan4 Artist3 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan5), 90, "Fan5 Artist3 balance incorrect");
        
        console.log("All balance verifications passed!");
        console.log("=== Multi-Fan Multi-Artist Test Completed Successfully ===");
    }
    
    function test_MultiFan_StrategicCompletion() public {
        console.log("=== Starting Multi-Fan Strategic Completion Test ===");
        
        // Create missions with different reward levels
        vm.startPrank(address(artist1));
        uint256 smallMission = artist1.openMission("Small Mission", "Low reward mission", 50);
        uint256 mediumMission = artist1.openMission("Medium Mission", "Medium reward mission", 100);
        uint256 largeMission = artist1.openMission("Large Mission", "High reward mission", 200);
        vm.stopPrank();
        
        console.log("Created missions: Small(%s), Medium(%s), Large(%s)", 
            smallMission, mediumMission, largeMission);
        
        // Register fans strategically
        console.log("\n=== Strategic Fan Registration ===");
        
        // Fan1: Register for all missions
        vm.prank(fan1); artist1.registerFanOnMission(smallMission, fan1);
        vm.prank(fan1); artist1.registerFanOnMission(mediumMission, fan1);
        vm.prank(fan1); artist1.registerFanOnMission(largeMission, fan1);
        
        // Fan2: Register for medium and large only
        vm.prank(fan2); artist1.registerFanOnMission(mediumMission, fan2);
        vm.prank(fan2); artist1.registerFanOnMission(largeMission, fan2);
        
        // Fan3: Register for small and large only
        vm.prank(fan3); artist1.registerFanOnMission(smallMission, fan3);
        vm.prank(fan3); artist1.registerFanOnMission(largeMission, fan3);
        
        // Fan4: Register for small and medium only
        vm.prank(fan4); artist1.registerFanOnMission(smallMission, fan4);
        vm.prank(fan4); artist1.registerFanOnMission(mediumMission, fan4);
        
        // Fan5: Register for large only
        vm.prank(fan5); artist1.registerFanOnMission(largeMission, fan5);
        
        console.log("Strategic registration completed");
        
        // Log initial balances
        console.log("\n=== Initial Balances ===");
        logFanBalances(artist1, "Artist1");
        
        // Complete missions in strategic order
        console.log("\n=== Strategic Mission Completion ===");
        
        // Phase 1: Complete small mission first
        console.log("Phase 1: Completing Small Mission");
        vm.prank(fan1); artist1.completeFanMission(smallMission, fan1);
        vm.prank(fan3); artist1.completeFanMission(smallMission, fan3);
        vm.prank(fan4); artist1.completeFanMission(smallMission, fan4);
        
        console.log("Balances after Small Mission completion:");
        logFanBalances(artist1, "Artist1");
        
        // Phase 2: Complete medium mission
        console.log("Phase 2: Completing Medium Mission");
        vm.prank(fan1); artist1.completeFanMission(mediumMission, fan1);
        vm.prank(fan2); artist1.completeFanMission(mediumMission, fan2);
        vm.prank(fan4); artist1.completeFanMission(mediumMission, fan4);
        
        console.log("Balances after Medium Mission completion:");
        logFanBalances(artist1, "Artist1");
        
        // Phase 3: Complete large mission
        console.log("Phase 3: Completing Large Mission");
        vm.prank(fan1); artist1.completeFanMission(largeMission, fan1);
        vm.prank(fan2); artist1.completeFanMission(largeMission, fan2);
        vm.prank(fan3); artist1.completeFanMission(largeMission, fan3);
        vm.prank(fan5); artist1.completeFanMission(largeMission, fan5);
        
        console.log("Final balances after Large Mission completion:");
        logFanBalances(artist1, "Artist1");
        
        // Verify strategic outcomes
        console.log("\n=== Strategic Outcome Verification ===");
        
        // Fan1: All missions (50 + 100 + 200 = 350)
        assertEq(artist1.FanToken().balanceOf(fan1), 350, "Fan1 should have 350 tokens");
        console.log("Fan1 total: 350 tokens (all missions)");
        
        // Fan2: Medium + Large (100 + 200 = 300)
        assertEq(artist1.FanToken().balanceOf(fan2), 300, "Fan2 should have 300 tokens");
        console.log("Fan2 total: 300 tokens (medium + large)");
        
        // Fan3: Small + Large (50 + 200 = 250)
        assertEq(artist1.FanToken().balanceOf(fan3), 250, "Fan3 should have 250 tokens");
        console.log("Fan3 total: 250 tokens (small + large)");
        
        // Fan4: Small + Medium (50 + 100 = 150)
        assertEq(artist1.FanToken().balanceOf(fan4), 150, "Fan4 should have 150 tokens");
        console.log("Fan4 total: 150 tokens (small + medium)");
        
        // Fan5: Large only (200)
        assertEq(artist1.FanToken().balanceOf(fan5), 200, "Fan5 should have 200 tokens");
        console.log("Fan5 total: 200 tokens (large only)");
        
        console.log("=== Strategic Completion Test Completed Successfully ===");
    }
    
    function test_MultiArtist_Competition() public {
        console.log("=== Starting Multi-Artist Competition Test ===");
        
        // Create missions for all artists
        vm.startPrank(address(artist1));
        uint256 artist1_mission = artist1.openMission("Artist1 Mission", "First artist mission", 100);
        vm.stopPrank();
        
        vm.startPrank(address(artist2));
        uint256 artist2_mission = artist2.openMission("Artist2 Mission", "Second artist mission", 120);
        vm.stopPrank();
        
        vm.startPrank(address(artist3));
        uint256 artist3_mission = artist3.openMission("Artist3 Mission", "Third artist mission", 90);
        vm.stopPrank();
        
        console.log("Created missions: Artist1(%s), Artist2(%s), Artist3(%s)", 
            artist1_mission, artist2_mission, artist3_mission);
        
        // Register fans across different artists
        console.log("\n=== Cross-Artist Fan Registration ===");
        
        // Fan1: Register for Artist1 and Artist2
        vm.prank(fan1); artist1.registerFanOnMission(artist1_mission, fan1);
        vm.prank(fan1); artist2.registerFanOnMission(artist2_mission, fan1);
        
        // Fan2: Register for Artist2 and Artist3
        vm.prank(fan2); artist2.registerFanOnMission(artist2_mission, fan2);
        vm.prank(fan2); artist3.registerFanOnMission(artist3_mission, fan2);
        
        // Fan3: Register for all three artists
        vm.prank(fan3); artist1.registerFanOnMission(artist1_mission, fan3);
        vm.prank(fan3); artist2.registerFanOnMission(artist2_mission, fan3);
        vm.prank(fan3); artist3.registerFanOnMission(artist3_mission, fan3);
        
        // Fan4: Register for Artist1 and Artist3
        vm.prank(fan4); artist1.registerFanOnMission(artist1_mission, fan4);
        vm.prank(fan4); artist3.registerFanOnMission(artist3_mission, fan4);
        
        // Fan5: Register for Artist2 only
        vm.prank(fan5); artist2.registerFanOnMission(artist2_mission, fan5);
        
        console.log("Cross-artist registration completed");
        
        // Log initial balances
        console.log("\n=== Initial Balances ===");
        logFanBalances(artist1, "Artist1");
        logFanBalances(artist2, "Artist2");
        logFanBalances(artist3, "Artist3");
        
        // Complete missions across artists
        console.log("\n=== Cross-Artist Mission Completion ===");
        
        // Complete Artist1 missions
        console.log("Completing Artist1 missions");
        vm.prank(fan1); artist1.completeFanMission(artist1_mission, fan1);
        vm.prank(fan3); artist1.completeFanMission(artist1_mission, fan3);
        vm.prank(fan4); artist1.completeFanMission(artist1_mission, fan4);
        
        // Complete Artist2 missions
        console.log("Completing Artist2 missions");
        vm.prank(fan1); artist2.completeFanMission(artist2_mission, fan1);
        vm.prank(fan2); artist2.completeFanMission(artist2_mission, fan2);
        vm.prank(fan3); artist2.completeFanMission(artist2_mission, fan3);
        vm.prank(fan5); artist2.completeFanMission(artist2_mission, fan5);
        
        // Complete Artist3 missions
        console.log("Completing Artist3 missions");
        vm.prank(fan2); artist3.completeFanMission(artist3_mission, fan2);
        vm.prank(fan3); artist3.completeFanMission(artist3_mission, fan3);
        vm.prank(fan4); artist3.completeFanMission(artist3_mission, fan4);
        
        // Log final balances
        console.log("\n=== Final Balances ===");
        logFanBalances(artist1, "Artist1");
        logFanBalances(artist2, "Artist2");
        logFanBalances(artist3, "Artist3");
        
        // Verify cross-artist outcomes
        console.log("\n=== Cross-Artist Outcome Verification ===");
        
        // Fan1: Artist1(100) + Artist2(120) = 220
        assertEq(artist1.FanToken().balanceOf(fan1), 100, "Fan1 Artist1 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan1), 120, "Fan1 Artist2 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan1), 0, "Fan1 Artist3 balance incorrect");
        console.log("Fan1 total: Artist1(100) + Artist2(120) = 220 tokens");
        
        // Fan2: Artist2(120) + Artist3(90) = 210
        assertEq(artist1.FanToken().balanceOf(fan2), 0, "Fan2 Artist1 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan2), 120, "Fan2 Artist2 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan2), 90, "Fan2 Artist3 balance incorrect");
        console.log("Fan2 total: Artist2(120) + Artist3(90) = 210 tokens");
        
        // Fan3: All artists (100 + 120 + 90) = 310
        assertEq(artist1.FanToken().balanceOf(fan3), 100, "Fan3 Artist1 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan3), 120, "Fan3 Artist2 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan3), 90, "Fan3 Artist3 balance incorrect");
        console.log("Fan3 total: Artist1(100) + Artist2(120) + Artist3(90) = 310 tokens");
        
        // Fan4: Artist1(100) + Artist3(90) = 190
        assertEq(artist1.FanToken().balanceOf(fan4), 100, "Fan4 Artist1 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan4), 0, "Fan4 Artist2 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan4), 90, "Fan4 Artist3 balance incorrect");
        console.log("Fan4 total: Artist1(100) + Artist3(90) = 190 tokens");
        
        // Fan5: Artist2 only (120)
        assertEq(artist1.FanToken().balanceOf(fan5), 0, "Fan5 Artist1 balance incorrect");
        assertEq(artist2.FanToken().balanceOf(fan5), 120, "Fan5 Artist2 balance incorrect");
        assertEq(artist3.FanToken().balanceOf(fan5), 0, "Fan5 Artist3 balance incorrect");
        console.log("Fan5 total: Artist2(120) = 120 tokens");
        
        console.log("=== Multi-Artist Competition Test Completed Successfully ===");
    }
    
    function test_MultiFan_StressTest() public {
        console.log("=== Starting Multi-Fan Stress Test ===");
        
        // Create many missions
        vm.startPrank(address(artist1));
        uint256[] memory missions = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            missions[i] = artist1.openMission(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description for mission ", vm.toString(i))),
                50 + (i * 10) // 50, 60, 70, ..., 140
            );
        }
        vm.stopPrank();
        
        console.log("Created 10 missions with rewards: 50, 60, 70, ..., 140");
        
        // Register all fans on all missions
        console.log("\n=== Registering All Fans on All Missions ===");
        for (uint256 i = 0; i < 10; i++) {
            vm.prank(fan1); artist1.registerFanOnMission(missions[i], fan1);
            vm.prank(fan2); artist1.registerFanOnMission(missions[i], fan2);
            vm.prank(fan3); artist1.registerFanOnMission(missions[i], fan3);
            vm.prank(fan4); artist1.registerFanOnMission(missions[i], fan4);
            vm.prank(fan5); artist1.registerFanOnMission(missions[i], fan5);
        }
        
        console.log("All fans registered on all 10 missions");
        
        // Log initial balances
        console.log("\n=== Initial Balances ===");
        logFanBalances(artist1, "Artist1");
        
        // Complete missions in batches
        console.log("\n=== Completing Missions in Batches ===");
        
        // Batch 1: Complete missions 0-4 with all fans
        console.log("Batch 1: Completing missions 0-4 with all fans");
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(fan1); artist1.completeFanMission(missions[i], fan1);
            vm.prank(fan2); artist1.completeFanMission(missions[i], fan2);
            vm.prank(fan3); artist1.completeFanMission(missions[i], fan3);
            vm.prank(fan4); artist1.completeFanMission(missions[i], fan4);
            vm.prank(fan5); artist1.completeFanMission(missions[i], fan5);
        }
        
        console.log("Balances after Batch 1 (missions 0-4):");
        logFanBalances(artist1, "Artist1");
        
        // Batch 2: Complete missions 5-9 with some fans
        console.log("Batch 2: Completing missions 5-9 with fans 1, 3, 5");
        for (uint256 i = 5; i < 10; i++) {
            vm.prank(fan1); artist1.completeFanMission(missions[i], fan1);
            vm.prank(fan3); artist1.completeFanMission(missions[i], fan3);
            vm.prank(fan5); artist1.completeFanMission(missions[i], fan5);
        }
        
        console.log("Balances after Batch 2 (missions 5-9):");
        logFanBalances(artist1, "Artist1");
        
        // Calculate expected totals
        uint256 totalRewardAllMissions = 50 + 60 + 70 + 80 + 90 + 100 + 110 + 120 + 130 + 140; // 950
        uint256 totalRewardFirst5Missions = 50 + 60 + 70 + 80 + 90; // 350
        uint256 totalRewardLast5Missions = 100 + 110 + 120 + 130 + 140; // 600
        
        console.log("\n=== Expected Totals ===");
        console.log("Total reward for all 10 missions: %s", totalRewardAllMissions);
        console.log("Total reward for first 5 missions: %s", totalRewardFirst5Missions);
        console.log("Total reward for last 5 missions: %s", totalRewardLast5Missions);
        
        // Verify final balances
        console.log("\n=== Final Balance Verification ===");
        
        // Fans 1, 3, 5: All missions (950 tokens)
        assertEq(artist1.FanToken().balanceOf(fan1), totalRewardAllMissions, "Fan1 should have all rewards");
        assertEq(artist1.FanToken().balanceOf(fan3), totalRewardAllMissions, "Fan3 should have all rewards");
        assertEq(artist1.FanToken().balanceOf(fan5), totalRewardAllMissions, "Fan5 should have all rewards");
        console.log("Fans 1, 3, 5: %s tokens (all missions)", totalRewardAllMissions);
        
        // Fans 2, 4: First 5 missions only (350 tokens)
        assertEq(artist1.FanToken().balanceOf(fan2), totalRewardFirst5Missions, "Fan2 should have first 5 rewards");
        assertEq(artist1.FanToken().balanceOf(fan4), totalRewardFirst5Missions, "Fan4 should have first 5 rewards");
        console.log("Fans 2, 4: %s tokens (first 5 missions only)", totalRewardFirst5Missions);
        
        console.log("=== Multi-Fan Stress Test Completed Successfully ===");
    }

    function test_CloseMissionBeforeAllFansComplete() public {
        console.log("=== Starting Close Mission Before All Fans Complete Test ===");
        
        // Artist 1 creates a mission
        vm.startPrank(address(artist1));
        uint256 missionId = artist1.openMission("Limited Time Mission", "Mission will be closed early", 100);
        vm.stopPrank();
        
        // Register all fans
        vm.prank(fan1); artist1.registerFanOnMission(missionId, fan1);
        vm.prank(fan2); artist1.registerFanOnMission(missionId, fan2);
        vm.prank(fan3); artist1.registerFanOnMission(missionId, fan3);
        vm.prank(fan4); artist1.registerFanOnMission(missionId, fan4);
        vm.prank(fan5); artist1.registerFanOnMission(missionId, fan5);
        
        console.log("All fans registered for the mission");
        logFanBalances(artist1, "Artist1");
        
        // Only some fans complete the mission
        vm.prank(fan1); artist1.completeFanMission(missionId, fan1);
        vm.prank(fan2); artist1.completeFanMission(missionId, fan2);
        
        console.log("Fan1 and Fan2 completed the mission");
        logFanBalances(artist1, "Artist1");
        
        // Now close the mission before others can complete
        vm.prank(address(artist1));
        artist1.closeMission(missionId, address(0));
        console.log("Mission closed by artist");
        logMissionStatus(artist1, missionId, "Artist1");
        
        // Try to complete with another fan, expect revert
        vm.expectRevert();
        vm.prank(fan3);
        artist1.completeFanMission(missionId, fan3);
        
        // Final balances
        console.log("Final balances after mission closed early:");
        logFanBalances(artist1, "Artist1");
        
        // Assert only fan1 and fan2 received rewards
        assertEq(artist1.FanToken().balanceOf(fan1), 100, "Fan1 should have 100 tokens");
        assertEq(artist1.FanToken().balanceOf(fan2), 100, "Fan2 should have 100 tokens");
        assertEq(artist1.FanToken().balanceOf(fan3), 0, "Fan3 should have 0 tokens");
        assertEq(artist1.FanToken().balanceOf(fan4), 0, "Fan4 should have 0 tokens");
        assertEq(artist1.FanToken().balanceOf(fan5), 0, "Fan5 should have 0 tokens");
        
        console.log("=== Close Mission Before All Fans Complete Test Finished ===");
    }
}