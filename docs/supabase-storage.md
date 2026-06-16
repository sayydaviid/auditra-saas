# Supabase Storage para evidências

## Configuração do MVP

1. No Supabase Dashboard, crie um bucket chamado `evidencias`.
2. Para demonstração, o bucket pode ser marcado como **Public bucket** para permitir a abertura das URLs públicas geradas pelo frontend.
3. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env` local e no ambiente de deploy.
4. Use somente publishable key ou anon key no frontend. Nunca exponha a `service_role`.

Como o MVP usa Firebase Authentication e não Supabase Auth, o Supabase não recebe uma sessão autenticada do usuário. Para permitir uploads diretamente pelo frontend, crie uma policy de `INSERT` para o papel `anon` limitada ao bucket:

```sql
create policy "Allow MVP evidence uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'evidencias');
```

Essa policy permite upload direto pelo frontend e deve ser tratada como configuração temporária para MVP e demonstração. Ela não é adequada para documentos sensíveis em produção.

Se o upload retornar erro `403`, `Unauthorized` ou violação de row-level security, confirme que o bucket está público e que a policy de `INSERT` acima foi publicada para o bucket `evidencias`.

O frontend tenta remover o arquivo quando o upload termina, mas o salvamento dos metadados no Cloud Firestore falha. Essa remoção depende de uma policy de exclusão efetiva no Supabase Storage. Se a exclusão não for confirmada, a aplicação mostra erro amigável informando que a limpeza do arquivo enviado não foi confirmada.

## Limitação de segurança

A aplicação usa Firebase Authentication para autenticação e sessão, Cloud Firestore para perfis, metadados das evidências e eventos de auditoria, e Supabase Storage para armazenar arquivos. O Firebase Authentication não autoriza automaticamente as policies do Supabase Storage.

Uma versão de produção deve usar bucket privado e uma API ou Edge Function para validar o usuário antes de upload, download ou exclusão. A chave `service_role` nunca deve ser usada no frontend.
