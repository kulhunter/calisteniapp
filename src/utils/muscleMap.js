export const muscleMap = {
  quadriceps: ["thigh_front_L", "thigh_front_R"],
  glutes: ["buttock_L", "buttock_R"],
  biceps: ["upper_arm_front_L", "upper_arm_front_R"],
  triceps: ["upper_arm_back_L", "upper_arm_back_R"],
  abs: ["torso_front"],
  chest: ["torso_front"],
  back: ["torso_back"],
  spine: ["torso_back"],
  knees: ["thigh_front_L", "thigh_front_R"],
  elbow: ["upper_arm_front_L", "upper_arm_front_R", "upper_arm_back_L", "upper_arm_back_R"]
};

export const getMuscleFromMeshName = (meshName) => {
  for (const [muscle, meshes] of Object.entries(muscleMap)) {
    if (meshes.some(m => meshName.includes(m))) {
      return muscle;
    }
  }
  return null;
};
