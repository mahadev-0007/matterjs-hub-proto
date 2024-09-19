import { GeneralCommissioning } from "@project-chip/matter.js/cluster";
import { ManualPairingCodeCodec } from "@project-chip/matter.js/schema";

export const commissionDevice = async (
  commissioningController,
  pairingCode
) => {
  // Extract Pin and shortDiscriminator from pairing code for commissioning
  let setupPin, shortDiscriminator;
  const pairingCodeCodec = ManualPairingCodeCodec.decode(pairingCode);
  shortDiscriminator = pairingCodeCodec.shortDiscriminator;
  setupPin = pairingCodeCodec.passcode;

  // Commissioning Option for idk
  const commissioningOptions = {
    regulatoryLocation:
      GeneralCommissioning.RegulatoryLocationType.IndoorOutdoor,
    regulatoryCountryCode: "IN",
  };

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

  console.log(`Commissioning ... ${options}`);
  const nodeId = await commissioningController.commissionNode(options);

  console.log(`Commissioning successfully done with nodeId ${nodeId}`);
  return nodeId;
};
