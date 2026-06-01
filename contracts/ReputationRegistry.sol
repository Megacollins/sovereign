// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ReputationRegistry
/// @notice Tracks on-chain reputation scores for Sovereign AI agents
/// @dev Reputation is earned through constitutional compliance, not just profit

contract ReputationRegistry {
    // ─── Events ───────────────────────────────────────────────────────────────
    event ReputationUpdated(
        uint256 indexed sovereignId,
        uint256 oldScore,
        uint256 newScore,
        bool approved,
        uint256 proofId,
        uint256 timestamp
    );

    event ReputationInitialized(
        uint256 indexed sovereignId,
        uint256 initialScore,
        uint256 timestamp
    );

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct Reputation {
        uint256 sovereignId;
        uint256 trustScore;       // 0–100
        uint256 totalDecisions;
        uint256 passedDecisions;
        uint256 failedDecisions;
        uint256 lastUpdated;
        bool initialized;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    mapping(uint256 => Reputation) public reputations;

    uint256 public constant INITIAL_SCORE = 75;
    uint256 public constant MAX_SCORE = 100;
    uint256 public constant PASS_DELTA = 1;   // +1 per compliant decision

    // ─── Functions ────────────────────────────────────────────────────────────

    /// @notice Initialize reputation for a new Sovereign
    function initializeReputation(uint256 sovereignId) external {
        require(!reputations[sovereignId].initialized, "Already initialized");

        reputations[sovereignId] = Reputation({
            sovereignId: sovereignId,
            trustScore: INITIAL_SCORE,
            totalDecisions: 0,
            passedDecisions: 0,
            failedDecisions: 0,
            lastUpdated: block.timestamp,
            initialized: true
        });

        emit ReputationInitialized(sovereignId, INITIAL_SCORE, block.timestamp);
    }

    /// @notice Update reputation after a decision
    function updateReputation(
        uint256 sovereignId,
        bool approved,
        uint256 proofId
    ) external {
        Reputation storage rep = reputations[sovereignId];
        require(rep.initialized, "Reputation not initialized");

        uint256 oldScore = rep.trustScore;

        rep.totalDecisions++;

        if (approved) {
            rep.passedDecisions++;
            if (rep.trustScore + PASS_DELTA <= MAX_SCORE) {
                rep.trustScore += PASS_DELTA;
            } else {
                rep.trustScore = MAX_SCORE;
            }
        } else {
            rep.failedDecisions++;
            // Score does not increase on rejection
        }

        rep.lastUpdated = block.timestamp;

        emit ReputationUpdated(
            sovereignId,
            oldScore,
            rep.trustScore,
            approved,
            proofId,
            block.timestamp
        );
    }

    /// @notice Get reputation for a Sovereign
    function getReputation(uint256 sovereignId)
        external
        view
        returns (Reputation memory)
    {
        return reputations[sovereignId];
    }

    /// @notice Get compliance rate as a percentage (0–100)
    function getComplianceRate(uint256 sovereignId)
        external
        view
        returns (uint256)
    {
        Reputation memory rep = reputations[sovereignId];
        if (rep.totalDecisions == 0) return 100;
        return (rep.passedDecisions * 100) / rep.totalDecisions;
    }
}
