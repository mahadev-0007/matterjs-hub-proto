import { BridgedDeviceBasicInformationServer } from "@matter/main/behaviors";
// import { Cluster } from "@matter/main/clusters";
import { VendorId } from "@matter/main/types";
import { OnOffPlugInUnitDevice } from "@matter/main/devices";
import { Endpoint } from "@matter/main/endpoints";
import {
  AggregatorEndpoint,
  BridgedNodeEndpoint,
} from "@matter/main/endpoints";
import { ServerNode } from "@matter/main/node";

/**
 * Initializes and starts a Matter server node with a bridged device
 * @returns {Promise<string>} Empty string on successful startup
 */
export const startupFunc = async () => {
  // Server configuration constants
  const uniqueId = "6969";
  const port = 5545;
  const passcode = 2022021;
  const discriminator = 3848;
  const deviceName = "LOLL";
  const vendorName = "matter-node.js";
  const vendorId = 0xfff1;
  const productName = `node-matter root node`;
  const productId = 0x8000;

  // Create and configure the Matter server node
  const server = await ServerNode.create({
    // Required: Give the Node a unique ID which is used to store the state of this node
    id: uniqueId,

    // Provide Network relevant configuration like the port
    // Optional when operating only one device on a host, Default port is 5540
    network: {
      port: port,
    },

    // Provide Commissioning relevant settings
    // Optional for development/testing purposes
    commissioning: {
      passcode: passcode,
      discriminator: discriminator,
    },

    // Provide Node announcement settings
    // Optional: If Ommitted some development defaults are used
    productDescription: {
      name: productName,
      deviceType: AggregatorEndpoint.deviceType,
    },

    // Provide defaults for the BasicInformation cluster on the Root endpoint
    // Optional: If Omitted some development defaults are used
    basicInformation: {
      vendorName,
      vendorId: VendorId(vendorId),
      nodeLabel: productName,
      productName,
      productLabel: productName,
      productId,
      serialNumber: `matterjs-${uniqueId}`,
      uniqueId,
    },
  });

  // Create and add the aggregator endpoint
  const aggregator = new Endpoint(AggregatorEndpoint, { id: "aggregator" });
  await server.add(aggregator);

  // Configure a bridged OnOff Socket device
  const name = `OnOff Socket 1`;
  const endpoint = new Endpoint(
    OnOffPlugInUnitDevice.with(BridgedDeviceBasicInformationServer),
    {
      id: `onoff-socket-1`,
      bridgedDeviceBasicInformation: {
        nodeLabel: name,
        productName: name,
        productLabel: name,
        serialNumber: `node-matter-5678-3`,
        reachable: true,
      },
    }
  );
  await aggregator.add(endpoint);

  // Set up device identification handlers
  endpoint.events.identify.startIdentifying.on(() => {
    console.log(
      `Run identify logic for ${name}, ideally blink a light every 0.5s ...`
    );
  });

  endpoint.events.identify.stopIdentifying.on(() => {
    console.log(`Stop identify logic for ${name} ...`);
  });

  // Set up OnOff state change handler
  endpoint.events.onOff.onOff$Changed.on((value) => {
    executeCommand(value ? `on${i}` : `off${i}`);
    console.log(`${name} is now ${value ? "ON" : "OFF"}`);
  });

  // Start the server
  await server.start();
  return "";
};
