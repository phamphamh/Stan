// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";
import {CAP20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import { Artist } from "../src/Artist.sol";
import { ArtistFactory } from "../src/ArtistFactory.sol";

contract TestArtistAndFactory is Test {
    ArtistFactory factory;
    
    // Artists
    address artist1 = makeAddr("artist1");
    address artist2 = makeAddr("artist2");
    address artist3 = makeAddr("artist3");
    
    // Fans
    address fan1 = makeAddr("fan1");
    address fan2 = makeAddr("fan2");
    address fan3 = makeAddr("fan3");
    address fan4 = makeAddr("fan4");
    
    // Artist contracts
    Artist artistContract1;
    Artist artistContract2;
    Artist artistContract3;
    
    // Fan tokens
    CAP20 fanToken1;
    CAP20 fanToken2;
    CAP20 fanToken3;
    
    function setUp() public {
        factory = new ArtistFactory();
        
        // Create artist contracts
        vm.prank(artist1);
        factory.newArtist("Artist1 Token", "ART1");
        artistContract1 = factory.getArtist(0);
        fanToken1 = CAP20(artistContract1.getFanToken());
        
        vm.prank(artist2);
        factory.newArtist("Artist2 Token", "ART2");
        artistContract2 = factory.getArtist(1);
        fanToken2 = CAP20(artistContract2.getFanToken());
        
        vm.prank(artist3);
        factory.newArtist("Artist3 Token", "ART3");
        artistContract3 = factory.getArtist(2);
        fanToken3 = CAP20(artistContract3.getFanToken());
    }
    
    // Helper function to create missions for testing
    function createMissions() internal {
        // Artist1 creates missions
        vm.startPrank(artist1);
        artistContract1.openMission("Dance Challenge", "Learn the new dance", 100);
        artistContract1.openMission("Share Story", "Share your favorite memory", 50);
        artistContract1.openMission("Photo Contest", "Take a creative photo", 75);
        vm.stopPrank();
        
        // Artist2 creates missions
        vm.startPrank(artist2);
        artistContract2.openMission("Music Quiz", "Answer music questions", 80);
        artistContract2.openMission("Cover Song", "Record a cover song", 120);
        vm.stopPrank();
        
        // Artist3 creates missions
        vm.startPrank(artist3);
        artistContract3.openMission("Art Drawing", "Draw fan art", 90);
        vm.stopPrank();
    }
    
    // Helper function to create rewards for testing
    function createRewards() internal {
        // Artist1 creates rewards
        vm.startPrank(artist1);
        artistContract1.openReward("VIP Pass", "Access to VIP area", 150);
        artistContract1.openReward("Signed Photo", "Autographed photo", 75);
        artistContract1.openReward("Video Call", "15min video call", 200);
        vm.stopPrank();
        
        // Artist2 creates rewards
        vm.startPrank(artist2);
        artistContract2.openReward("Concert Ticket", "Free concert ticket", 180);
        artistContract2.openReward("Guitar Pick", "Custom guitar pick", 60);
        vm.stopPrank();
        
        // Artist3 creates rewards
        vm.startPrank(artist3);
        artistContract3.openReward("Art Lesson", "Private art lesson", 250);
        vm.stopPrank();
    }

    // ==================== MISSION TESTS ====================
    
    function test_OpenMission_Success() public {
        console.log("=== TEST: OpenMission Success ===");
        console.log("Artist1 address:", artist1);
        
        vm.prank(artist1);
        uint256 missionId = artistContract1.openMission("Test Mission", "Test Description", 100);
        
        console.log("Mission created with ID:", missionId);
        console.log("Mission name:", artistContract1.getMissionName(0));
        console.log("Mission description:", artistContract1.getMissionDescription(0));
        console.log("Mission status:", artistContract1.getMissionStatus(0));
        
        assertEq(missionId, 0);
        assertEq(artistContract1.getMissionName(0), "Test Mission");
        assertEq(artistContract1.getMissionDescription(0), "Test Description");
        assertEq(artistContract1.getMissionStatus(0), 1); // Open status
        
        console.log("[PASS] Test passed: Mission created successfully");
    }
    
    function test_OpenMission_OnlyArtist() public {
        console.log("=== TEST: OpenMission OnlyArtist ===");
        console.log("Fan1 trying to create mission (should fail):", fan1);
        console.log("Expected revert: YouAreNotTheArtist");
        
        vm.prank(fan1);
        vm.expectRevert(Artist.YouAreNotTheArtist.selector);
        artistContract1.openMission("Test Mission", "Test Description", 100);
        
        console.log("[PASS] Test passed: Only artist can create missions");
    }
    
    function test_RegisterFanOnMission_Success() public {
        console.log("=== TEST: RegisterFanOnMission Success ===");
        createMissions();
        
        console.log("Fan1 registering for mission 0:", fan1);
        console.log("Mission 0 name:", artistContract1.getMissionName(0));
        
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        
        uint256 status = artistContract1.getStatuFanOnMission(0, fan1);
        console.log("Fan status after registration:", status);
        
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 1); // Registered
        
        console.log("[PASS] Test passed: Fan registered successfully");
    }
    
    function test_RegisterFanOnMission_PermissionCheck() public {
        console.log("=== TEST: RegisterFanOnMission PermissionCheck ===");
        createMissions();
        
        console.log("Testing fan1 trying to register fan2 (should fail)");
        console.log("Fan1:", fan1);
        console.log("Fan2:", fan2);
        
        // Fan cannot register for someone else
        vm.prank(fan1);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.registerFanOnMission(0, fan2);
        
        console.log("[PASS] Fan1 cannot register for fan2");
        
        console.log("Testing artist1 trying to register for themselves (should fail)");
        console.log("Artist1:", artist1);
        
        // Artist cannot register
        vm.prank(artist1);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.registerFanOnMission(0, artist1);
        
        console.log("[PASS] Test passed: Permission checks working correctly");
    }
    
    function test_RegisterFanOnMission_InvalidMissionId() public {
        vm.prank(fan1);
        vm.expectRevert(Artist.MissionOutOfBand.selector);
        artistContract1.registerFanOnMission(999, fan1);
    }
    
    function test_CompleteFanMission_Success() public {
        console.log("=== TEST: CompleteFanMission Success ===");
        createMissions();
        
        console.log("Fan1 initial token balance:", fanToken1.balanceOf(fan1));
        console.log("Fan1 initial earned tokens:", fanToken1.balanceOfEarnedToken(fan1));
        
        // Register first
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        console.log("Fan1 registered for mission 0");
        
        // Complete mission
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        console.log("Fan1 completed mission 0");
        
        uint256 finalStatus = artistContract1.getStatuFanOnMission(0, fan1);
        uint256 finalBalance = fanToken1.balanceOf(fan1);
        uint256 finalEarned = fanToken1.balanceOfEarnedToken(fan1);
        
        console.log("Fan1 final status:", finalStatus);
        console.log("Fan1 final token balance:", finalBalance);
        console.log("Fan1 final earned tokens:", finalEarned);
        
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2); // Completed
        assertEq(fanToken1.balanceOf(fan1), 100); // Received tokens
        assertEq(fanToken1.balanceOfEarnedToken(fan1), 100); // Earned tokens tracked
        
        console.log("[PASS] Test passed: Mission completed and tokens awarded");
    }
    
    function test_CompleteFanMission_PermissionCheck() public {
        createMissions();
        
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        
        // Fan cannot complete for someone else
        vm.prank(fan2);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.completeFanMission(0, fan1);
        
        // Artist cannot complete
        vm.prank(artist1);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.completeFanMission(0, fan1);
    }
    
    function test_CompleteFanMission_InvalidMissionId() public {
        vm.prank(fan1);
        vm.expectRevert(Artist.MissionOutOfBand.selector);
        artistContract1.completeFanMission(999, fan1);
    }
    
    function test_CompleteFanMission_ClosedMission() public {
        createMissions();
        
        // Close mission first
        vm.prank(artist1);
        artistContract1.closeMission(0, fan1);
        
        vm.prank(fan1);
        vm.expectRevert(abi.encodeWithSelector(Artist.MissionAlreadyClosed.selector, 0));
        artistContract1.completeFanMission(0, fan1);
    }
    
    function test_CloseMission_Success() public {
        console.log("=== TEST: CloseMission Success ===");
        createMissions();
        
        console.log("Mission 0 initial status:", artistContract1.getMissionStatus(0));
        console.log("Artist1 closing mission 0:", artist1);
        
        vm.prank(artist1);
        artistContract1.closeMission(0, fan1);
        
        uint256 finalStatus = artistContract1.getMissionStatus(0);
        console.log("Mission 0 final status:", finalStatus);
        
        assertEq(artistContract1.getMissionStatus(0), 2); // Closed status
        
        console.log("[PASS] Test passed: Mission closed successfully");
    }
    
    function test_CloseMission_OnlyArtist() public {
        createMissions();
        
        vm.prank(fan1);
        vm.expectRevert(Artist.YouAreNotTheArtist.selector);
        artistContract1.closeMission(0, fan1);
    }
    
    function test_CloseMission_InvalidMissionId() public {
        vm.prank(artist1);
        vm.expectRevert(Artist.MissionOutOfBand.selector);
        artistContract1.closeMission(999, fan1);
    }

    // ==================== REWARD TESTS ====================
    
    function test_OpenReward_Success() public {
        console.log("=== TEST: OpenReward Success ===");
        console.log("Artist1 address:", artist1);
        
        vm.prank(artist1);
        uint256 rewardId = artistContract1.openReward("Test Reward", "Test Description", 100);
        
        console.log("Reward created with ID:", rewardId);
        console.log("Reward name:", artistContract1.getRewardName(0));
        console.log("Reward description:", artistContract1.getRewardDescription(0));
        console.log("Reward status:", artistContract1.getRewardStatus(0));
        console.log("Reward price: 100 tokens");
        
        assertEq(rewardId, 0);
        assertEq(artistContract1.getRewardName(0), "Test Reward");
        assertEq(artistContract1.getRewardDescription(0), "Test Description");
        assertEq(artistContract1.getRewardStatus(0), 1); // Open status
        
        console.log("[PASS] Test passed: Reward created successfully");
    }
    
    function test_OpenReward_OnlyArtist() public {
        vm.prank(fan1);
        vm.expectRevert(Artist.YouAreNotTheArtist.selector);
        artistContract1.openReward("Test Reward", "Test Description", 100);
    }
    
    function test_ClaimRewardFan_Success() public {
        console.log("=== TEST: ClaimRewardFan Success ===");
        createMissions();
        createRewards();
        
        console.log("Fan1 initial token balance:", fanToken1.balanceOf(fan1));
        console.log("Artist1 initial token balance:", fanToken1.balanceOf(artist1));
        
        // Fan completes mission to earn tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        console.log("Fan1 completed mission 0 (Dance Challenge - 100 tokens)");
        
        // Fan completes another mission for more tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
        console.log("Fan1 completed mission 1 (Share Story - 50 tokens)");
        
        uint256 initialArtistBalance = fanToken1.balanceOf(artist1);
        uint256 initialFanBalance = fanToken1.balanceOf(fan1);
        uint256 initialEarnedBalance = fanToken1.balanceOfEarnedToken(fan1);
        
        console.log("Before claim - Fan balance:", initialFanBalance);
        console.log("Before claim - Artist balance:", initialArtistBalance);
        console.log("Before claim - Fan earned tokens:", initialEarnedBalance);
        console.log("Reward price (VIP Pass): 150 tokens");
        
        // Claim reward (VIP Pass costs 150 tokens)
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1);
        console.log("Fan1 claimed VIP Pass reward");
        
        uint256 finalFanBalance = fanToken1.balanceOf(fan1);
        uint256 finalArtistBalance = fanToken1.balanceOf(artist1);
        
        console.log("After claim - Fan balance:", finalFanBalance);
        console.log("After claim - Artist balance:", finalArtistBalance);
        console.log("Fan status on reward:", artistContract1.getStatuFanOnReward(0, fan1));
        
        assertEq(artistContract1.getStatuFanOnReward(0, fan1), 2); // Claimed
        
        // Check token movements: 40% burned, 60% to artist
        uint256 price = 150;
        uint256 burnAmount = (price * 100) / 40; // 375
        uint256 artistAmount = (price * 100) / 60; // 250
        
        console.log("Expected burn amount:", burnAmount);
        console.log("Expected artist amount:", artistAmount);
        console.log("Actual fan balance change:", initialFanBalance - finalFanBalance);
        console.log("Actual artist balance change:", finalArtistBalance - initialArtistBalance);
        
        assertEq(fanToken1.balanceOf(fan1), initialFanBalance - burnAmount);
        assertEq(fanToken1.balanceOf(artist1), initialArtistBalance + artistAmount);
        
        console.log("[PASS] Test passed: Reward claimed and token economics work correctly");
    }
    
    function test_ClaimRewardFan_PermissionCheck() public {
        createRewards();
        
        // Fan cannot claim for someone else
        vm.prank(fan1);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.claimRewardFan(0, fan2);
        
        // Artist cannot claim
        vm.prank(artist1);
        vm.expectRevert(Artist.YouCantAchieveForSomeoneElse.selector);
        artistContract1.claimRewardFan(0, artist1);
    }
    
    function test_ClaimRewardFan_InvalidRewardId() public {
        vm.prank(fan1);
        vm.expectRevert(Artist.RewardOutOfBand.selector);
        artistContract1.claimRewardFan(999, fan1);
    }
    
    function test_ClaimRewardFan_InsufficientTokens() public {
        createRewards();
        
        vm.prank(fan1);
        vm.expectRevert("You don't have enough fan token");
        artistContract1.claimRewardFan(0, fan1);
    }
    
    function test_ClaimRewardFan_AlreadyClaimed() public {
        createMissions();
        createRewards();
        
        // Earn enough tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
        
        // Claim reward once
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1);
        
        // Try to claim again
        vm.prank(fan1);
        vm.expectRevert(Artist.RewardAlreadyClaim.selector);
        artistContract1.claimRewardFan(0, fan1);
    }
    
    function test_ClaimRewardFan_ClosedReward() public {
        createRewards();
        
        // Close reward
        vm.prank(artist1);
        artistContract1.closeReward(0);
        
        vm.prank(fan1);
        vm.expectRevert(Artist.RewardClose_.selector);
        artistContract1.claimRewardFan(0, fan1);
    }
    
    function test_CloseReward_Success() public {
        createRewards();
        
        vm.prank(artist1);
        artistContract1.closeReward(0);
        
        assertEq(artistContract1.getRewardStatus(0), 2); // Closed status
    }
    
    function test_CloseReward_OnlyArtist() public {
        createRewards();
        
        vm.prank(fan1);
        vm.expectRevert(Artist.YouAreNotTheArtist.selector);
        artistContract1.closeReward(0);
    }
    
    function test_CloseReward_InvalidRewardId() public {
        vm.prank(artist1);
        vm.expectRevert(Artist.RewardOutOfBand.selector);
        artistContract1.closeReward(999);
    }

    // ==================== MULTI-ARTIST AND MULTI-FAN SCENARIOS ====================
    
    function test_MultiArtistMultiFan_CompleteWorkflow() public {
        createMissions();
        createRewards();
        
        // Multiple fans register for Artist1's missions
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan2);
        artistContract1.registerFanOnMission(0, fan2);
        vm.prank(fan3);
        artistContract1.registerFanOnMission(1, fan3);
        
        // Multiple fans register for Artist2's missions
        vm.prank(fan1);
        artistContract2.registerFanOnMission(0, fan1);
        vm.prank(fan4);
        artistContract2.registerFanOnMission(1, fan4);
        
        // Fans complete missions
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        vm.prank(fan2);
        artistContract1.completeFanMission(0, fan2);
        vm.prank(fan1);
        artistContract2.completeFanMission(0, fan1);
        
        // Verify token balances
        assertEq(fanToken1.balanceOf(fan1), 100);
        assertEq(fanToken1.balanceOf(fan2), 100);
        assertEq(fanToken2.balanceOf(fan1), 80);
        assertEq(fanToken1.balanceOf(fan3), 0); // Didn't complete
        
        // Verify earned token tracking
        assertEq(fanToken1.balanceOfEarnedToken(fan1), 100);
        assertEq(fanToken1.balanceOfEarnedToken(fan2), 100);
        assertEq(fanToken2.balanceOfEarnedToken(fan1), 80);
    }
    
    function test_CrossArtistInteractions() public {
        createMissions();
        createRewards();
        
        // Fan1 earns tokens from Artist1
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        // Fan1 earns tokens from Artist2
        vm.prank(fan1);
        artistContract2.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract2.completeFanMission(0, fan1);
        
        // Verify separate token balances
        assertEq(fanToken1.balanceOf(fan1), 100);
        assertEq(fanToken2.balanceOf(fan1), 80);
        
        // Fan1 cannot use Artist1 tokens for Artist2 rewards
        vm.prank(fan1);
        vm.expectRevert("You don't have enough fan token");
        artistContract2.claimRewardFan(0, fan1); // Concert ticket costs 180, fan1 only has 80 in Artist2
    }
    
    function test_MultipleRewardClaims() public {
        createMissions();
        createRewards();
        
        // Fan earns enough tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
        vm.prank(fan1);
        artistContract1.registerFanOnMission(2, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(2, fan1);
        
        uint256 totalEarned = fanToken1.balanceOfEarnedToken(fan1); // 100 + 50 + 75 = 225
        assertEq(totalEarned, 225);
        
        // Claim multiple rewards
        vm.prank(fan1);
        artistContract1.claimRewardFan(1, fan1); // Signed Photo costs 75
        
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1); // VIP Pass costs 150
        
        // Verify both rewards are claimed
        assertEq(artistContract1.getStatuFanOnReward(0, fan1), 2);
        assertEq(artistContract1.getStatuFanOnReward(1, fan1), 2);
    }
    
    function test_ArtistEarningsFromRewards() public {
        createMissions();
        createRewards();
        
        // Multiple fans earn and spend tokens
        address[] memory fans = new address[](3);
        fans[0] = fan1;
        fans[1] = fan2;
        fans[2] = fan3;
        
        for (uint i = 0; i < fans.length; i++) {
            // Each fan completes multiple missions
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(0, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(0, fans[i]);
            
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(1, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(1, fans[i]);
            
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(2, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(2, fans[i]);
        }
        
        uint256 initialArtistBalance = fanToken1.balanceOf(artist1);
        
        // Fans claim rewards
        for (uint i = 0; i < fans.length; i++) {
            vm.prank(fans[i]);
            artistContract1.claimRewardFan(0, fans[i]); // VIP Pass costs 150
        }
        
        // Artist should receive 60% of each purchase: 150 * 100 / 60 = 250 per fan
        uint256 expectedEarnings = 250 * 3;
        assertEq(fanToken1.balanceOf(artist1), initialArtistBalance + expectedEarnings);
    }
    
    function test_MissionStatusTracking() public {
        createMissions();
        
        // Check initial statuses
        for (uint i = 0; i < 4; i++) {
            assertEq(artistContract1.getStatuFanOnMission(0, makeAddr(string(abi.encodePacked("fan", i)))), 0); // Not registered
        }
        
        // Fans register and complete at different stages
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 1); // Registered
        
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2); // Completed
        
        // Other fans still not registered
        assertEq(artistContract1.getStatuFanOnMission(0, fan2), 0);
        assertEq(artistContract1.getStatuFanOnMission(0, fan3), 0);
    }
    
    function test_RewardStatusTracking() public {
        createMissions();
        createRewards();
        
        // Fan earns tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
        
        // Check initial reward status
        assertEq(artistContract1.getStatuFanOnReward(1, fan1), 0); // Not claimed
        
        // Claim reward
        vm.prank(fan1);
        artistContract1.claimRewardFan(1, fan1); // Signed Photo
        
        // Check updated status
        assertEq(artistContract1.getStatuFanOnReward(1, fan1), 2); // Claimed
        
        // Other fans still not claimed
        assertEq(artistContract1.getStatuFanOnReward(1, fan2), 0);
        assertEq(artistContract1.getStatuFanOnReward(1, fan3), 0);
    }

    // ==================== EDGE CASES AND ERROR HANDLING ====================
    
    function test_RegisterTwiceOnSameMission() public {
        createMissions();
        
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        
        // Should not revert when registering again
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 1);
    }
    
    function test_RegisterOnCompletedMission() public {
        createMissions();
        
        // Complete mission first
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        // Try to register again after completion
        vm.prank(fan2);
        vm.expectRevert(Artist.MissionAlreadyComplete.selector);
        artistContract1.registerFanOnMission(0, fan2);
    }
    
    function test_CompleteWithoutRegistration() public {
        createMissions();
        
        // Try to complete without registering
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        // Should still work and auto-register
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2);
        assertEq(fanToken1.balanceOf(fan1), 100);
    }
    
    function test_TokenEconomics() public {
        createMissions();
        createRewards();
        
        uint256 initialTotalSupply = fanToken1.totalSupply();
        
        // Fan earns tokens
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        // Total supply should increase by 100
        assertEq(fanToken1.totalSupply(), initialTotalSupply + 100);
        
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
        vm.prank(fan1);
        artistContract1.registerFanOnMission(2, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(2, fan1);
        
        uint256 supplyAfterMissions = fanToken1.totalSupply();
        uint256 fanBalanceBefore = fanToken1.balanceOf(fan1);
        
        // Fan claims reward (burns tokens)
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1); // VIP Pass costs 150
        
        // Check burn amount: (150 * 100) / 40 = 375
        uint256 burnAmount = (150 * 100) / 40;
        assertEq(fanToken1.totalSupply(), supplyAfterMissions - burnAmount);
        assertEq(fanToken1.balanceOf(fan1), fanBalanceBefore - burnAmount);
    }
}
