import MatrixTable from "../../components/MatrixTable";
import {
  places,
  transitions,
  getPreMatrix,
  getPostMatrix,
  getIncidenceMatrix,
} from "../../algorithms/petriEngine";
import "./Matrices.css";

function Matrices() {
  return (
    <div className="matrices-page">
      <MatrixTable title="Matrice Pré (W⁻)" badge="Pré" matrix={getPreMatrix()} places={places} transitions={transitions} />
      <MatrixTable title="Matrice Post (W⁺)" badge="Post" matrix={getPostMatrix()} places={places} transitions={transitions} />
      <MatrixTable title="Matrice d'Incidence (W = W⁺ − W⁻)" badge="Incidence" matrix={getIncidenceMatrix()} places={places} transitions={transitions} />
    </div>
  );
}

export default Matrices;
