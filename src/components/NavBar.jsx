import {
  LuMenu, LuX, LuSkipBack, LuPlay, LuPause, LuSkipForward, LuRotateCcw,
} from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { usePetri } from "../context/PetriContext";
import "./NavBar.css";

function NavBar({ isSidebarOpen, onToggleSidebar }) {
  const {
    places, transitions, hasNetwork, isDeadlocked,
    prev, next, reset, togglePlay, isPlaying, canPrev,
  } = usePetri();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-burger" onClick={onToggleSidebar} aria-label="Ouvrir le menu">
          {isSidebarOpen ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>

        <div className="navbar-brand">
          <span className="navbar-logo">
            <PiFlowArrowBold size={20} />
          </span>
          <div className="navbar-titles">
            <span className="navbar-title">Petri Sim</span>
            <span className="navbar-subtitle">Route à double sens</span>
          </div>
        </div>
      </div>

      <div className="navbar-controls">
        <button onClick={prev} disabled={!canPrev} title="Précédent">
          <LuSkipBack size={16} />
          <span className="btn-label">Précédent</span>
        </button>
        <button className="primary" onClick={togglePlay} title="Lecture / Pause">
          {isPlaying ? <LuPause size={16} /> : <LuPlay size={16} />}
          <span className="btn-label">{isPlaying ? "Pause" : "Lecture"}</span>
        </button>
        <button onClick={next} disabled={isDeadlocked} title="Suivant">
          <LuSkipForward size={16} />
          <span className="btn-label">Suivant</span>
        </button>
        <button className="ghost" onClick={reset} aria-label="Réinitialiser" title="Réinitialiser">
          <LuRotateCcw size={16} />
        </button>
      </div>

      <div className="navbar-right">
        {hasNetwork && (
          <>
            <span className="navbar-stat">{places.length} places</span>
            <span className="navbar-stat">{transitions.length} transitions</span>
            <span className={`navbar-status ${isDeadlocked ? "is-blocked" : "is-live"}`}>
              {isDeadlocked ? "Blocage" : "Actif"}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

export default NavBar;
