import { usePetri } from "../context/PetriContext";
import "./RoadView.css";

function VehicleLight({ state }) {
  return (
    <div className="traffic-light">
      <span className={`bulb red ${state === "rouge" ? "on" : ""}`} />
      <span className={`bulb yellow ${state === "jaune" ? "on" : ""}`} />
      <span className={`bulb green ${state === "vert" ? "on" : ""}`} />
    </div>
  );
}

function PedLight({ state }) {
  return (
    <div className="ped-light">
      <span className={`ped-bulb red ${state === "rouge" ? "on" : ""}`}>✋</span>
      <span className={`ped-bulb green ${state === "vert" ? "on" : ""}`}>🚶</span>
    </div>
  );
}

function Pedestrian({ origin, walking }) {
  // .ped-track porte le déplacement réel (transition sur "top", d'un trottoir
  // à l'autre, en traversant la bande zébrée) — .ped-figure ne fait que le
  // cycle de marche (balancement des jambes) pendant que .ped-track avance,
  // exactement comme une voiture qui roule pendant que ses clignotants
  // tournent : deux animations indépendantes combinées.
  return (
    <div className={`ped-track ped-from-${origin} ${walking ? "walk" : "wait"}`}>
      <span className="ped-figure" aria-hidden="true">{walking ? "🚶" : "🧍"}</span>
    </div>
  );
}

function Car({ lane, driving }) {
  return <div className={`car car-${lane} ${driving ? "driving" : "stopped"}`} />;
}

function RoadView() {
  const { lightState, pedState, activeTransition } = usePetri();
  const carsDriving = lightState === "vert";
  const pedWalking = pedState === "vert";

  return (
    <div className="road-card">
      <div className="road-head">
        <h4>Route à double sens et passage piétons</h4>
        <span className="road-badge">
          {activeTransition ? `Transition active : ${activeTransition}` : "Blocage"}
        </span>
      </div>

      <div className="road-stage">
        <div className="sidewalk sidewalk-top">
          <PedLight state={pedState} />
          <Pedestrian origin="top" walking={pedWalking} />
        </div>

        <div className="road-strip">
          <div className="lane lane-a">
            <Car lane="a" driving={carsDriving} />
          </div>
          <div className="lane-divider" />
          <div className="lane lane-b">
            <Car lane="b" driving={carsDriving} />
          </div>
          <div className="crosswalk" />
          <div className="light-pole pole-left">
            <VehicleLight state={lightState} />
          </div>
          <div className="light-pole pole-right">
            <VehicleLight state={lightState} />
          </div>
        </div>

        <div className="sidewalk sidewalk-bottom">
          <Pedestrian origin="bottom" walking={pedWalking} />
          <PedLight state={pedState} />
        </div>
      </div>

      <div className="road-legend">
        <div className="legend-row">
          <span className={`legend-dot dot-${lightState}`} />
          <span>
            Feu véhicules : <b>{lightState}</b> - les deux sens de circulation partagent le même feu
          </span>
        </div>
        <div className="legend-row">
          <span className={`legend-dot dot-ped-${pedState}`} />
          <span>
            Feu piétons : <b>{pedState === "vert" ? "peuvent traverser" : "doivent attendre"}</b>
          </span>
        </div>
        <div className="legend-row">
          <span className={`legend-dot dot-ped}`} />
          <span>
            ......
          </span>
        </div>
      </div>
    </div>
  );
}

export default RoadView;
