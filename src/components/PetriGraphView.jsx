import { usePetri } from "../context/PetriContext";
import "./PetriGraphView.css";

const PLACE_POS = {
  V: [140, 60],
  J: [140, 220],
  R: [140, 380],
  pied_attente: [460, 60],
  pied_traverse: [460, 380],
};

const TRANSITION_POS = {
  t1: [140, 140],
  t2: [300, 300],
  t3: [300, 430],
};

// Chaque flèche P->T->P respecte le sens réel du franchissement
const ARCS = [
  ["V", "t1"], ["t1", "J"],

  ["J", "t2"], ["pied_attente", "t2"],
  ["t2", "R"], ["t2", "pied_traverse"],

  ["R", "t3"], ["pied_traverse", "t3"],
  ["t3", "V"], ["t3", "pied_attente"],
];

function pointAt(id) {
  return PLACE_POS[id] || TRANSITION_POS[id];
}

function radiusOf(id) {
  if (TRANSITION_POS[id]) return 15;
  if (id.startsWith("pied_")) return 17;
  return 19;
}

// Recadre la ligne droite (direction) aux bords des formes, avant de la courber
function trim(x1, y1, x2, y2, r1, r2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  return { x1: x1 + ux * r1, y1: y1 + uy * r1, x2: x2 - ux * r2, y2: y2 - uy * r2 };
}

// Courbe de Bézier quadratique : donne le style "en flèche" (P->T->P), pas une ligne droite
function curvePath(x1, y1, x2, y2, bend) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const cx = mx + px * bend, cy = my + py * bend;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

function stateColorClass(id) {
  if (id === "V") return "vert";
  if (id === "J") return "jaune";
  if (id === "R") return "rouge";
  if (id === "pied_traverse") return "ped-go";
  return "ped-wait";
}

function PetriGraphView() {
  const { places, transitions, marking, activeTransition } = usePetri();

  return (
    <div className="graph-card">
      <div className="graph-head">
        <h4>Graphe du RDP</h4>
        <span className="graph-badge">{places.length} places • {transitions.length} transitions</span>
      </div>

      <svg viewBox="0 0 600 470" className="graph-svg">
        <defs>
          <marker id="arrow" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-ped" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#38bdf8" />
          </marker>
          <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#1eb8a6" />
          </marker>
        </defs>

        {ARCS.map(([a, b], i) => {
          const [x1, y1] = pointAt(a);
          const [x2, y2] = pointAt(b);
          const isPed = a.startsWith("pied_") || b.startsWith("pied_");
          const touchesActive = a === activeTransition || b === activeTransition;
          const line = trim(x1, y1, x2, y2, radiusOf(a), radiusOf(b));
          const bend = (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 10);
          const d = curvePath(line.x1, line.y1, line.x2, line.y2, bend);
          const marker = touchesActive ? "url(#arrow-active)" : isPed ? "url(#arrow-ped)" : "url(#arrow)";
          const cls = touchesActive ? "arc arc-active" : isPed ? "arc arc-ped" : "arc arc-veh";
          return <path key={i} d={d} className={cls} markerEnd={marker} />;
        })}

        {transitions.map((t) => {
          const [x, y] = TRANSITION_POS[t.id];
          const active = t.id === activeTransition;
          return (
            <g key={t.id}>
              <rect x={x - 13} y={y - 13} width="26" height="26" rx="6" className={`transition-rect ${active ? "active" : ""}`} />
              <text x={x} y={y - 22} className="transition-label">{t.label}</text>
            </g>
          );
        })}

        {places.map((p) => {
          const [x, y] = PLACE_POS[p.id];
          const marked = marking[p.id] > 0;
          const cls = stateColorClass(p.id);
          const isPed = p.id.startsWith("pied_");
          return (
            <g key={p.id}>
              {isPed ? (
                <rect x={x - 17} y={y - 17} width="34" height="34" rx="8" className={`place-node ${cls} ${marked ? "marked" : ""}`} />
              ) : (
                <circle cx={x} cy={y} r="19" className={`place-node ${cls} ${marked ? "marked" : ""}`} />
              )}
              {marked && <circle cx={x} cy={y} r="5" className="place-token" />}
              <text x={x} y={y + (isPed ? 32 : 35)} className="place-label">{p.label}</text>
            </g>
          );
        })}
      </svg>

      <div className="graph-legend">
        <span><i className="dot vert" /> Vert</span>
        <span><i className="dot jaune" /> Jaune</span>
        <span><i className="dot rouge" /> Rouge</span>
        <span><i className="dot ped-go" /> Piéton OK</span>
        <span><i className="dot ped-wait" /> Piéton attend</span>
      </div>
    </div>
  );
}

export default PetriGraphView;
