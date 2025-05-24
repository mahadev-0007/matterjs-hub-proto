import { NodeId } from "@matter/main/types";

/**
 * Decommissions a Matter device from the network
 * @param {Object} commissioningController - The Matter commissioning controller instance
 * @param {number|string} device_num - The device number/ID to decommission
 * @returns {Promise<string>} A message indicating the result of the decommissioning operation
 */
export const decommisionDevice = async (
  commissioningController,
  device_num
) => {
  device_num = BigInt(device_num);
  // Attempt to get the node from the network using its ID
  let node = await commissioningController.getConnectedNode(NodeId(device_num));
  if (node) {
    await node.decommission();
    return "Node decommissioned!";
  } else {
    return "Device does not exists!";
  }
};
