import express from "express";

// Matter.js platform registration
import { registerNodePlatform } from "@project-chip/matter-node.js";
registerNodePlatform();

// Matter.js related imports
import { CommissioningController } from "@project-chip/matter.js";
import { Environment } from "@project-chip/matter.js/environment";

import { getDevices } from "./utils/getDevices.js";
import { controllDevice } from "./utils/controllDevice.js";
import { setupNodes } from "./utils/setupNodes.js";
import { commissionDevice } from "./utils/commisionDevice.js";
import { startupFunc } from "./utils/startup.js";
import { decommisionDevice } from "./utils/decommissionDevice.js";
import { NodeId } from "@project-chip/matter.js/datatype";

const app = express();
app.use(express.json());

const port = 3000;

const environment = Environment.default;
const uniqueId = "2211"; // Unique identifier for the controller instance

let node, server;

// Initialize the CommissioningController with environment and platform info
const commissioningController = new CommissioningController({
  environment: {
    environment,
    id: uniqueId,
  },
  autoConnect: false,
});

await commissioningController.start();

node = await setupNodes(commissioningController);
server = await startupFunc();

app.get("/", async (req, res) => {
  let response_data = await getDevices(commissioningController);
  res.send(response_data);
});

app.get("/discover/", async (req, res) => {
  const devices = await commissioningController.discoverCommissionableDevices();
  res.json({ devices });
});

app.post("/commission/", async (req, res) => {
  let pairingCode = req.body?.pairing_code ?? null;

  if (pairingCode != null) {
    console.log(`Trying Commissioning with pairing code ${pairingCode}`);
    const nodeId = await commissionDevice(commissioningController, pairingCode);
    res.json({
      message: `Commissioning successfully done with nodeId ${nodeId}`,
    });
  } else {
    res.json({
      message: `Please provide pairing code!`,
    });
  }
});

app.post("/control/", async (req, res) => {
  let response = "";
  let node_id = req.body?.node_id ?? null;
  let device_type = req.body?.type ?? null;
  let level = req.body?.level ?? null;

  if (node_id != null) {
    node_id = BigInt(node_id);
    const node = commissioningController.getConnectedNode(NodeId(node_id));
    if (node) {
      try {
        response = await controllDevice(
          node.getDevices()[0],
          device_type,
          level
        );
      } catch (error) {
        response = "Error controlling device";
        console.error(error);
      }
    } else {
      response = "Device not found";
    }
  } else {
    response = "Device not provided";
  }

  res.json({ response });
});

app.post("/decommision/", async (req, res) => {
  let response = "";
  let device_num = req.body?.device ?? null;

  if (device_num != null) {
    try {
      response = await decommisionDevice(commissioningController, device_num);
    } catch (error) {
      response = "Error controlling device";
      console.error(error);
    }
  } else {
    response = "Device not provided";
  }
  res.json({ response });
});

app.listen(port, () => {
  console.log(`Matter Controller app listening on port ${port}`);
});
