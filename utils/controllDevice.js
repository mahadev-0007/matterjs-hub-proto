import {
  OnOffCluster,
  LevelControlCluster,
} from "@project-chip/matter.js/cluster";
import { onOffControl } from "./devices/onOff.js";
import { onOffWithLevelControl } from "./devices/onOffWithLevel.js";
import { response } from "express";

export const controllDevice = async (device, type, level) => {
  /// Split this code to contain multiple devices is this the better way?
  let response = "";
  if (type == "onOff") {
    response = onOffControl(device);
  } else if (type == "level") {
    response = onOffWithLevelControl(device, level);
  } else {
    response = "Not supported device type";
  }

  return response;
};
