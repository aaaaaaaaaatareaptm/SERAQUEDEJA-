interface MinigameAnnounceProps {
  minigameName: string;
  onComplete: () => void;
}

export function MinigameAnnounce({ minigameName, onComplete }: MinigameAnnounceProps) {
  return (
    <div className="screen minigame-announce-screen" onClick={onComplete}>
      <div className="minigame-announce-flash" />
      <div className="minigame-announce-content">
        <div className="minigame-announce-label">¡MINIJUEGO!</div>
        <h1 className="minigame-announce-title">{minigameName}</h1>
        <p className="minigame-announce-tap">Toca para continuar ▸</p>
      </div>
    </div>
  );
}
