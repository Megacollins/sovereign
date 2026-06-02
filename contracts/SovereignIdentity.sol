// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SovereignIdentity
/// @notice ERC-8004 compliant on-chain identity registry for autonomous AI financial institutions
/// @dev Implements ERC-8004 agent identity standard with registration, metadata, and wallet management

contract SovereignIdentity {

    // ─── Events (ERC-8004 compliant) ──────────────────────────────────────────
    event Registered(
        uint256 indexed agentId,
        address indexed owner,
        string agentURI,
        uint256 timestamp
    );

    event URIUpdated(
        uint256 indexed agentId,
        string oldURI,
        string newURI,
        uint256 timestamp
    );

    event MetadataSet(
        uint256 indexed agentId,
        string key,
        string value,
        uint256 timestamp
    );

    event ConstitutionUpdated(
        uint256 indexed agentId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 version,
        uint256 timestamp
    );

    event AgentWalletSet(
        uint256 indexed agentId,
        address wallet,
        uint256 timestamp
    );

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct MetadataEntry {
        string key;
        string value;
    }

    struct Agent {
        uint256 id;
        address owner;
        string agentURI;
        bytes32 constitutionHash;
        uint256 constitutionVersion;
        address agentWallet;
        uint256 createdAt;
        bool active;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public nextAgentId = 1;
    mapping(uint256 => Agent) public agents;
    mapping(uint256 => mapping(string => string)) public agentMetadata;
    mapping(address => uint256[]) public ownerToAgents;

    // ─── ERC-8004 Core Functions ──────────────────────────────────────────────

    /// @notice Register a new AI agent identity (ERC-8004)
    function register(string calldata agentURI) external returns (uint256 agentId) {
        agentId = _createAgent(msg.sender, agentURI, bytes32(0));
    }

    /// @notice Register a new AI agent identity with metadata (ERC-8004)
    function registerWithMetadata(
        string calldata agentURI,
        MetadataEntry[] calldata metadata
    ) external returns (uint256 agentId) {
        agentId = _createAgent(msg.sender, agentURI, bytes32(0));
        for (uint256 i = 0; i < metadata.length; i++) {
            agentMetadata[agentId][metadata[i].key] = metadata[i].value;
            emit MetadataSet(agentId, metadata[i].key, metadata[i].value, block.timestamp);
        }
    }

    /// @notice Register a Sovereign with constitution hash
    function registerSovereign(
        string calldata agentURI,
        bytes32 constitutionHash
    ) external returns (uint256 agentId) {
        agentId = _createAgent(msg.sender, agentURI, constitutionHash);
    }

    /// @notice Internal agent creation
    function _createAgent(
        address owner,
        string calldata agentURI,
        bytes32 constitutionHash
    ) internal returns (uint256 agentId) {
        agentId = nextAgentId++;

        agents[agentId] = Agent({
            id: agentId,
            owner: owner,
            agentURI: agentURI,
            constitutionHash: constitutionHash,
            constitutionVersion: 1,
            agentWallet: address(0),
            createdAt: block.timestamp,
            active: true
        });

        ownerToAgents[owner].push(agentId);

        emit Registered(agentId, owner, agentURI, block.timestamp);
    }

    /// @notice Update agent URI (ERC-8004)
    function setAgentURI(uint256 agentId, string calldata newURI) external {
        Agent storage agent = agents[agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        require(agent.active, "Agent not active");
        string memory oldURI = agent.agentURI;
        agent.agentURI = newURI;
        emit URIUpdated(agentId, oldURI, newURI, block.timestamp);
    }

    /// @notice Set metadata for an agent (ERC-8004)
    function setMetadata(
        uint256 agentId,
        string calldata key,
        string calldata value
    ) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agentMetadata[agentId][key] = value;
        emit MetadataSet(agentId, key, value, block.timestamp);
    }

    /// @notice Get metadata value for an agent (ERC-8004)
    function getMetadata(
        uint256 agentId,
        string calldata key
    ) external view returns (string memory) {
        return agentMetadata[agentId][key];
    }

    /// @notice Set agent wallet address (ERC-8004)
    function setAgentWallet(uint256 agentId, address wallet) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].agentWallet = wallet;
        emit AgentWalletSet(agentId, wallet, block.timestamp);
    }

    /// @notice Get agent wallet address (ERC-8004)
    function getAgentWallet(uint256 agentId) external view returns (address) {
        return agents[agentId].agentWallet;
    }

    /// @notice Unset agent wallet (ERC-8004)
    function unsetAgentWallet(uint256 agentId) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].agentWallet = address(0);
    }

    /// @notice Update constitution hash
    function updateConstitution(
        uint256 agentId,
        bytes32 newConstitutionHash
    ) external {
        Agent storage agent = agents[agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        require(agent.active, "Agent not active");

        bytes32 oldHash = agent.constitutionHash;
        agent.constitutionHash = newConstitutionHash;
        agent.constitutionVersion++;

        emit ConstitutionUpdated(
            agentId,
            oldHash,
            newConstitutionHash,
            agent.constitutionVersion,
            block.timestamp
        );
    }

    // ─── View Functions ────────────────────────────────────────────────────────

    /// @notice Get agent URI (ERC-8004)
    function getAgentURI(uint256 agentId) external view returns (string memory) {
        return agents[agentId].agentURI;
    }

    /// @notice Get full agent details
    function getAgent(uint256 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }

    /// @notice Get all agent IDs owned by an address
    function getAgentsByOwner(address owner) external view returns (uint256[] memory) {
        return ownerToAgents[owner];
    }

    /// @notice Check if agent exists
    function agentExists(uint256 agentId) external view returns (bool) {
        return agents[agentId].createdAt > 0;
    }

    /// @notice Get identity registry address (ERC-8004 compatibility)
    function getIdentityRegistry() external view returns (address) {
        return address(this);
    }
}
