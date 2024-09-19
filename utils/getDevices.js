export const getDevices = async (commissioningController) => {
  const nodes = commissioningController.getCommissionedNodes();
  let devices_data = [];

  if (nodes.length > 0) {
    console.log(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      let node = await commissioningController.connectNode(nodes[i]);
      console.log("NODE IDDDD", node["nodeId"]);
      node.getDevices().map((device) => {
        let device_data = {
          name: device["name"],
          //   attributeList: device["descriptorCluster"]["attributes"]["attributeList"],
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
