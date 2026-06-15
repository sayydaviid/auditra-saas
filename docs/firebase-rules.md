# Regras do Cloud Firestore

## Regra temporária atual

O projeto está usando uma regra temporária que libera leitura e escrita em todas as collections até **12 de julho de 2026**:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2026, 7, 12);
    }
  }
}
```

Essa regra facilita testes de cadastro, evidências e auditoria, mas é insegura para produção porque aceita requisições sem autenticação.

## Regra sugerida

Antes de publicar a aplicação, substitua a regra temporária por uma regra autenticada:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /evidences/{document=**} {
      allow read, write: if request.auth != null;
    }

    match /audit_events/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
