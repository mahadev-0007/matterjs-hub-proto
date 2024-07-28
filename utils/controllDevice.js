import { OnOffCluster } from "@project-chip/matter.js/cluster";

export const controllDevice = async (device) => {
  // OKAYY so i am lazy now but not tommorrow maybe....
  // I just added controll device of OnOff Device like light bulb, light bulb, light bulb or light bulb (I only know this thing)

  // Get the cluster (I still dont know what it is please someone explain)
  const onOff = device.getClusterClient(OnOffCluster);

  // if yes
  if (onOff !== undefined) {
    try {
      // What the light doing...
      // is it on or off
      // basically status checking
      let onOffStatus = await onOff.getOnOffAttribute();
      console.log("initial onOffStatus", onOffStatus);

      // When I put this code
      // this thing screamed whenever i manually change the light to on or off
      // so like if you want to turn on the furry p when light is off or something this is the place
      onOff.addOnOffAttributeListener((value) => {
        console.log("subscription onOffStatus", value);
        onOffStatus = value;
      });

      // YASS ONNNN
      await onOff.toggle();
      // Basic maths or something
      // to return the status
      onOffStatus = !onOffStatus;
      console.log("Toggled to ", onOffStatus);
      const state = onOffStatus == true ? "ON" : "OFF";
      return "Toggled to " + state;
    } catch (error) {
      console.error("Error occurred while toggling:", error);
      return "Error occurred!";
    }
  } else {
    return "Not an onOff Device";
  }
};
