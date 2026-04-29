const fs = require('fs');

const exercises = JSON.parse(fs.readFileSync('src/data/hasan_exercises.json', 'utf8'));

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

// Group exercises by Category and Target
const grouped = {
  "Casa": {},
  "Gimnasio": {}
};

exercises.forEach(ex => {
  const cat = getCategory(ex.equipment);
  const target = ex.target;
  if (!grouped[cat][target]) grouped[cat][target] = [];
  grouped[cat][target].push(ex);
});

const routineTemplates = [
  { name: "Blast de {target}", type: "fuerza" },
  { name: "Rutina {target} Pro", type: "pro" },
  { name: "Esculpir {target}", type: "estetica" },
  { name: "Poder en {target}", type: "power" }
];

let idCounter = 1;

["Casa", "Gimnasio"].forEach(cat => {
  Object.keys(grouped[cat]).forEach(target => {
    const list = grouped[cat][target];
    if (list.length < 3) return;

    // Create a routine for this target
    const targetES = targetsES[target] || target.toUpperCase();
    const template = routineTemplates[Math.floor(Math.random() * routineTemplates.length)];
    
    // Pick 4-6 exercises
    const count = Math.min(list.length, 5);
    const selected = list.sort(() => 0.5 - Math.random()).slice(0, count);

    routines.push({
      id: `${cat.toLowerCase()}_gen_${idCounter++}`,
      name: template.name.replace("{target}", targetES),
      category: cat,
      description: `Entrenamiento intensivo enfocado en ${targetES.toLowerCase()} para mejores resultados.`,
      level: idCounter % 3 === 0 ? "Avanzado" : (idCounter % 2 === 0 ? "Intermedio" : "Principiante"),
      duration: `${count * 4} min`,
      exercises: selected.map(ex => ({
        id: ex.id,
        name_es: ex.name_es || ex.name_en || ex.name,
        target_es: targetES,
        gif_url: ex.gif_url,
        work_time: 45,
        rest_time: 15,
        tempo: "2-0-2",
        instructions: ex.instruction_steps?.es || ex.instruction_steps?.en || ["Realiza el movimiento con control."]
      }))
    });
  });
});

// Add some "Mixed" routines
const mixedRoutines = [
  { name: "Full Body Guerrero", cat: "Casa", targets: ["abs", "quads", "pectorals", "cardiovascular system"] },
  { name: "Torso Superior Elite", cat: "Gimnasio", targets: ["pectorals", "lats", "delts", "triceps"] },
  { name: "Tren Inferior Potencia", cat: "Gimnasio", targets: ["quads", "glutes", "calves"] },
  { name: "Core y Cardio Mix", cat: "Casa", targets: ["abs", "cardiovascular system"] }
];

mixedRoutines.forEach(m => {
  const exList = [];
  m.targets.forEach(t => {
    const pool = grouped[m.cat][t];
    if (pool && pool.length > 0) {
      exList.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  });

  if (exList.length > 0) {
    routines.push({
      id: `mixed_${idCounter++}`,
      name: m.name,
      category: m.cat,
      description: `Una combinación perfecta para un entrenamiento completo de ${m.name.toLowerCase()}.`,
      level: "Intermedio",
      duration: `${exList.length * 4} min`,
      exercises: exList.map(ex => ({
        id: ex.id,
        name_es: ex.name_es || ex.name_en || ex.name,
        target_es: targetsES[ex.target] || ex.target.toUpperCase(),
        gif_url: ex.gif_url,
        work_time: 45,
        rest_time: 15,
        tempo: "2-1-2",
        instructions: ex.instruction_steps?.es || ex.instruction_steps?.en || ["Realiza el movimiento con control."]
      }))
    });
  }
});

fs.writeFileSync('src/data/routines.json', JSON.stringify(routines, null, 2));
console.log(`Generated ${routines.length} routines!`);
