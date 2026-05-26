export const muscleMap = {
  quadriceps: ["thigh_front_L", "thigh_front_R"],
  glutes: ["buttock_L", "buttock_R"],
  biceps: ["upper_arm_front_L", "upper_arm_front_R"],
  triceps: ["upper_arm_back_L", "upper_arm_back_R"],
  abs: ["abs_mesh"],
  chest: ["chest_mesh"],
  back: ["back_mesh"],
  spine: ["spine_mesh", "back_mesh"],
  knees: ["knee_L", "knee_R", "thigh_front_L", "thigh_front_R"],
  elbow: ["elbow_L", "elbow_R", "upper_arm_front_L", "upper_arm_front_R", "upper_arm_back_L", "upper_arm_back_R"]
};

export const getMuscleFromMeshName = (meshName) => {
  if (!meshName) return null;
  for (const [muscle, meshes] of Object.entries(muscleMap)) {
    if (meshes.some(m => meshName === m || meshName.includes(m))) {
      return muscle;
    }
  }
  return null;
};
