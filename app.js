import "@project-chip/matter-node.js";
import express from "express";

// matter import
import { CommissioningController } from "@project-chip/matter.js";
import { Environment } from "@project-chip/matter.js/environment";

// custom function import
import { getDevices } from "./utils/getDevices.js";
import { controllDevice } from "./utils/controllDevice.js";
import { setupNodes } from "./utils/setupNodes.js";

const app = express();
app.use(express.json());

const port = 3000;

const environment = Environment.default;
const uniqueId = "2211"; // an unique is for your controller it can be anything
let node;

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

// This just returns all the device check the function it is just readable
app.get("/", async (req, res) => {
  let response_data = await getDevices(commissioningController);
  res.send(response_data);
});

// TOGGLE FUNCTION the main feature of this server 🤯🤯🤯
app.post("/toggle/", async (req, res) => {
  let response = "";
  let device_num = req.body?.device ?? null;

  // first take device num from post req
  if (device_num != null) {
    // then check is that thing even exists
    const devices = node.getDevices();
    const device = devices.find((device) => device.number === device_num);

    // if sooooooo
    if (device) {
      try {
        // run my function 😉
        response = await controllDevice(device);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
