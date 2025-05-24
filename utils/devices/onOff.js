import { OnOffCluster } from "@matter/main/clusters";

/**
 * Controls an OnOff capable Matter device (e.g., light bulb, switch)
 * @param {Object} device - The Matter device instance to control
 * @returns {Promise<string>} A message indicating the new state of the device
 */
export const onOffControl = async (device) => {
  // OKAYY so i am lazy now but not tommorrow maybe....
  // I just added controll device of OnOff Device like light bulb, light bulb, light bulb or light bulb (I only know this thing)

  // Get the OnOff cluster client for the device
  const onOff = device.getClusterClient(OnOffCluster);

  // Verify device supports OnOff cluster
  if (onOff !== undefined) {
    try {
      // Get current device state
      let onOffStatus = await onOff.getOnOffAttribute();
      console.log("Current device state:", onOffStatus);

      // Set up listener for state changes
      // This allows tracking manual changes or changes from other controllers
      onOff.addOnOffAttributeListener((value) => {
        console.log("State change detected:", value);
        onOffStatus = value;
      });

      // Toggle the device state
      await onOff.toggle();

      // Update and return the new state
      onOffStatus = !onOffStatus;
      console.log("New device state:", onOffStatus);
      const state = onOffStatus ? "ON" : "OFF";
      return "Toggled to " + state;
    } catch (error) {
      console.error("Error occurred while toggling:", error);
      return "Error occurred!";
    }
  } else {
    return "Not an onOff Device";
  }
};
