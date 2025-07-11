// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title STAN Token
 * @dev Token d'achat pour projet K-Pop sur Chiliz Chain (CAP-20)
 * @notice Standard CAP-20 avec 0 décimales
 */
contract STAN {
    // Token metadata
    string public constant name = "STAN Token";
    string public constant symbol = "STAN";
    uint8 public constant decimals = 0;
    
    // State variables
    uint256 public totalSupply;
    address public owner;
    
    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping( address => uint256 ) private	_earnedToken;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 chzPaid);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "STAN: caller is not the owner");
        _;
    }
    
    modifier validAddress(address _address) {
        require(_address != address(0), "STAN: invalid address");
        _;
    }
    
    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "STAN: amount must be greater than 0");
        _;
    }
    
    /**
     * @dev Constructor - sets the owner
     */
    constructor() {
        owner = msg.sender;
        emit Transfer(address(0), msg.sender, 0);
    }
    
    /**
     * @dev Transfer tokens to a specified address
     * @param _to The address to transfer to
     * @param _value The amount to transfer
     * @return True if the transfer was successful
     */
    function transfer(address _to, uint256 _value) 
        public 
        validAddress(_to) 
        validAmount(_value) 
        returns (bool) 
    {
        require(balanceOf[msg.sender] >= _value, "STAN: insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    /**
     * @dev Approve another address to spend tokens on behalf of msg.sender
     * @param _spender The address to approve
     * @param _value The amount to approve
     * @return True if the approval was successful
     */
    function approve(address _spender, uint256 _value) 
        public 
        validAddress(_spender) 
        returns (bool) 
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another using allowance
     * @param _from The address to transfer from
     * @param _to The address to transfer to
     * @param _value The amount to transfer
     * @return True if the transfer was successful
     */
    function transferFrom(address _from, address _to, uint256 _value) 
        public 
        validAddress(_from) 
        validAddress(_to) 
        validAmount(_value) 
        returns (bool) 
    {
        require(balanceOf[_from] >= _value, "STAN: insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "STAN: insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    /**
     * @dev Purchase tokens with CHZ
     * @notice Allows users to buy STAN tokens with CHZ
     */
    function purchase() public payable validAmount(msg.value) {
        // Simple 1:1 ratio for demonstration
        // In production, you might want a more complex pricing mechanism
        uint256 tokensToMint = msg.value;
        
        balanceOf[msg.sender] += tokensToMint;
        totalSupply += tokensToMint;
        
        emit TokensPurchased(msg.sender, tokensToMint, msg.value);
        emit Transfer(address(0), msg.sender, tokensToMint);
    }
    
    /**
     * @dev Mint new tokens (owner only)
     * @param _to The address to mint tokens to
     * @param _amount The amount to mint
     */
    function mint(address _to, uint256 _amount) 
        public 
        onlyOwner 
        validAddress(_to) 
        validAmount(_amount) 
    {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
        
        emit TokensMinted(_to, _amount);
        emit Transfer(address(0), _to, _amount);
    }
    
    /**
     * @dev Burn tokens from own balance
     * @param _amount The amount to burn
     */
    function burn(uint256 _amount) public validAmount(_amount) {
        require(balanceOf[msg.sender] >= _amount, "STAN: insufficient balance to burn");
        
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        
        emit TokensBurned(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }
    
    /**
     * @dev Get the total supply of tokens
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return totalSupply;
    }
    
    /**
     * @dev Get the balance of a specific address
     * @param _owner The address to check
     * @return The balance of the address
     */
    function balanceOf(address _owner) public view validAddress(_owner) returns (uint256) {
        return balanceOf[_owner];
    }
    
    /**
     * @dev Get the allowance given by an owner to a spender
     * @param _owner The owner address
     * @param _spender The spender address
     * @return The allowance amount
     */
    function allowance(address _owner, address _spender) 
        public 
        view 
        validAddress(_owner) 
        validAddress(_spender) 
        returns (uint256) 
    {
        return allowance[_owner][_spender];
    }
    
    /**
     * @dev Transfer ownership to a new address
     * @param _newOwner The new owner address
     */
    function transferOwnership(address _newOwner) public onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }
    
    /**
     * @dev Withdraw CHZ from contract (owner only)
     * @param _amount The amount to withdraw
     */
    function withdrawCHZ(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "STAN: insufficient contract balance");
        payable(owner).transfer(_amount);
    }
    
    /**
     * @dev Get contract CHZ balance
     * @return The contract's CHZ balance
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function balanceOfEarnedToken( address _owner ) public view returns ( uint256 ){
        return ( _earnedToken[ _owner ] );
    }

    function addToEarned( address to , uint256 _reward ) external {

        _earnedToken[ to ] += _reward;
    }
}
