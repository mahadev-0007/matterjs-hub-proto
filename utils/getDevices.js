/**
 * Retrieves a list of all commissioned Matter devices in the network
 * @param {Object} commissioningController - The Matter commissioning controller instance
 * @returns {Promise<Object>} Object containing array of device information
 */
export const getDevices = async (commissioningController) => {
  // Get all commissioned nodes from the controller
  const nodes = commissioningController.getCommissionedNodes();
  let devices_data = [];

  if (nodes.length > 0) {
    console.log(`Found ${nodes.length} commissioned nodes`);
    for (let i = 0; i < nodes.length; i++) {
      // Connect to each node to retrieve its device information
      let node = await commissioningController.connectNode(nodes[i]);
      console.log("Processing node ID:", node["nodeId"]);

      // Extract relevant device information from each node
      node.getDevices().map((device) => {
        let device_data = {
          name: device["name"],
          // Note: Additional device attributes can be included here
          code: device["deviceTypes"][0]["code"],
        };
        devices_data.push(device_data);
      });
    }
  }
  //   console.log(devices[0]["descriptorCluster"]["attributes"]["attributeList"]);
  let response_data = {
    devices: devices_data,
  };
  return response_data;
};
