# Chiliz Contract Documentation

## Overview

This project implements a fan engagement system where artists can create missions for their fans to complete and earn tokens. The system consists of two main contracts: `Artist` and `ArtistFactory`, along with a custom ERC20 token implementation called `CAP20`.

## Contract Architecture

### ArtistFactory Contract

**Location**: `src/ArtistFactory.sol`

The `ArtistFactory` is responsible for creating and managing multiple artist contracts.

#### Key Functions

- **`newArtist(string memory _name, string memory _symbole)`**
  - Creates a new Artist contract with custom token name and symbol
  - Increments the internal index counter
  - Stores the created artist contract in the mapping

- **`getArtist(uint256 index_)`**
  - Returns the Artist contract at the specified index
  - Used to retrieve previously created artist contracts

#### State Variables

- `mapping(uint256 => Artist) private _artist`: Maps index to Artist contract
- `uint256 public _index`: Current index for new artist creation

### Artist Contract

**Location**: `src/Artist.sol`

The `Artist` contract manages individual artist missions and fan interactions. Each artist has their own token and mission system.

#### Mission Structure

```solidity
struct _mission {
    string __name;                    // Mission name
    string __description;             // Mission description
    uint8 __missionStatus;           // 0 = closed, 1 = open
    uint256 __reward;                // Token reward amount
    mapping(address => uint8) __register; // Fan registration status
}
```

#### Key Functions

##### Mission Management

- **`openMission(string memory name_, string memory description_, uint256 reward_)`**
  - Creates a new mission with specified name, description, and reward
  - Sets mission status to open (1)
  - Returns the mission ID
  - Emits `MissionOpen` event

- **`closeMission(uint256 nb_mission_, address fanAddress_)`**
  - Closes a mission by setting status to 0
  - Only the artist can close their missions
  - Emits `MissionClose` event

##### Fan Registration and Completion

- **`registerFanOnMission(uint256 nb_mission_, address fanAddress_)`**
  - Registers a fan for a specific mission
  - Sets fan status to REGISTER (1)
  - Prevents registration if fan already completed the mission
  - Emits `Register` event

- **`completeFanMission(uint256 nb_mission_, address fanAddress_)`**
  - Completes a mission for a specific fan
  - Mints tokens to the fan's balance
  - Adds tokens to the fan's earned balance
  - Sets fan status to COMPLETE (2)
  - Emits `Complete` event

##### Query Functions

- **`getStatuFanOnMission(uint256 nb_mission_, address fanAddress_)`**
  - Returns the status of a fan on a specific mission
  - 0 = not registered, 1 = registered, 2 = completed

- **`getMissionStatus(uint256 nb_mission_)`**
  - Returns the current status of a mission
  - 0 = closed, 1 = open

#### State Variables

- `CAP20 public FanToken`: The artist's custom token contract
- `mapping(uint256 => _mission) private Mission`: Maps mission ID to mission data
- `uint256 private nb_mission`: Total number of missions created
- `uint8 constant REGISTER = 1`: Registration status constant
- `uint8 constant COMPLETE = 2`: Completion status constant

#### Events

- `MissionOpen(uint256, address)`: Emitted when a mission is created
- `MissionClose(uint256, address)`: Emitted when a mission is closed
- `Register(uint256, address)`: Emitted when a fan registers for a mission
- `Complete(uint256, address)`: Emitted when a fan completes a mission

#### Custom Errors

- `MissionOutOfBand()`: Thrown when accessing non-existent mission
- `MissionAlreadyComplete()`: Thrown when trying to register for already completed mission
- `MissionAlreadyClosed(uint256)`: Thrown when trying to complete a closed mission

## CAP20 Token Integration

**Location**: `lib/openzeppelin-contracts/token/ERC20/ERC20.sol`

The `CAP20` is a modified ERC20 token specifically designed for this fan engagement system. It extends the standard OpenZeppelin ERC20 implementation with additional functionality for tracking earned tokens.

### Key Features

- **Standard ERC20 Functionality**: Full compatibility with ERC20 standard
- **Earned Token Tracking**: Separate tracking of earned vs. transferred tokens
- **Artist-Specific Tokens**: Each artist has their own token instance

### Custom Functions

- **`balanceOfEarnedToken(address owner_)`**
  - Returns the amount of tokens earned by the specified address
  - Tracks tokens earned through mission completion vs. direct transfers

- **`addToEarned(address owner_, uint256 amount)`**
  - Adds tokens to the earned balance of the specified address
  - Called automatically when fans complete missions

- **`_mint(address to, uint256 amount)`**
  - Internal minting function for mission rewards
  - Increases both total supply and user balance

## Workflow Example

1. **Artist Creation**: Factory creates new Artist contract with custom token
2. **Mission Creation**: Artist creates missions with descriptions and rewards
3. **Fan Registration**: Fans register for missions they want to complete
4. **Mission Completion**: Fans complete missions and receive tokens
5. **Mission Closure**: Artist can close missions to prevent further completions

## Testing

The project includes comprehensive tests in `test/TestMissionMaker.t.sol` covering:

- Multi-fan scenarios with different completion patterns
- Multi-artist competition scenarios
- Strategic mission completion strategies
- Stress testing with many missions and fans
- Mission closure before all fans can complete

All tests include detailed logging of fan balances and mission statuses without using special characters for maximum compatibility.

## Usage Guidelines

1. **Artist Setup**: Use ArtistFactory to create artist contracts
2. **Mission Planning**: Create missions with clear descriptions and appropriate rewards
3. **Fan Engagement**: Encourage fans to register and complete missions
4. **Token Economics**: Balance mission rewards with token supply
5. **Mission Management**: Close missions when appropriate to maintain engagement

## Security Considerations

- Only artists can close their own missions
- Fans cannot complete missions they haven't registered for
- Fans cannot complete already completed missions
- Mission closure prevents further completions
- Token minting is controlled through the mission completion process 