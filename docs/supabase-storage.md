# Supabase Storage para evidências

## Configuração do MVP

1. No Supabase Dashboard, crie um bucket chamado `evidencias`.
2. Marque o bucket como **Public bucket** para permitir a abertura das URLs públicas geradas pelo frontend.
3. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` ou `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env` local e no ambiente de deploy.
4. Use somente a anon key ou publishable key no frontend. Nunca exponha a `service_role`.

Como o MVP usa Firebase Authentication e não Supabase Auth, o Supabase não recebe uma sessão autenticada do usuário. Para permitir uploads diretamente pelo frontend, crie uma policy de `INSERT` para o papel `anon` limitada ao bucket:

```sql
create policy "Allow MVP evidence uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'evidencias');
```

Essa policy permite uploads públicos no bucket e deve ser tratada como configuração temporária de MVP. Em produção, mova o upload para um backend confiável ou integre um mecanismo de autorização reconhecido pelo Supabase.

Se o upload retornar erro `403`, `Unauthorized` ou violação de row-level security, confirme que o bucket está público e que a policy de `INSERT` acima foi publicada para o bucket `evidencias`.
