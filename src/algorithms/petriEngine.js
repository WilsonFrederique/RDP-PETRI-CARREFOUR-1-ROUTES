// algorithms/petriEngine.js
// ---------------------------------------------------------------------------
// Route à double sens avec passage piétons — Réseau de Petri.
//
// Une seule route (les deux sens de circulation partagent le même feu).
//
// FEU VÉHICULES (3 couleurs) : 3 places mutuellement exclusives
// Vert / Jaune / Rouge (une seule marquée à la fois).
//
// FEU PIÉTONS : modélisé formellement par 2 places complémentaires
// (PiétAttente / PiétTraverse). Les piétons ne peuvent traverser que
// lorsque le feu véhicules est au Rouge : c'est la même transition (t2)
// qui fait basculer à la fois le feu véhicules vers Rouge ET le feu
// piéton vers Traverse, ce qui garantit structurellement qu'un conflit
// est impossible (les deux évènements sont atomiques, un seul tir).
//
// Cycle :
//   Vert --(t1)--> Jaune --(t2)--> Rouge + Piétons traversent
//        --(t3)--> Vert + Piétons attendent --(t1)--> ...
//
// Invariants de place (conservation des jetons) :
//   Vert + Jaune + Rouge = 1              (un seul état du feu véhicules)
//   PiétAttente + PiétTraverse = 1        (un seul état du feu piéton)
//
// Conséquence : le réseau est 1-sûr (aucune place ne dépasse 1 jeton),
// vivant (une transition est toujours tirable depuis tout marquage
// atteignable) et sûr (un piéton ne peut jamais traverser en même temps
// que les véhicules).
// ---------------------------------------------------------------------------

export const places = [
  { id: "V", label: "Vert (véhicules)" },
  { id: "J", label: "Jaune (véhicules)" },
  { id: "R", label: "Rouge (véhicules)" },
  { id: "pied_attente", label: "Piétons : Attente" },
  { id: "pied_traverse", label: "Piétons : Traverse" },
];

export const transitions = [
  {
    id: "t1",
    label: "Véhicules : Vert → Jaune",
    inputs: ["V"],
    outputs: ["J"],
  },
  {
    id: "t2",
    label: "Véhicules → Rouge ; les piétons traversent",
    inputs: ["J", "pied_attente"],
    outputs: ["R", "pied_traverse"],
  },
  {
    id: "t3",
    label: "Véhicules → Vert ; fin de la traversée",
    inputs: ["R", "pied_traverse"],
    outputs: ["V", "pied_attente"],
  },
];

export const initialMarking = {
  V: 1,
  J: 0,
  R: 0,
  pied_attente: 1,
  pied_traverse: 0,
};

// ---- Moteur générique --------------------------------------------------------
export function isEnabled(transition, marking) {
  return transition.inputs.every((p) => (marking[p] ?? 0) > 0);
}

export function fire(transition, marking) {
  if (!isEnabled(transition, marking)) return marking;
  const next = { ...marking };
  transition.inputs.forEach((p) => { next[p] -= 1; });
  transition.outputs.forEach((p) => { next[p] = (next[p] ?? 0) + 1; });
  return next;
}

export function getEnabledTransition(marking) {
  return transitions.find((t) => isEnabled(t, marking)) ?? null;
}

function buildMatrix(fn) {
  return places.map((p) => transitions.map((t) => fn(p.id, t)));
}
export function getPreMatrix() {
  return buildMatrix((p, t) => (t.inputs.includes(p) ? 1 : 0));
}
export function getPostMatrix() {
  return buildMatrix((p, t) => (t.outputs.includes(p) ? 1 : 0));
}
export function getIncidenceMatrix() {
  const pre = getPreMatrix();
  const post = getPostMatrix();
  return pre.map((row, i) => row.map((v, j) => post[i][j] - v));
}

// ---- États dérivés pour l'affichage -------------------------------------------

// "vert" | "jaune" | "rouge" — état du feu véhicules (les deux sens de la
// route partagent ce même feu, donc un seul état suffit).
export function getLightState(marking) {
  if (marking.V) return "vert";
  if (marking.J) return "jaune";
  return "rouge";
}

// "vert" (les piétons peuvent traverser) | "rouge" (ils doivent attendre).
// Fonction pure du marquage — c'est exactement la place pied_traverse /
// pied_attente, pas une place ou transition supplémentaire.
export function getPedState(marking) {
  return marking.pied_traverse ? "vert" : "rouge";
}
