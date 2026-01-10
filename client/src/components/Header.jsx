import "../styles/Header.css";

export default function Header({ onLogout }) {
  return (
    <header className="headerOuter">
      <div className="headerInner">
        <div>
          <div className="headerBrand">FocusFlow</div>
          <div className="headerTagline">Build deep focus, one task at a time</div>
        </div>

        {onLogout ? (
          <button className="btn" onClick={onLogout} type="button">
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}
