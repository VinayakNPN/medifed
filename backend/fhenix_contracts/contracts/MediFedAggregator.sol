// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract MediFedAggregator is Permissioned {
    // Encrypted Global Weights
    euint32[] private globalWeights;
    euint32[] private globalBias;
    
    uint32 public totalSamples;
    uint32 public roundId;
    
    event AggregationCompleted(uint32 roundId, uint32 numHospitals);

    constructor() {
        roundId = 1;
        totalSamples = 0;
    }

    // Confidential Aggregation
    // The coordinator submits the encrypted weight and bias deltas from the hospital.
    function aggregateUpdate(
        inEuint32[] calldata encryptedWeightDeltas,
        inEuint32[] calldata encryptedBiasDeltas,
        uint32 samples
    ) public {
        // If it's the first initialization for this round
        if (globalWeights.length == 0) {
            for(uint i = 0; i < encryptedWeightDeltas.length; i++) {
                globalWeights.push(FHE.asEuint32(encryptedWeightDeltas[i]));
            }
            for(uint i = 0; i < encryptedBiasDeltas.length; i++) {
                globalBias.push(FHE.asEuint32(encryptedBiasDeltas[i]));
            }
        } else {
            // Homomorphic Addition: C_new = C_current + C_delta
            require(encryptedWeightDeltas.length == globalWeights.length, "Dimension mismatch");
            
            for(uint i = 0; i < encryptedWeightDeltas.length; i++) {
                globalWeights[i] = FHE.add(globalWeights[i], FHE.asEuint32(encryptedWeightDeltas[i]));
            }
            for(uint i = 0; i < encryptedBiasDeltas.length; i++) {
                globalBias[i] = FHE.add(globalBias[i], FHE.asEuint32(encryptedBiasDeltas[i]));
            }
        }
        
        totalSamples += samples;
    }

    // Permit-based Decryption for Coordinator
    // Only the authorized coordinator can unseal the aggregated result
    function getAggregatedWeights(Permission calldata permission) public view returns (uint32[] memory) {
        FHE.req(permission);
        
        uint32[] memory clearWeights = new uint32[](globalWeights.length);
        for (uint i = 0; i < globalWeights.length; i++) {
            clearWeights[i] = FHE.decrypt(globalWeights[i]);
        }
        return clearWeights;
    }
    
    function getAggregatedBias(Permission calldata permission) public view returns (uint32[] memory) {
        FHE.req(permission);
        
        uint32[] memory clearBias = new uint32[](globalBias.length);
        for (uint i = 0; i < globalBias.length; i++) {
            clearBias[i] = FHE.decrypt(globalBias[i]);
        }
        return clearBias;
    }
    
    function finalizeRound() public {
        emit AggregationCompleted(roundId, totalSamples);
        roundId++;
        
        // Reset state for next round if needed
        delete globalWeights;
        delete globalBias;
        totalSamples = 0;
    }
}
