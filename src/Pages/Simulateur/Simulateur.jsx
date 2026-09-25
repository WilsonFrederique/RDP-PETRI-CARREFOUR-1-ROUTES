import RoadView from "../../components/RoadView";
import PetriGraphView from "../../components/PetriGraphView";
import "./Simulateur.css";

function Simulateur() {
  return (
    <div className="sim-page">
      <div className="sim-grid">
        <RoadView />
        <PetriGraphView />
      </div>
    </div>
  );
}

export default Simulateur;
