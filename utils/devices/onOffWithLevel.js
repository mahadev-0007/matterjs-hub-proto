import { OnOffCluster, LevelControlCluster } from "@matter/main/clusters";

/**
 * Controls the level (e.g., brightness) of a Matter device that supports level control
 * @param {Object} device - The Matter device instance to control
 * @param {number} levelVal - The target level value (0-254)
 * @returns {Promise<string>} A message indicating the new level of the device
 */
export const onOffWithLevelControl = async (device, levelVal) => {
  // Get the LevelControl cluster client for the device
  const level = device.getClusterClient(LevelControlCluster);

  if (level !== undefined) {
    // Get current level before adjustment
    let levelStatus = await level.getCurrentLevelAttribute();

    // Move to the specified level with transition
    await level.moveToLevelWithOnOff({
      level: levelVal,
      transitionTime: 1, // 1/10th of a second
      optionsMask: 10,
      optionsOverride: 10,
    });

    // Verify the new level
    levelStatus = await level.getCurrentLevelAttribute();
    return "Current Level " + levelVal;
  }

  return "Device does not support level control";
};
