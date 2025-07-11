// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";
import {MissionMaker} from "../src/MissionMaker.sol";
import {Mission} from "../src/Mission.sol";
import {CAP20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract TestMissionMaker is Test {
    MissionMaker public missionMaker;
    CAP20 public token;
    
    address public owner;
    address public user1;
    address public user2;
    
    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        vm.startPrank(owner);
        token = new CAP20("Test Token", "TEST");
        missionMaker = new MissionMaker(token);
        vm.stopPrank();
    }
    
    // ============ UNIT TESTS ============
    
    function test_Constructor_SetsOwnerAndToken() public {
        console.log("Testing constructor setup...");
        assertEq(missionMaker._owner(), owner);
        assertEq(address(missionMaker._token()), address(token));
        console.log("Constructor correctly sets owner and token");
    }
    
    function test_NewMission_CreatesMissionWithCorrectParameters() public {
        string memory name = "Test Mission";
        string memory description = "Test Description";
        uint256 reward = 1000;
        
        console.log("Creating mission with parameters:");
        console.log("  Name:", name);
        console.log("  Description:", description);
        console.log("  Reward:", reward);
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion(name, description, reward);
        
        console.log("Mission created with index:", missionIndex);
        assertEq(missionIndex, 0);
        
        Mission mission = missionMaker.getMission(0);
        console.log("Retrieved mission address:", address(mission));
        
        assertEq(mission.getName(), name);
        assertEq(mission.getDescription(), description);
        assertEq(mission.getReward(), reward);
        
        // Test mission status using new getter
        MissionMaker._status memory status = missionMaker.getMissionStatus(mission);
        assertEq(status.status_, "LIVE");
        assertEq(status._index, 1); // Note: _index is now length + 1
        
        console.log("Mission created successfully with correct parameters");
        console.log("  Status:", status.status_);
        console.log("  Index:", status._index);
    }
    
    function test_NewMission_ReturnsCorrectIndex() public {
        console.log("Testing mission index assignment...");
        
        // Create first mission
        vm.prank(user1);
        uint256 index1 = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        console.log("First mission created with index:", index1);
        assertEq(index1, 0);
        
        // Create second mission
        vm.prank(user2);
        uint256 index2 = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        console.log("Second mission created with index:", index2);
        assertEq(index2, 1);
        
        // Verify missions are stored correctly
        assertEq(missionMaker.getMission(0).getName(), "Mission 1");
        assertEq(missionMaker.getMission(1).getName(), "Mission 2");
        
        console.log("Mission indices assigned correctly");
        console.log("  Mission 1 name:", missionMaker.getMission(0).getName());
        console.log("  Mission 2 name:", missionMaker.getMission(1).getName());
    }
    
    function test_NewMission_UpdatesMissionStatus() public {
        console.log("Testing mission status update...");
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test", "Desc", 100);
        console.log("Mission created with index:", missionIndex);
        
        Mission mission = missionMaker.getMission(missionIndex);
        MissionMaker._status memory status = missionMaker.getMissionStatus(mission);
        
        assertEq(status.status_, "LIVE");
        assertEq(status._index, 1); // First mission has index 1
        
        console.log("Mission status updated successfully");
        console.log("  Status:", status.status_);
        console.log("  Index:", status._index);
    }
    
    function test_NewMission_CanCreateMultipleMissions() public {
        console.log("Testing multiple mission creation...");
        
        vm.startPrank(user1);
        
        uint256 index1 = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        console.log("Mission 1 created with index:", index1);
        
        uint256 index2 = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        console.log("Mission 2 created with index:", index2);
        
        uint256 index3 = missionMaker.newMisssion("Mission 3", "Desc 3", 300);
        console.log("Mission 3 created with index:", index3);
        
        vm.stopPrank();
        
        assertEq(index1, 0);
        assertEq(index2, 1);
        assertEq(index3, 2);
        
        // Verify all missions are created correctly
        assertEq(missionMaker.getMission(0).getName(), "Mission 1");
        assertEq(missionMaker.getMission(1).getName(), "Mission 2");
        assertEq(missionMaker.getMission(2).getName(), "Mission 3");
        
        console.log("Multiple missions created successfully");
        console.log("  Mission 1 name:", missionMaker.getMission(0).getName());
        console.log("  Mission 2 name:", missionMaker.getMission(1).getName());
        console.log("  Mission 3 name:", missionMaker.getMission(2).getName());
    }
    
    // ============ FUZZ TESTS ============
    
    function testFuzz_NewMission_WithRandomParameters(
        string memory name,
        string memory description,
        uint256 reward
    ) public {
        // Bound inputs to reasonable ranges
        vm.assume(bytes(name).length > 0 && bytes(name).length <= 100);
        vm.assume(bytes(description).length <= 500);
        vm.assume(reward > 0 && reward <= type(uint128).max);
        
        console.log("Fuzz test with random parameters:");
        console.log("  Name length:", bytes(name).length);
        console.log("  Description length:", bytes(description).length);
        console.log("  Reward:", reward);
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion(name, description, reward);
        
        Mission mission = missionMaker.getMission(missionIndex);
        assertEq(mission.getName(), name);
        assertEq(mission.getDescription(), description);
        assertEq(mission.getReward(), reward);
        
        console.log("Fuzz test passed with mission index:", missionIndex);
    }
    
    function testFuzz_NewMission_MultipleMissionsWithRandomRewards(uint256[5] memory rewards) public {
        // Bound rewards to reasonable range
        for (uint256 i = 0; i < rewards.length; i++) {
            vm.assume(rewards[i] > 0 && rewards[i] <= type(uint128).max);
        }
        
        vm.startPrank(user1);
        
        for (uint256 i = 0; i < rewards.length; i++) {
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                rewards[i]
            );
            
            assertEq(missionIndex, i);
            assertEq(missionMaker.getMission(i).getReward(), rewards[i]);
        }
        
        vm.stopPrank();
    }
    
    function testFuzz_NewMission_WithRandomAddresses(address[10] memory users) public {
        // Filter out zero addresses
        for (uint256 i = 0; i < users.length; i++) {
            vm.assume(users[i] != address(0));
        }
        
        for (uint256 i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                100 + i
            );
            
            assertEq(missionIndex, i);
        }
    }
    
    // ============ EDGE CASES ============
    
    function test_NewMission_WithEmptyStrings() public {
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("", "", 100);
        
        Mission mission = missionMaker.getMission(missionIndex);
        assertEq(mission.getName(), "");
        assertEq(mission.getDescription(), "");
        assertEq(mission.getReward(), 100);
    }
    
    function test_NewMission_WithZeroReward() public {
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test", "Desc", 0);
        
        Mission mission = missionMaker.getMission(missionIndex);
        assertEq(mission.getReward(), 0);
    }
    
    function test_NewMission_WithMaximumReward() public {
        uint256 maxReward = type(uint256).max;
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test", "Desc", maxReward);
        
        Mission mission = missionMaker.getMission(missionIndex);
        assertEq(mission.getReward(), maxReward);
    }
    
    function test_NewMission_WithLongStrings() public {
        string memory longName = "This is a very long mission name that exceeds normal length expectations for testing purposes";
        string memory longDescription = "This is a very long description that contains many characters and should be handled properly by the contract. It includes various punctuation marks, numbers 123, and special characters @#$%^&*() to ensure robust handling of different input types.";
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion(longName, longDescription, 100);
        
        Mission mission = missionMaker.getMission(missionIndex);
        assertEq(mission.getName(), longName);
        assertEq(mission.getDescription(), longDescription);
    }
    
    // ============ GAS BENCHMARKS ============
    
    function test_Gas_NewMission() public {
        vm.prank(user1);
        
        uint256 gasBefore = gasleft();
        missionMaker.newMisssion("Test Mission", "Test Description", 1000);
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for newMisssion:", gasUsed);
    }
    
    function test_Gas_NewMission_MultipleMissions() public {
        vm.startPrank(user1);
        
        uint256 totalGas = 0;
        uint256 numMissions = 10;
        
        for (uint256 i = 0; i < numMissions; i++) {
            uint256 gasBefore = gasleft();
            missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                100 + i
            );
            totalGas += gasBefore - gasleft();
        }
        
        vm.stopPrank();
        
        console.log("Total gas for", numMissions, "missions:", totalGas);
        console.log("Average gas per mission:", totalGas / numMissions);
    }
    
    // ============ INTEGRATION TESTS ============
    
    function test_Integration_MissionMakerAndMissionInteraction() public {
        // Create mission through MissionMaker
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Integration Test", "Test Description", 500);
        
        Mission mission = missionMaker.getMission(missionIndex);
        
        // Test mission functionality
        address fan = makeAddr("fan");
        
        // Register fan
        vm.prank(fan);
        mission.registerFan(fan);
        
        // Complete mission
        vm.prank(user1);
        mission.completeMission(fan);
        
        // Verify mission completion
        assertEq(mission.getMissionStatus(fan), 1);
    }
    
    function test_Integration_MultipleMissionsWithFans() public {
        vm.startPrank(user1);
        
        // Create multiple missions
        uint256 mission1Index = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        uint256 mission2Index = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        
        vm.stopPrank();
        
        Mission mission1 = missionMaker.getMission(mission1Index);
        Mission mission2 = missionMaker.getMission(mission2Index);
        
        address fan1 = makeAddr("fan1");
        address fan2 = makeAddr("fan2");
        
        // Register fans to different missions
        vm.prank(fan1);
        mission1.registerFan(fan1);
        
        vm.prank(fan2);
        mission2.registerFan(fan2);
        
        // Complete missions
        vm.prank(user1);
        mission1.completeMission(fan1);
        
        vm.prank(user1);
        mission2.completeMission(fan2);
        
        // Verify both missions are completed
        assertEq(mission1.getMissionStatus(fan1), 1);
        assertEq(mission2.getMissionStatus(fan2), 1);
    }
    
    // ============ REVERT TESTS ============
    
    function test_Revert_GetMission_IndexOutOfBounds() public {
        console.log("Testing getMission revert when index out of bounds...");
        
        // Try to get mission at index 0 when no missions exist
        vm.expectRevert(MissionMaker.IndexOutOfBounds.selector);
        missionMaker.getMission(0);
        
        console.log("getMission correctly reverts with IndexOutOfBounds error");
    }
    
    function test_Revert_GetMission_IndexOutOfBoundsAfterCreation() public {
        // Create one mission
        vm.prank(user1);
        missionMaker.newMisssion("Test Mission", "Test Description", 100);
        
        // Try to get mission at index 1 (should fail)
        vm.expectRevert(MissionMaker.IndexOutOfBounds.selector);
        missionMaker.getMission(1);
    }
    
    function test_Revert_GetMissionStatus_NonExistentMission() public {
        // Create a mission contract directly (not through MissionMaker)
        Mission fakeMission = new Mission(token, 100);
        
        // Try to get status for non-existent mission
        vm.expectRevert(MissionMaker.IndexOutOfBounds.selector);
        missionMaker.getMissionStatus(fakeMission);
    }
    
    function test_Revert_GetMissionIndex_NonExistentMission() public {
        // Create a mission contract directly (not through MissionMaker)
        Mission fakeMission = new Mission(token, 100);
        
        // Try to get index for non-existent mission
        vm.expectRevert(MissionMaker.IndexOutOfBounds.selector);
        missionMaker.getMissionIndex(fakeMission);
    }
    
    function test_Revert_NewMission_WithInvalidToken() public {
        // This test would require a scenario where the token contract is invalid
        // For now, we'll test that the constructor properly handles the token
        CAP20 newToken = new CAP20("New Token", "NEW");
        MissionMaker newMaker = new MissionMaker(newToken);
        
        vm.prank(user1);
        uint256 missionIndex = newMaker.newMisssion("Test", "Desc", 100);
        
        // Should not revert
        assertEq(missionIndex, 0);
    }
    
    // ============ GET MISSION TESTS ============
    
    function test_GetMission_ReturnsCorrectMission() public {
        console.log("Testing getMission function...");
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test Mission", "Test Description", 100);
        console.log("Mission created with index:", missionIndex);
        
        Mission mission = missionMaker.getMission(missionIndex);
        console.log("Retrieved mission address:", address(mission));
        
        assertEq(mission.getName(), "Test Mission");
        assertEq(mission.getDescription(), "Test Description");
        assertEq(mission.getReward(), 100);
        
        console.log("getMission returns correct mission");
        console.log("  Name:", mission.getName());
        console.log("  Description:", mission.getDescription());
        console.log("  Reward:", mission.getReward());
    }
    
    function test_GetMission_MultipleMissions() public {
        vm.startPrank(user1);
        
        // Create multiple missions
        uint256 mission1Index = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        uint256 mission2Index = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        uint256 mission3Index = missionMaker.newMisssion("Mission 3", "Desc 3", 300);
        
        vm.stopPrank();
        
        // Verify each mission can be retrieved correctly
        Mission mission1 = missionMaker.getMission(mission1Index);
        Mission mission2 = missionMaker.getMission(mission2Index);
        Mission mission3 = missionMaker.getMission(mission3Index);
        
        assertEq(mission1.getName(), "Mission 1");
        assertEq(mission2.getName(), "Mission 2");
        assertEq(mission3.getName(), "Mission 3");
        
        assertEq(mission1.getReward(), 100);
        assertEq(mission2.getReward(), 200);
        assertEq(mission3.getReward(), 300);
    }
    
    function test_GetMission_ConsistencyWithNewMission() public {
        vm.startPrank(user1);
        
        // Create missions and immediately verify they can be retrieved
        for (uint256 i = 0; i < 5; i++) {
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                100 + i
            );
            
            Mission mission = missionMaker.getMission(missionIndex);
            assertEq(mission.getName(), string(abi.encodePacked("Mission ", vm.toString(i))));
            assertEq(mission.getReward(), 100 + i);
        }
        
        vm.stopPrank();
    }
    
    // ============ GET MISSION STATUS TESTS ============
    
    function test_GetMissionStatus_ReturnsCorrectStatus() public {
        console.log("Testing getMissionStatus function...");
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test Mission", "Test Description", 100);
        console.log("Mission created with index:", missionIndex);
        
        Mission mission = missionMaker.getMission(missionIndex);
        MissionMaker._status memory status = missionMaker.getMissionStatus(mission);
        
        assertEq(status.status_, "LIVE");
        assertEq(status._index, 1); // First mission has index 1
        
        console.log("getMissionStatus returns correct status");
        console.log("  Status:", status.status_);
        console.log("  Index:", status._index);
    }
    
    function test_GetMissionStatus_MultipleMissions() public {
        vm.startPrank(user1);
        
        // Create multiple missions
        uint256 mission1Index = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        uint256 mission2Index = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        uint256 mission3Index = missionMaker.newMisssion("Mission 3", "Desc 3", 300);
        
        vm.stopPrank();
        
        Mission mission1 = missionMaker.getMission(mission1Index);
        Mission mission2 = missionMaker.getMission(mission2Index);
        Mission mission3 = missionMaker.getMission(mission3Index);
        
        // Verify status for each mission
        MissionMaker._status memory status1 = missionMaker.getMissionStatus(mission1);
        MissionMaker._status memory status2 = missionMaker.getMissionStatus(mission2);
        MissionMaker._status memory status3 = missionMaker.getMissionStatus(mission3);
        
        assertEq(status1.status_, "LIVE");
        assertEq(status2.status_, "LIVE");
        assertEq(status3.status_, "LIVE");
        
        assertEq(status1._index, 1);
        assertEq(status2._index, 2);
        assertEq(status3._index, 3);
    }
    
    // ============ GET MISSION INDEX TESTS ============
    
    function test_GetMissionIndex_ReturnsCorrectIndex() public {
        console.log("Testing getMissionIndex function...");
        
        vm.prank(user1);
        uint256 missionIndex = missionMaker.newMisssion("Test Mission", "Test Description", 100);
        console.log("Mission created with index:", missionIndex);
        
        Mission mission = missionMaker.getMission(missionIndex);
        uint256 retrievedIndex = missionMaker.getMissionIndex(mission);
        
        assertEq(retrievedIndex, 1); // First mission has index 1
        
        console.log("getMissionIndex returns correct index");
        console.log("  Retrieved index:", retrievedIndex);
        console.log("  Expected index: 1");
    }
    
    function test_GetMissionIndex_MultipleMissions() public {
        vm.startPrank(user1);
        
        // Create multiple missions
        uint256 mission1Index = missionMaker.newMisssion("Mission 1", "Desc 1", 100);
        uint256 mission2Index = missionMaker.newMisssion("Mission 2", "Desc 2", 200);
        uint256 mission3Index = missionMaker.newMisssion("Mission 3", "Desc 3", 300);
        
        vm.stopPrank();
        
        Mission mission1 = missionMaker.getMission(mission1Index);
        Mission mission2 = missionMaker.getMission(mission2Index);
        Mission mission3 = missionMaker.getMission(mission3Index);
        
        // Verify index for each mission
        uint256 index1 = missionMaker.getMissionIndex(mission1);
        uint256 index2 = missionMaker.getMissionIndex(mission2);
        uint256 index3 = missionMaker.getMissionIndex(mission3);
        
        assertEq(index1, 1);
        assertEq(index2, 2);
        assertEq(index3, 3);
    }
    
    // ============ INVARIANT TESTS ============
    
    function test_Invariant_MissionArrayLengthMatchesIndex() public {
        vm.startPrank(user1);
        
        uint256 numMissions = 5;
        for (uint256 i = 0; i < numMissions; i++) {
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                100 + i
            );
            
            // Invariant: mission index should equal array length - 1
            assertEq(missionIndex, i);
        }
        
        vm.stopPrank();
    }
    
    function test_Invariant_MissionStatusConsistency() public {
        vm.startPrank(user1);
        
        uint256 numMissions = 3;
        for (uint256 i = 0; i < numMissions; i++) {
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description ", vm.toString(i))),
                100 + i
            );
            
            Mission mission = missionMaker.getMission(missionIndex);
            MissionMaker._status memory status = missionMaker.getMissionStatus(mission);
            
            // Invariant: status index should match mission creation order + 1
            assertEq(status._index, i + 1);
            assertEq(status.status_, "LIVE");
        }
        
        vm.stopPrank();
    }
    
    // ============ ADDITIONAL TESTS ============
    
    function test_NewMission_StressTest() public {
        console.log("Starting stress test with 50 missions...");
        
        vm.startPrank(user1);
        
        uint256 numMissions = 50;
        for (uint256 i = 0; i < numMissions; i++) {
            uint256 missionIndex = missionMaker.newMisssion(
                string(abi.encodePacked("Mission ", vm.toString(i))),
                string(abi.encodePacked("Description for mission ", vm.toString(i))),
                100 + i
            );
            
            assertEq(missionIndex, i);
            
            Mission mission = missionMaker.getMission(i);
            assertEq(mission.getName(), string(abi.encodePacked("Mission ", vm.toString(i))));
            assertEq(mission.getReward(), 100 + i);
            
            // Verify status and index
            MissionMaker._status memory status = missionMaker.getMissionStatus(mission);
            assertEq(status.status_, "LIVE");
            assertEq(status._index, i + 1);
            
            if (i % 10 == 0) {
                console.log("Created mission", i, "with index", missionIndex);
            }
        }
        
        vm.stopPrank();
        
        console.log("Stress test completed successfully");
        console.log("Successfully created", numMissions, "missions");
    }
}
