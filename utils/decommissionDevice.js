import { NodeId } from "@project-chip/matter.js/datatype";

export const decommisionDevice = async (
  commissioningController,
  device_num
) => {
  device_num = BigInt(device_num);
  let node = await commissioningController.getConnectedNode(NodeId(device_num));
  if (node) {
    await node.decommission();
    return "Node decommissioned!";
  } else {
    return "Device does not exists!";
  }
};
