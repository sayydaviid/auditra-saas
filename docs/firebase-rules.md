# Regras recomendadas do Cloud Firestore

Firebase Authentication protege login, cadastro, logout, recuperação de senha e sessão. O Cloud Firestore armazena perfis em `users`, metadados de arquivos em `evidences` e eventos em `audit_events`.

As regras abaixo são recomendadas para o MVP e demonstração. Elas não liberam acesso público por data e exigem usuário autenticado nas collections usadas pela aplicação. Antes de publicar em produção, revise permissões por perfil, empresa e projeto.

Publique estas regras manualmente no Firebase Console ou pela Firebase CLI. Este arquivo é apenas documentação e não aplica mudanças automaticamente.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    match /evidences/{evidenceId} {
      allow read, create, update: if request.auth != null;
      allow delete: if false;
    }

    match /audit_events/{eventId} {
      allow read, create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```
