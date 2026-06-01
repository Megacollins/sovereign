// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ProofRegistry
/// @notice Immutable on-chain record of every AI decision proof on Mantle
/// @dev Stores decision hash, constitution hash, and validation hash for every action

contract ProofRegistry {
    // ─── Events ───────────────────────────────────────────────────────────────
    event DecisionRecorded(
        uint256 indexed proofId,
        uint256 indexed sovereignId,
        bytes32 decisionHash,
        bytes32 constitutionHash,
        bytes32 validationHash,
        bool approved,
        uint256 timestamp
    );

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct DecisionProof {
        uint256 proofId;
        uint256 sovereignId;
        bytes32 decisionHash;
        bytes32 constitutionHash;
        bytes32 validationHash;
        bool approved;
        string actionDescription;
        uint256 timestamp;
        address recorder;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public nextProofId = 1;
    mapping(uint256 => DecisionProof) public proofs;
    mapping(uint256 => uint256[]) public sovereignProofs; // sovereignId => proofIds

    // ─── Functions ────────────────────────────────────────────────────────────

    /// @notice Record a decision proof on-chain
    function recordDecision(
        uint256 sovereignId,
        bytes32 decisionHash,
        bytes32 constitutionHash,
        bytes32 validationHash,
        bool approved,
        string calldata actionDescription
    ) external returns (uint256 proofId) {
        proofId = nextProofId++;

        proofs[proofId] = DecisionProof({
            proofId: proofId,
            sovereignId: sovereignId,
            decisionHash: decisionHash,
            constitutionHash: constitutionHash,
            validationHash: validationHash,
            approved: approved,
            actionDescription: actionDescription,
            timestamp: block.timestamp,
            recorder: msg.sender
        });

        sovereignProofs[sovereignId].push(proofId);

        emit DecisionRecorded(
            proofId,
            sovereignId,
            decisionHash,
            constitutionHash,
            validationHash,
            approved,
            block.timestamp
        );
    }

    /// @notice Get a specific proof
    function getProof(uint256 proofId)
        external
        view
        returns (DecisionProof memory)
    {
        return proofs[proofId];
    }

    /// @notice Get all proof IDs for a Sovereign
    function getSovereignProofs(uint256 sovereignId)
        external
        view
        returns (uint256[] memory)
    {
        return sovereignProofs[sovereignId];
    }

    /// @notice Verify a decision proof exists and matches
    function verifyProof(
        uint256 proofId,
        bytes32 decisionHash,
        bytes32 constitutionHash
    ) external view returns (bool) {
        DecisionProof memory p = proofs[proofId];
        return (
            p.decisionHash == decisionHash &&
            p.constitutionHash == constitutionHash
        );
    }
}
