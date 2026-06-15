export default function SessionLoading() {
  return (
    <main className="session-loading-page" aria-live="polite" aria-busy="true">
      <section className="session-loading-card">
        <div className="session-loading-spinner" aria-hidden="true" />
        <h1>Carregando sessão...</h1>
        <p>Validando seu acesso à Auditra.</p>
      </section>
    </main>
  );
}
