import { BridgedDeviceBasicInformationServer } from "@project-chip/matter.js/behaviors/bridged-device-basic-information";
import { Cluster } from "@project-chip/matter.js/cluster";
import { VendorId } from "@project-chip/matter.js/datatype";
import { OnOffLightDevice } from "@project-chip/matter.js/devices/OnOffLightDevice";
import { OnOffPlugInUnitDevice } from "@project-chip/matter.js/devices/OnOffPlugInUnitDevice";
import { Endpoint } from "@project-chip/matter.js/endpoint";
import { AggregatorEndpoint } from "@project-chip/matter.js/endpoints/AggregatorEndpoint";
import { BridgedNodeEndpoint } from "@project-chip/matter.js/endpoints/BridgedNodeEndpoint";
import { ServerNode } from "@project-chip/matter.js/node";

export const startupFunc = async () => {
  const uniqueId = "6969";
  const port = 5545;
  const passcode = 2022021;
  const discriminator = 3848;
  const deviceName = "LOLL";
  const vendorName = "matter-node.js";
  const vendorId = 0xfff1;
  const productName = `node-matter root node`;
  const productId = 0x8000;

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

  const aggregator = new Endpoint(AggregatorEndpoint, { id: "aggregator" });

  await server.add(aggregator);

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

  endpoint.events.identify.startIdentifying.on(() => {
    console.log(
      `Run identify logic for ${name}, ideally blink a light every 0.5s ...`
    );
  });

  endpoint.events.identify.stopIdentifying.on(() => {
    console.log(`Stop identify logic for ${name} ...`);
  });

  endpoint.events.onOff.onOff$Changed.on((value) => {
    executeCommand(value ? `on${i}` : `off${i}`);
    console.log(`${name} is now ${value ? "ON" : "OFF"}`);
  });

  await server.start();
  return "";
};
