// I know 3 lines but smaller is better I guess
export const setupNodes = async (commissioningController) => {
  // So commissioning controller actually know every nodes ever connected
  const nodes = commissioningController.getCommissionedNodes();
  console.log(nodes, "NODESS");
  let node = null;
  nodes.map(async (node_i) => {
    node = await commissioningController.connectNode(node_i); // used 1 because I deleted one node without deleting mine so please change it to 0 or anything that corressponds to by default 0
  });
  // RETURNS THE NODEEEEE 🔥🔥🔥🔥🔥
  console.log("NODEEEEEE", node);
  return node;
};
