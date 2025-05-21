import {
  OnOffCluster,
  LevelControlCluster,
} from "@project-chip/matter.js/cluster";
import { onOffControl } from "./devices/onOff.js";
import { onOffWithLevelControl } from "./devices/onOffWithLevel.js";
import { response } from "express";

/**
 * Controls a Matter device based on its type and desired state
 * @param {Object} device - The Matter device instance to control
 * @param {string} type - The type of control ('onOff' or 'level')
 * @param {number} [level] - The level value for dimming (required for 'level' type)
 * @returns {Promise<string>} Response message indicating the result of the control operation
 */
export const controllDevice = async (device, type, level) => {
  // Route the control request based on device type
  let response = "";

  switch (type) {
    case "onOff":
      response = onOffControl(device);
      break;
    case "level":
      response = onOffWithLevelControl(device, level);
      break;
    default:
      response = "Not supported device type";
  }

  return response;
};
