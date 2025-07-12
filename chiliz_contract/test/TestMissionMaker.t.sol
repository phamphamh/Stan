// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";
import {CAP20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import { Artist } from "../src/Artist.sol";
import { ArtistFactory } from "../src/ArtistFactory.sol";

<<<<<<< Updated upstream
contract TestArtistAndFactory is Test {
=======
contract TestMissionMaker is Test {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        createMissions();
        createRewards();
        
        // Multiple fans register for Artist1's missions
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan2);
        artistContract1.registerFanOnMission(0, fan2);
        vm.prank(fan3);
        artistContract1.registerFanOnMission(1, fan3);
=======
        console.log("=== TEST: MultiArtist MultiFan Complete Workflow ===");
        createMissions();
        createRewards();
        
        console.log("Setting up multi-artist, multi-fan scenario:");
        console.log("Artist1:", artist1, "Token:", address(fanToken1));
        console.log("Artist2:", artist2, "Token:", address(fanToken2));
        console.log("Fan1:", fan1);
        console.log("Fan2:", fan2);
        console.log("Fan3:", fan3);
        console.log("Fan4:", fan4);
        
        // Multiple fans register for Artist1's missions
        console.log("\n--- Fan Registration Phase ---");
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        console.log("Fan1 registered for Artist1 Mission 0 (Dance Challenge)");
        
        vm.prank(fan2);
        artistContract1.registerFanOnMission(0, fan2);
        console.log("Fan2 registered for Artist1 Mission 0 (Dance Challenge)");
        
        vm.prank(fan3);
        artistContract1.registerFanOnMission(1, fan3);
        console.log("Fan3 registered for Artist1 Mission 1 (Share Story)");
>>>>>>> Stashed changes
        
        // Multiple fans register for Artist2's missions
        vm.prank(fan1);
        artistContract2.registerFanOnMission(0, fan1);
<<<<<<< Updated upstream
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
=======
        console.log("Fan1 registered for Artist2 Mission 0 (Music Quiz)");
        
        vm.prank(fan4);
        artistContract2.registerFanOnMission(1, fan4);
        console.log("Fan4 registered for Artist2 Mission 1 (Cover Song)");
        
        // Fans complete missions
        console.log("\n--- Mission Completion Phase ---");
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        console.log("Fan1 completed Artist1 Mission 0 (+100 tokens)");
        
        vm.prank(fan2);
        artistContract1.completeFanMission(0, fan2);
        console.log("Fan2 completed Artist1 Mission 0 (+100 tokens)");
        
        vm.prank(fan1);
        artistContract2.completeFanMission(0, fan1);
        console.log("Fan1 completed Artist2 Mission 0 (+80 tokens)");
        
        console.log("Fan3 registered but did not complete mission");
        console.log("Fan4 registered but did not complete mission");
        
        // Verify token balances
        console.log("\n--- Token Balance Verification ---");
        uint256 fan1Token1 = fanToken1.balanceOf(fan1);
        uint256 fan2Token1 = fanToken1.balanceOf(fan2);
        uint256 fan1Token2 = fanToken2.balanceOf(fan1);
        uint256 fan3Token1 = fanToken1.balanceOf(fan3);
        
        console.log("Fan1 Artist1 token balance:", fan1Token1);
        console.log("Fan2 Artist1 token balance:", fan2Token1);
        console.log("Fan1 Artist2 token balance:", fan1Token2);
        console.log("Fan3 Artist1 token balance:", fan3Token1);
        
>>>>>>> Stashed changes
        assertEq(fanToken1.balanceOf(fan1), 100);
        assertEq(fanToken1.balanceOf(fan2), 100);
        assertEq(fanToken2.balanceOf(fan1), 80);
        assertEq(fanToken1.balanceOf(fan3), 0); // Didn't complete
        
        // Verify earned token tracking
<<<<<<< Updated upstream
        assertEq(fanToken1.balanceOfEarnedToken(fan1), 100);
        assertEq(fanToken1.balanceOfEarnedToken(fan2), 100);
        assertEq(fanToken2.balanceOfEarnedToken(fan1), 80);
    }
    
    function test_CrossArtistInteractions() public {
        createMissions();
        createRewards();
        
        // Fan1 earns tokens from Artist1
=======
        console.log("\n--- Earned Token Verification ---");
        uint256 fan1Earned1 = fanToken1.balanceOfEarnedToken(fan1);
        uint256 fan2Earned1 = fanToken1.balanceOfEarnedToken(fan2);
        uint256 fan1Earned2 = fanToken2.balanceOfEarnedToken(fan1);
        
        console.log("Fan1 earned from Artist1:", fan1Earned1);
        console.log("Fan2 earned from Artist1:", fan2Earned1);
        console.log("Fan1 earned from Artist2:", fan1Earned2);
        
        assertEq(fanToken1.balanceOfEarnedToken(fan1), 100);
        assertEq(fanToken1.balanceOfEarnedToken(fan2), 100);
        assertEq(fanToken2.balanceOfEarnedToken(fan1), 80);
        
        console.log("[PASS] Test passed: Multi-artist multi-fan workflow completed successfully");
    }
    
    function test_CrossArtistInteractions() public {
        console.log("=== TEST: Cross Artist Interactions ===");
        createMissions();
        createRewards();
        
        console.log("Testing token isolation between different artists");
        console.log("Fan1 address:", fan1);
        
        // Fan1 earns tokens from Artist1
        console.log("\n--- Artist1 Token Earning ---");
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
<<<<<<< Updated upstream
        
        // Fan1 earns tokens from Artist2
=======
        console.log("Fan1 completed Artist1 mission (Dance Challenge +100 tokens)");
        
        // Fan1 earns tokens from Artist2
        console.log("\n--- Artist2 Token Earning ---");
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract2.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract2.completeFanMission(0, fan1);
<<<<<<< Updated upstream
        
        // Verify separate token balances
=======
        console.log("Fan1 completed Artist2 mission (Music Quiz +80 tokens)");
        
        // Verify separate token balances
        console.log("\n--- Token Balance Verification ---");
        uint256 fan1Artist1Balance = fanToken1.balanceOf(fan1);
        uint256 fan1Artist2Balance = fanToken2.balanceOf(fan1);
        
        console.log("Fan1 Artist1 token balance:", fan1Artist1Balance);
        console.log("Fan1 Artist2 token balance:", fan1Artist2Balance);
        console.log("Artist2 Concert Ticket reward price: 180 tokens");
        console.log("Fan1 has only 80 Artist2 tokens, cannot afford 180 token reward");
        
>>>>>>> Stashed changes
        assertEq(fanToken1.balanceOf(fan1), 100);
        assertEq(fanToken2.balanceOf(fan1), 80);
        
        // Fan1 cannot use Artist1 tokens for Artist2 rewards
<<<<<<< Updated upstream
        vm.prank(fan1);
        vm.expectRevert("You don't have enough fan token");
        artistContract2.claimRewardFan(0, fan1); // Concert ticket costs 180, fan1 only has 80 in Artist2
    }
    
    function test_MultipleRewardClaims() public {
        createMissions();
        createRewards();
        
        // Fan earns enough tokens
=======
        console.log("\n--- Cross-Artist Token Usage Test ---");
        console.log("Testing: Fan1 trying to claim Artist2 reward with insufficient Artist2 tokens");
        vm.prank(fan1);
        vm.expectRevert("You don't have enough fan token");
        artistContract2.claimRewardFan(0, fan1); // Concert ticket costs 180, fan1 only has 80 in Artist2
        
        console.log("[PASS] Test passed: Token isolation working correctly - cannot use Artist1 tokens for Artist2 rewards");
    }
    
    function test_MultipleRewardClaims() public {
        console.log("=== TEST: Multiple Reward Claims ===");
        createMissions();
        createRewards();
        
        console.log("Testing sequential reward claims by same fan");
        console.log("Available rewards:");
        console.log("  Reward 0: VIP Pass (150 tokens)");
        console.log("  Reward 1: Signed Photo (75 tokens)");
        console.log("  Reward 2: Video Call (200 tokens)");
        
        // Fan earns enough tokens
        console.log("\n--- Token Earning Phase ---");
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
<<<<<<< Updated upstream
=======
        console.log("Fan1 completed mission 0 (+100 tokens)");
        
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
<<<<<<< Updated upstream
=======
        console.log("Fan1 completed mission 1 (+50 tokens)");
        
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(2, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(2, fan1);
<<<<<<< Updated upstream
        
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
        
=======
        console.log("Fan1 completed mission 2 (+75 tokens)");
        
        uint256 totalEarned = fanToken1.balanceOfEarnedToken(fan1); // 100 + 50 + 75 = 225
        uint256 currentBalance = fanToken1.balanceOf(fan1);
        console.log("\nFan1 total earned tokens:", totalEarned);
        console.log("Fan1 current balance:", currentBalance);
        
        assertEq(totalEarned, 225);
        
        // Claim multiple rewards
        console.log("\n--- Multiple Reward Claims ---");
        
        console.log("Claiming Signed Photo (75 tokens)...");
        vm.prank(fan1);
        artistContract1.claimRewardFan(1, fan1); // Signed Photo costs 75
        
        uint256 balanceAfterFirst = fanToken1.balanceOf(fan1);
        uint256 status1 = artistContract1.getStatuFanOnReward(1, fan1);
        console.log("After first claim - Balance:", balanceAfterFirst);
        console.log("Signed Photo status:", status1);
        
        console.log("\nClaiming VIP Pass (150 tokens)...");
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1); // VIP Pass costs 150
        
        uint256 balanceAfterSecond = fanToken1.balanceOf(fan1);
        uint256 status0 = artistContract1.getStatuFanOnReward(0, fan1);
        console.log("After second claim - Balance:", balanceAfterSecond);
        console.log("VIP Pass status:", status0);
        
        // Verify both rewards are claimed
        assertEq(artistContract1.getStatuFanOnReward(0, fan1), 2);
        assertEq(artistContract1.getStatuFanOnReward(1, fan1), 2);
        
        console.log("\n--- Final Status ---");
        console.log("Both rewards successfully claimed");
        console.log("VIP Pass status:", artistContract1.getStatuFanOnReward(0, fan1));
        console.log("Signed Photo status:", artistContract1.getStatuFanOnReward(1, fan1));
        console.log("Video Call status (unclaimed):", artistContract1.getStatuFanOnReward(2, fan1));
        
        console.log("[PASS] Test passed: Multiple reward claims working correctly");
    }
    
    function test_ArtistEarningsFromRewards() public {
        console.log("=== TEST: Artist Earnings From Rewards ===");
        createMissions();
        createRewards();
        
        console.log("Testing artist revenue from multiple fan reward purchases");
        console.log("VIP Pass price: 150 tokens");
        console.log("Token economics: 40% burned, 60% to artist");
        console.log("Expected artist earning per purchase: 150 * 100 / 60 = 250 tokens");
        
>>>>>>> Stashed changes
        // Multiple fans earn and spend tokens
        address[] memory fans = new address[](3);
        fans[0] = fan1;
        fans[1] = fan2;
        fans[2] = fan3;
        
<<<<<<< Updated upstream
        for (uint i = 0; i < fans.length; i++) {
=======
        console.log("\n--- Fan Token Earning Phase ---");
        for (uint i = 0; i < fans.length; i++) {
            console.log("Fan", i+1, "earning tokens:", fans[i]);
            
>>>>>>> Stashed changes
            // Each fan completes multiple missions
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(0, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(0, fans[i]);
<<<<<<< Updated upstream
=======
            console.log("  Completed mission 0 (+100 tokens)");
>>>>>>> Stashed changes
            
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(1, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(1, fans[i]);
<<<<<<< Updated upstream
=======
            console.log("  Completed mission 1 (+50 tokens)");
>>>>>>> Stashed changes
            
            vm.prank(fans[i]);
            artistContract1.registerFanOnMission(2, fans[i]);
            vm.prank(fans[i]);
            artistContract1.completeFanMission(2, fans[i]);
<<<<<<< Updated upstream
        }
        
        uint256 initialArtistBalance = fanToken1.balanceOf(artist1);
        
        // Fans claim rewards
        for (uint i = 0; i < fans.length; i++) {
=======
            console.log("  Completed mission 2 (+75 tokens)");
            console.log("  Total earned: 225 tokens");
        }
        
        uint256 initialArtistBalance = fanToken1.balanceOf(artist1);
        console.log("\n--- Before Reward Claims ---");
        console.log("Artist1 initial balance:", initialArtistBalance);
        
        // Fans claim rewards
        console.log("\n--- Reward Claiming Phase ---");
        for (uint i = 0; i < fans.length; i++) {
            console.log("Fan", i+1, "claiming VIP Pass reward");
>>>>>>> Stashed changes
            vm.prank(fans[i]);
            artistContract1.claimRewardFan(0, fans[i]); // VIP Pass costs 150
        }
        
<<<<<<< Updated upstream
        // Artist should receive 60% of each purchase: 150 * 100 / 60 = 250 per fan
        uint256 expectedEarnings = 250 * 3;
        assertEq(fanToken1.balanceOf(artist1), initialArtistBalance + expectedEarnings);
    }
    
    function test_MissionStatusTracking() public {
        createMissions();
        
        // Check initial statuses
        for (uint i = 0; i < 4; i++) {
=======
        uint256 finalArtistBalance = fanToken1.balanceOf(artist1);
        console.log("\n--- After All Claims ---");
        console.log("Artist1 final balance:", finalArtistBalance);
        console.log("Artist1 earnings:", finalArtistBalance - initialArtistBalance);
        
        // Artist should receive 60% of each purchase: 150 * 100 / 60 = 250 per fan
        uint256 expectedEarnings = 250 * 3;
        console.log("Expected total earnings:", expectedEarnings);
        console.log("Actual total earnings:", finalArtistBalance - initialArtistBalance);
        
        assertEq(fanToken1.balanceOf(artist1), initialArtistBalance + expectedEarnings);
        
        console.log("[PASS] Test passed: Artist receives correct revenue share from reward purchases");
    }
    
    function test_MissionStatusTracking() public {
        console.log("=== TEST: Mission Status Tracking ===");
        createMissions();
        
        console.log("Testing mission status transitions: 0=NotRegistered, 1=Registered, 2=Completed");
        
        // Check initial statuses
        console.log("\n--- Initial Status Check ---");
        for (uint i = 0; i < 4; i++) {
            address testFan = makeAddr(string(abi.encodePacked("fan", i)));
            uint256 status = artistContract1.getStatuFanOnMission(0, testFan);
            console.log("Fan", i, "initial status:", status);
>>>>>>> Stashed changes
            assertEq(artistContract1.getStatuFanOnMission(0, makeAddr(string(abi.encodePacked("fan", i)))), 0); // Not registered
        }
        
        // Fans register and complete at different stages
<<<<<<< Updated upstream
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 1); // Registered
        
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2); // Completed
        
        // Other fans still not registered
        assertEq(artistContract1.getStatuFanOnMission(0, fan2), 0);
        assertEq(artistContract1.getStatuFanOnMission(0, fan3), 0);
=======
        console.log("\n--- Fan1 Registration ---");
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        uint256 fan1Status = artistContract1.getStatuFanOnMission(0, fan1);
        console.log("Fan1 status after registration:", fan1Status);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 1); // Registered
        
        console.log("\n--- Fan1 Completion ---");
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        fan1Status = artistContract1.getStatuFanOnMission(0, fan1);
        console.log("Fan1 status after completion:", fan1Status);
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2); // Completed
        
        // Other fans still not registered
        console.log("\n--- Other Fans Status Check ---");
        uint256 fan2Status = artistContract1.getStatuFanOnMission(0, fan2);
        uint256 fan3Status = artistContract1.getStatuFanOnMission(0, fan3);
        console.log("Fan2 status (should be 0):", fan2Status);
        console.log("Fan3 status (should be 0):", fan3Status);
        
        assertEq(artistContract1.getStatuFanOnMission(0, fan2), 0);
        assertEq(artistContract1.getStatuFanOnMission(0, fan3), 0);
        
        console.log("[PASS] Test passed: Mission status tracking working correctly");
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        createMissions();
        
        // Try to complete without registering
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        // Should still work and auto-register
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2);
        assertEq(fanToken1.balanceOf(fan1), 100);
    }
    
    function test_TokenEconomics() public {
=======
        console.log("=== TEST: Complete Without Registration ===");
        createMissions();
        
        console.log("Testing auto-registration when completing mission without prior registration");
        console.log("Fan1 initial status on mission 0:", artistContract1.getStatuFanOnMission(0, fan1));
        console.log("Fan1 initial token balance:", fanToken1.balanceOf(fan1));
        
        // Try to complete without registering
        console.log("\nFan1 attempting to complete mission 0 without registration");
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
        
        uint256 finalStatus = artistContract1.getStatuFanOnMission(0, fan1);
        uint256 finalBalance = fanToken1.balanceOf(fan1);
        
        console.log("Fan1 final status on mission 0:", finalStatus);
        console.log("Fan1 final token balance:", finalBalance);
        
        // Should still work and auto-register
        assertEq(artistContract1.getStatuFanOnMission(0, fan1), 2);
        assertEq(fanToken1.balanceOf(fan1), 100);
        
        console.log("[PASS] Test passed: Auto-registration works when completing mission directly");
    }
    
    function test_TokenEconomics() public {
        console.log("=== TEST: Token Economics ===");
>>>>>>> Stashed changes
        createMissions();
        createRewards();
        
        uint256 initialTotalSupply = fanToken1.totalSupply();
<<<<<<< Updated upstream
        
        // Fan earns tokens
=======
        console.log("Initial total supply:", initialTotalSupply);
        
        // Fan earns tokens
        console.log("\n--- Token Minting Phase ---");
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(0, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(0, fan1);
<<<<<<< Updated upstream
=======
        console.log("Fan1 completed mission 0 (+100 tokens)");
        
        uint256 supplyAfterFirst = fanToken1.totalSupply();
        console.log("Total supply after first mission:", supplyAfterFirst);
        console.log("Supply increase:", supplyAfterFirst - initialTotalSupply);
>>>>>>> Stashed changes
        
        // Total supply should increase by 100
        assertEq(fanToken1.totalSupply(), initialTotalSupply + 100);
        
        vm.prank(fan1);
        artistContract1.registerFanOnMission(1, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(1, fan1);
<<<<<<< Updated upstream
=======
        console.log("Fan1 completed mission 1 (+50 tokens)");
        
>>>>>>> Stashed changes
        vm.prank(fan1);
        artistContract1.registerFanOnMission(2, fan1);
        vm.prank(fan1);
        artistContract1.completeFanMission(2, fan1);
<<<<<<< Updated upstream
=======
        console.log("Fan1 completed mission 2 (+75 tokens)");
>>>>>>> Stashed changes
        
        uint256 supplyAfterMissions = fanToken1.totalSupply();
        uint256 fanBalanceBefore = fanToken1.balanceOf(fan1);
        
<<<<<<< Updated upstream
        // Fan claims reward (burns tokens)
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1); // VIP Pass costs 150
        
        // Check burn amount: (150 * 100) / 40 = 375
        uint256 burnAmount = (150 * 100) / 40;
        assertEq(fanToken1.totalSupply(), supplyAfterMissions - burnAmount);
        assertEq(fanToken1.balanceOf(fan1), fanBalanceBefore - burnAmount);
    }
}
=======
        console.log("\n--- Before Reward Claim ---");
        console.log("Total supply after all missions:", supplyAfterMissions);
        console.log("Fan balance before claim:", fanBalanceBefore);
        console.log("Expected total earned: 100 + 50 + 75 = 225 tokens");
        
        // Fan claims reward (burns tokens)
        console.log("\n--- Token Burning Phase ---");
        console.log("Fan1 claiming VIP Pass (150 tokens)");
        console.log("Token economics: 40% burned, 60% to artist");
        
        vm.prank(fan1);
        artistContract1.claimRewardFan(0, fan1); // VIP Pass costs 150
        
        uint256 finalSupply = fanToken1.totalSupply();
        uint256 finalFanBalance = fanToken1.balanceOf(fan1);
        
        console.log("\n--- After Reward Claim ---");
        console.log("Final total supply:", finalSupply);
        console.log("Final fan balance:", finalFanBalance);
        
        // Check burn amount: (150 * 100) / 40 = 375
        uint256 burnAmount = (150 * 100) / 40;
        console.log("Expected burn amount:", burnAmount);
        console.log("Actual supply decrease:", supplyAfterMissions - finalSupply);
        console.log("Actual fan balance decrease:", fanBalanceBefore - finalFanBalance);
        
        assertEq(fanToken1.totalSupply(), supplyAfterMissions - burnAmount);
        assertEq(fanToken1.balanceOf(fan1), fanBalanceBefore - burnAmount);
        
        console.log("[PASS] Test passed: Token economics working correctly (mint on mission complete, burn on reward claim)");
    }
}
>>>>>>> Stashed changes
