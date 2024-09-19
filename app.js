import "@project-chip/matter-node.js";
import express from "express";

// matter import
import { CommissioningController } from "@project-chip/matter.js";
import { Environment } from "@project-chip/matter.js/environment";

// custom function import
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
const uniqueId = "2211"; // an unique is for your controller it can be anything
let node, server;

// This is the commission controller which have all access to the matter network so first need to initialise it in order to any thing with matter
const commissioningController = new CommissioningController({
  environment: {
    environment,
    id: uniqueId,
  },
  autoConnect: false,
});

await commissioningController.start();

// I dont know man i am better at breaking down code 😉

node = await setupNodes(commissioningController);

server = await startupFunc();

// This just returns all the device check the function it is just readable
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

// CONTROL FUNCTION the main feature of this server 🤯🤯🤯
app.post("/control/", async (req, res) => {
  let response = "";
  let node_id = req.body?.node_id ?? null;
  let device_type = req.body?.type ?? null;
  let level = req.body?.level ?? null;

  node_id = BigInt(node_id);

  // first take device num from post req
  if (node_id != null) {
    // then check if that thing even exists
    const node = commissioningController.getConnectedNode(NodeId(node_id));

    // if sooooooo
    if (node) {
      try {
        // run my function 😉
        console.log(node.getDevices(), "DEvicess");
        response = await controllDevice(
          node.getDevices()[0],
          device_type,
          level
        );
      } catch (error) {
        // if not F offf 🖕🖕🖕🖕
        response = "Error controlling device";
        console.error(error);
      }
    } else {
      response = "Device not found";
    }
  } else {
    response = "Device not provided";
  }

  // AND TADAAAA ✨✨✨✨
  // If the response is GOOD then it will say TOGGLED TO ON/OFF
  // Hope you dont burn your house
  res.json({ response });
});

app.post("/decommision/", async (req, res) => {
  let response = "";
  let device_num = req.body?.device ?? null;

  // first take device num from post req
  if (device_num != null) {
    // then check if that thing even exists
    try {
      // run my function 😉
      response = await decommisionDevice(commissioningController, device_num);
    } catch (error) {
      // if not F offf 🖕🖕🖕🖕
      response = "Error controlling device";
      console.error(error);
    }
  } else {
    response = "Device not provided";
  }
  res.json({ response });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
