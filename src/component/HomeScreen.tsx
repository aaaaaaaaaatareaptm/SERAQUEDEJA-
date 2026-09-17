interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen">
      <div className="home-stars" />
      <div className="home-spotlight" />
      <div className="home-content">
        <div className="home-organ-row">
          <div className="home-organ home-organ--heart">
            <span className="home-organ-emoji">❤️</span>
          </div>
          <div className="home-organ home-organ--brain">
            <span className="home-organ-emoji">🧠</span>
          </div>
          <div className="home-organ home-organ--stomach">
            <span className="home-organ-emoji">🫃</span>
          </div>
        </div>

        <div className="home-badge">GRABACIÓN EN DIRECTO</div>

        <h1 className="home-title">
          <span className="home-title-line">FOOD</span>
          <span className="home-title-line home-title-line--accent">QUIZ SHOW</span>
        </h1>

        <p className="home-subtitle">¿Crees que sabes lo que comes?</p>

        <button className="btn-start" onClick={onStart}>
          <span className="btn-start-text">EMPEZAR JUEGO</span>
          <span className="btn-start-glow" />
        </button>

        <p className="home-footer">10 Preguntas · 2 Minijuegos · 3 Comodines</p>
      </div>
    </div>
  );
}
