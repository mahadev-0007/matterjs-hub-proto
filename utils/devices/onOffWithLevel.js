import {
  OnOffCluster,
  LevelControlCluster,
} from "@project-chip/matter.js/cluster";

export const onOffWithLevelControl = async (device, levelVal) => {
  // ADDED on OFF Level Control so i can adjust how light does basement kids get.....
  const level = device.getClusterClient(LevelControlCluster);
  if (level !== undefined) {
    let levelStatus = await level.getCurrentLevelAttribute();
    // Finding this function was nightmare
    await level.moveToLevelWithOnOff({
      level: levelVal,
      transitionTime: 1,
      optionsMask: 10,
      optionsOverride: 10,
    });
    levelStatus = await level.getCurrentLevelAttribute();

    return "Current Level " + levelVal;
  }
};
