// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SovereignIdentity
/// @notice ERC-8004 inspired on-chain identity for autonomous AI financial institutions
/// @dev Each Sovereign agent receives a unique identity with constitution hash and metadata

contract SovereignIdentity {
    // ─── Events ───────────────────────────────────────────────────────────────
    event SovereignCreated(
        uint256 indexed sovereignId,
        address indexed owner,
        string name,
        bytes32 constitutionHash,
        uint256 timestamp
    );

    event ConstitutionUpdated(
        uint256 indexed sovereignId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 version,
        uint256 timestamp
    );

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct Sovereign {
        uint256 id;
        address owner;
        string name;
        bytes32 constitutionHash;
        uint256 constitutionVersion;
        uint256 createdAt;
        bool active;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public nextSovereignId = 1;
    mapping(uint256 => Sovereign) public sovereigns;
    mapping(address => uint256[]) public ownerToSovereigns;

    // ─── Functions ────────────────────────────────────────────────────────────

    /// @notice Create a new Sovereign identity
    function createSovereign(
        string calldata name,
        bytes32 constitutionHash
    ) external returns (uint256 sovereignId) {
        sovereignId = nextSovereignId++;

        sovereigns[sovereignId] = Sovereign({
            id: sovereignId,
            owner: msg.sender,
            name: name,
            constitutionHash: constitutionHash,
            constitutionVersion: 1,
            createdAt: block.timestamp,
            active: true
        });

        ownerToSovereigns[msg.sender].push(sovereignId);

        emit SovereignCreated(
            sovereignId,
            msg.sender,
            name,
            constitutionHash,
            block.timestamp
        );
    }

    /// @notice Update a Sovereign's constitution
    function updateConstitution(
        uint256 sovereignId,
        bytes32 newConstitutionHash
    ) external {
        Sovereign storage s = sovereigns[sovereignId];
        require(s.owner == msg.sender, "Not sovereign owner");
        require(s.active, "Sovereign not active");

        bytes32 oldHash = s.constitutionHash;
        s.constitutionHash = newConstitutionHash;
        s.constitutionVersion++;

        emit ConstitutionUpdated(
            sovereignId,
            oldHash,
            newConstitutionHash,
            s.constitutionVersion,
            block.timestamp
        );
    }

    /// @notice Get Sovereign details
    function getSovereign(uint256 sovereignId)
        external
        view
        returns (Sovereign memory)
    {
        return sovereigns[sovereignId];
    }

    /// @notice Get all Sovereign IDs owned by an address
    function getSovereignsByOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        return ownerToSovereigns[owner];
    }
}
