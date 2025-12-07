# XRisk Backend

Spring Boot Backend, exposing REST APIs for risks, offers, messages and users. The application starts on port `8080`.

## Endpoints
- `POST /api/risks` – Risiko anlegen.
- `GET /api/risks` – Alle Risiken abrufen.
- `GET /api/risks/{id}` – Risiko-Detail anzeigen.
- `POST /api/offers` – Angebot für ein Risiko erstellen.
- `GET /api/risks/{riskId}/offers` – Angebote zu einem Risiko auflisten.
- `PATCH /api/offers/{offerId}/status` – Angebotsstatus ändern (z. B. annehmen/ablehnen).
- `POST /api/offers/{offerId}/messages` – Nachricht zu einem Angebot senden.
- `GET /api/offers/{offerId}/messages` – Nachrichtenverlauf zu einem Angebot abrufen.
- `GET /api/users/{id}` – Benutzerprofil laden.
- `GET /api/me` – Demo-User zurückgeben.

## Starten
1. Java 17 installieren.
2. Abhängig­keiten laden und Server starten:
   ```bash
   mvn spring-boot:run
   ```

Beim Start wird Beispieldaten (Risiko, Angebot, Nachricht) erzeugt, damit die Frontend-Flows testbar sind.
