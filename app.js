import express from "express";

// matter import
import { Diagnostic, Environment, NodeId, StorageService } from "@matter/main";
import { CommissioningController } from "@project-chip/matter.js";

// custom function import
import { getDevices } from "./utils/getDevices.js";
import { controllDevice } from "./utils/controllDevice.js";
import { setupNodes } from "./utils/setupNodes.js";
import { commissionDevice } from "./utils/commisionDevice.js";
import { decommisionDevice } from "./utils/decommissionDevice.js";

const app = express();
app.use(express.json());

const port = 3000;

const environment = Environment.default;
const uniqueId = "2211"; // an unique is for your controller it can be anything
let node;
const storageService = environment.get(StorageService);
const controllerStorage = (
  await storageService.open("controller")
).createContext("data");
const adminFabricLabel = "matter.js Controller";

// This is the commission controller which have all access to the matter network so first need to initialise it in order to any thing with matter
const commissioningController = new CommissioningController({
  environment: {
    environment,
    id: uniqueId,
  },
  autoConnect: false,
  adminFabricLabel,
});

await commissioningController.start();

// I dont know man i am better at breaking down code 😉

node = await setupNodes(commissioningController);

// This just returns all the device check the function it is just readable
app.get("/", async (req, res) => {
  let nodes = commissioningController.getCommissionedNodes();
  console.log(Diagnostic.json(nodes), "response_data");

  const nodeDetails = commissioningController.getCommissionedNodesDetails();
  console.log(
    "Commissioned nodes details:",
    Diagnostic.json(nodeDetails.find((node) => node.nodeId === nodes[0]))
  );

  res.send(Diagnostic.json(nodeDetails));
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
