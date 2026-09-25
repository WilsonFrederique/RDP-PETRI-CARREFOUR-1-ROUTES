import { places, transitions } from "../../algorithms/petriEngine";
import "./Theorie.css";

function Theorie() {
  return (
    <div className="theorie-page">
      <div className="theorie-card">
        <h3>Le modèle</h3>
        <p>
          Une seule route, à double sens de circulation : les deux sens partagent le même feu
          véhicules à 3 états mutuellement exclusifs (Vert, Jaune, Rouge) et le même passage
          piétons, doté d'un feu à 2 états formels (Attente, Traverse). Le cycle avance de façon
          strictement séquentielle : Vert → Jaune → Rouge (les piétons traversent) → Vert. Les
          piétons ne peuvent traverser que lorsque le feu véhicules est au Rouge.
        </p>
      </div>

      <div className="theorie-card">
        <h3>Invariants de place</h3>
        <ul>
          <li><code>Vert + Jaune + Rouge = 1</code> — un seul état du feu véhicules à la fois.</li>
          <li><code>PiétAttente + PiétTraverse = 1</code> — un seul état du feu piéton à la fois.</li>
        </ul>
        <p>
          Ces invariants garantissent structurellement qu'un piéton ne peut jamais traverser en
          même temps que les véhicules : c'est la même transition (t2) qui fait basculer
          atomiquement le feu véhicules vers Rouge <em>et</em> le feu piéton vers Traverse, donc
          aucun état intermédiaire incohérent n'est jamais atteignable. Le réseau est 1-sûr et
          vivant : depuis n'importe quel marquage atteignable, une transition finit toujours par
          pouvoir se déclencher.
        </p>
      </div>

      <div className="theorie-card">
        <h3>Panneau véhicules à 3 couleurs</h3>
        <p>
          Le simulateur affiche un feu tricolore classique (vert / jaune / rouge), directement lu
          sur le marquage des places <code>V</code>, <code>J</code>, <code>R</code>. Les deux
          poteaux affichés de part et d'autre du passage piéton montrent exactement le même état :
          la route n'a qu'un seul feu logique, valable pour les deux sens.
        </p>
      </div>

      <div className="theorie-card">
        <h3>Passage piétons</h3>
        <p>
          Le feu piéton (rouge / vert) est une lecture directe des places <code>pied_attente</code> /
          <code> pied_traverse</code>. Dans la scène, les piétons attendent sur le trottoir tant que
          <code> pied_attente</code> est marquée, et traversent dès que la transition <code>t2</code>
          bascule le marquage vers <code>pied_traverse</code> — exactement au moment où les véhicules
          passent au rouge, jamais avant.
        </p>
      </div>

      <div className="theorie-grid">
        <div className="theorie-card">
          <h3>Places ({places.length})</h3>
          <table className="theorie-table">
            <tbody>
              {places.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.id}</td>
                  <td>{p.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="theorie-card">
          <h3>Transitions ({transitions.length})</h3>
          <table className="theorie-table">
            <tbody>
              {transitions.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.id}</td>
                  <td>{t.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Theorie;
