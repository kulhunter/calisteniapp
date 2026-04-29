const fs = require('fs');

const exercises = JSON.parse(fs.readFileSync('src/data/hasan_exercises.json', 'utf8'));
const existingGifs = fs.readFileSync('existing_gifs.txt', 'utf8').split('\n').filter(Boolean);

// Filter exercises that have a GIF in the public/videos folder
const validExercises = exercises.filter(ex => {
  const gifName = ex.gif_url.split('/').pop();
  return existingGifs.includes(gifName);
});

fs.writeFileSync('src/data/hasan_exercises.json', JSON.stringify(validExercises, null, 2));
console.log(`Filtered: ${validExercises.length} valid exercises left out of ${exercises.length}.`);

// Now regenerate routines
const targetsES = {
  "abs": "ABDOMINALES",
  "biceps": "BÍCEPS",
  "triceps": "TRÍCEPS",
  "pectorals": "PECHO",
  "lats": "ESPALDA",
  "quads": "PIERNAS",
  "glutes": "GLÚTEOS",
  "delts": "HOMBROS",
  "calves": "GEMELOS",
  "cardiovascular system": "CARDIO",
  "hamstrings": "PIERNAS (POSTERIOR)",
  "upper back": "ESPALDA ALTA",
  "spine": "LUMBARES"
};

function getCategory(equipment) {
  return equipment === "body weight" ? "Casa" : "Gimnasio";
}

const routines = [];
const grouped = { "Casa": {}, "Gimnasio": {} };

validExercises.forEach(ex => {
  const cat = getCategory(ex.equipment);
  const target = ex.target;
  if (!grouped[cat][target]) grouped[cat][target] = [];
  grouped[cat][target].push(ex);
});

const routineTemplates = [
  { name: "Desafío de {target}", type: "challenge" },
  { name: "Ruta {target} Nivel 1", type: "path" },
  { name: "Dominio de {target}", type: "mastery" }
];

let idCounter = 1;
["Casa", "Gimnasio"].forEach(cat => {
  Object.keys(grouped[cat]).forEach(target => {
    const list = grouped[cat][target];
    if (list.length < 3) return;
    const targetES = targetsES[target] || target.toUpperCase();
    const template = routineTemplates[Math.floor(Math.random() * routineTemplates.length)];
    const count = Math.min(list.length, 6);
    const selected = list.sort(() => 0.5 - Math.random()).slice(0, count);

    routines.push({
      id: `${cat.toLowerCase()}_${target}_${idCounter++}`,
      name: template.name.replace("{target}", targetES),
      category: cat,
      description: `Sigue el camino para perfeccionar tu técnica de ${targetES.toLowerCase()}.`,
      level: idCounter % 3 === 0 ? "Avanzado" : (idCounter % 2 === 0 ? "Intermedio" : "Principiante"),
      duration: `${count * 3} min`,
      xp: count * 50, // XP for finishing
      exercises: selected.map(ex => ({
        id: ex.id,
        name_es: ex.name_es || ex.name_en || ex.name,
        target_es: targetES,
        gif_url: ex.gif_url,
        work_time: 40,
        rest_time: 20,
        tempo: "2-0-2",
        instructions: ex.instruction_steps?.es || ex.instruction_steps?.en || ["Realiza el movimiento con control."]
      }))
    });
  });
});

fs.writeFileSync('src/data/routines.json', JSON.stringify(routines, null, 2));
console.log(`Regenerated ${routines.length} routines with valid GIFs.`);
