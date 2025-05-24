import { GeneralCommissioning } from "@matter/main/clusters";
import { ManualPairingCodeCodec } from "@matter/main/types";

/**
 * Commissions a new Matter device into the network using a pairing code
 * @param {Object} commissioningController - The Matter commissioning controller instance
 * @param {string} pairingCode - The Matter pairing code provided by the device
 * @returns {Promise<string>} The node ID of the newly commissioned device
 */
export const commissionDevice = async (
  commissioningController,
  pairingCode
) => {
  // Decode the pairing code to extract setup PIN and discriminator
  let setupPin, shortDiscriminator;
  const pairingCodeCodec = ManualPairingCodeCodec.decode(pairingCode);
  shortDiscriminator = pairingCodeCodec.shortDiscriminator;
  setupPin = pairingCodeCodec.passcode;

  // Configure commissioning options including regulatory information
  const commissioningOptions = {
    regulatoryLocation:
      GeneralCommissioning.RegulatoryLocationType.IndoorOutdoor,
    regulatoryCountryCode: "IN",
  };

  // Set up commissioning parameters including discovery settings
  const options = {
    commissioning: commissioningOptions,
    discovery: {
      knownAddress: undefined,
      identifierData: { shortDiscriminator: shortDiscriminator },
      discoveryCapabilities: {
        ble: false,
      },
    },
    passcode: setupPin,
  };

  console.log(`Initiating device commissioning with options:`, options);
  const nodeId = await commissioningController.commissionNode(options);

  console.log(`Commissioning successfully done with nodeId ${nodeId}`);
  return nodeId;
};
