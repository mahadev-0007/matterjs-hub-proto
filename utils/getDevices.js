export const getDevices = async (commissioningController) => {
  const nodes = commissioningController.getCommissionedNodes();
  let node = await commissioningController.connectNode(nodes[1]);
  const devices = node.getDevices();
  //   console.log(devices[0]["descriptorCluster"]["attributes"]["attributeList"]);

  let devices_data = [];

  devices.map((device) => {
    let device_data = {
      name: device["name"],
      //   attributeList: device["descriptorCluster"]["attributes"]["attributeList"],
      code: device["deviceTypes"][0]["code"],
    };
    devices_data.push(device_data);
  });
  let response_data = {
    devices: devices_data,
  };
  return response_data;
};
