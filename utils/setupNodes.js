/**
 * Sets up and connects to all commissioned nodes in the Matter network
 * @param {Object} commissioningController - The Matter commissioning controller instance
 * @returns {Promise<Object>} The last connected node instance
 */
export const setupNodes = async (commissioningController) => {
  // Retrieve all previously commissioned nodes from the controller
  const nodes = commissioningController.getCommissionedNodes();
  console.log("Available nodes:", nodes);

  let node = null;
  // Attempt to connect to each commissioned node
  nodes.map(async (node_i) => {
    node = await commissioningController.connectNode(node_i);
  });

  console.log("Successfully connected to node:", node);
  return node;
};
