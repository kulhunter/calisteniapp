const fs = require('fs');

const targetMap = {
  "abs": "abdominales",
  "biceps": "bíceps",
  "triceps": "tríceps",
  "pectorals": "pecho",
  "lats": "espalda (dorsales)",
  "quads": "cuádriceps",
  "glutes": "glúteos",
  "delts": "hombros",
  "calves": "gemelos",
  "cardiovascular system": "cardio",
  "hamstrings": "isquiotibiales",
  "upper back": "espalda alta",
  "spine": "lumbares",
  "forearms": "antebrazos",
  "traps": "trapecios",
  "abductors": "abductores",
  "adductors": "aductores",
  "serratus anterior": "serrato anterior",
  "levator scapulae": "elevador de la escápula"
};

const equipmentMap = {
  "body weight": "peso corporal",
  "dumbbell": "mancuerna",
  "barbell": "barra",
  "cable": "cable",
  "kettlebell": "pesa rusa",
  "stability ball": "pelota de estabilidad",
  "medicine ball": "balón medicinal",
  "bands": "bandas elásticas",
  "machine": "máquina",
  "pull-up bar": "barra de dominadas",
  "bench": "banco",
  "ez barbell": "barra EZ",
  "rope": "cuerda"
};

const exercises = JSON.parse(fs.readFileSync('src/data/hasan_exercises.json', 'utf8'));

const localizedExercises = exercises.map(ex => ({
  ...ex,
  target_es: targetMap[ex.target] || ex.target,
  equipment_es: equipmentMap[ex.equipment] || ex.equipment,
  category_es: targetMap[ex.category] || ex.category
}));

fs.writeFileSync('src/data/hasan_exercises.json', JSON.stringify(localizedExercises, null, 2));
console.log("Exercises localized successfully.");
