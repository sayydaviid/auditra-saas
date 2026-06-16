# Plano de Trabalho do Projeto Auditra SaaS

## 1. Objetivo do projeto

O objetivo deste plano é transformar o frontend gerado inicialmente em uma aplicação funcional, organizada e com aparência profissional.

A Auditra será uma plataforma SaaS para governança, compliance e rastreabilidade de projetos de Pesquisa e Desenvolvimento. O sistema deverá permitir o controle de projetos, registro de horas, envio de evidências técnicas, aprovação de atividades, geração de relatórios e acompanhamento de trilha de auditoria.

Nesta etapa, o foco é sair de uma interface apenas visual para uma aplicação mais próxima de um MVP real, com autenticação, armazenamento de arquivos, banco de dados, deploy e organização profissional do código.

## 2. Stack definida

O projeto será desenvolvido com:

* React
* JavaScript
* Vite
* CSS normal
* React Router DOM
* Lucide React
* Recharts
* React Hook Form
* Zod
* Firebase Authentication
* Cloud Firestore
* Supabase Storage
* Deploy no Render
* GitHub para versionamento

## 3. Organização da equipe

A equipe será dividida em três frentes principais.

### Integrante 1: Frontend, UI e experiência do usuário

Responsável por deixar a interface profissional, responsiva, organizada e fácil de usar.

Principais responsabilidades:

* Revisar todas as telas geradas pelo Claude.
* Corrigir erros visuais.
* Melhorar responsividade no desktop, tablet e celular.
* Padronizar botões, cards, tabelas, formulários e badges.
* Organizar os arquivos CSS.
* Criar ou ajustar componentes reutilizáveis.
* Garantir que todas as páginas tenham aparência de produto SaaS real.
* Melhorar a navegação entre páginas.
* Criar estados de carregamento, vazio e erro.
* Melhorar o dashboard com cards e gráficos.
* Ajustar a tela de login.
* Melhorar páginas de projetos, evidências, horas, aprovações, relatórios e auditoria.

Entregas esperadas:

* Interface final limpa e profissional.
* Layout responsivo funcionando.
* Componentes visuais padronizados.
* Páginas sem quebra visual.
* Navegação funcionando corretamente.

Critérios de conclusão:

* O sistema abre sem erro visual grave.
* Todas as páginas estão acessíveis pela sidebar.
* A interface funciona bem em tela grande e celular.
* Os componentes seguem o mesmo padrão visual.
* O sistema parece apresentável para banca, cliente ou investidor.

---

### Integrante 2: Firebase, autenticação e arquivos

Responsável por configurar o Firebase e transformar partes simuladas em funcionalidades reais.

Principais responsabilidades:

* Criar o projeto no Firebase Console.
* Configurar Firebase Authentication.
* Ativar login com e-mail e senha.
* Criar o arquivo de configuração do Firebase no projeto.
* Criar variáveis de ambiente para as chaves do Firebase.
* Integrar login real na tela de login.
* Criar função de logout.
* Proteger rotas internas para usuários logados.
* Criar contexto de autenticação no React.
* Criar controle simples de sessão.
* Configurar Supabase Storage.
* Implementar upload real de evidências.
* Salvar arquivos de evidência no Supabase Storage.
* Salvar metadados das evidências no Cloud Firestore.
* Registrar eventos de auditoria no Cloud Firestore.
* Retornar URL do arquivo enviado.
* Preparar regras básicas de segurança do Firestore e documentar limitações do Storage.
* Criar tratamento de erro para login e upload.
* Criar estados de loading durante login e envio de arquivo.

Entregas esperadas:

* Login real com Firebase Authentication.
* Logout funcionando.
* Rotas protegidas.
* Upload real de arquivos para Supabase Storage.
* Arquivo `.env.example` com variáveis necessárias.
* Código sem chaves sensíveis expostas no GitHub.

Critérios de conclusão:

* Usuário consegue fazer login.
* Usuário não acessa dashboard sem estar logado.
* Usuário consegue sair da conta.
* Arquivos enviados aparecem no bucket `evidencias` do Supabase Storage.
* O sistema mostra erro caso login ou upload falhe.

---

### Integrante 3: Banco de dados, API, deploy e qualidade

Responsável por banco de dados, API, deploy, documentação e validação final.

Principais responsabilidades:

* Criar banco no Neon PostgreSQL.
* Modelar as tabelas principais do sistema.
* Criar estrutura inicial da API em Node.js.
* Configurar conexão da API com o Neon.
* Criar variáveis de ambiente da API.
* Criar endpoints principais.
* Integrar frontend com a API aos poucos.
* Preparar deploy do frontend no Render Static Site.
* Preparar deploy da API no Render Web Service.
* Corrigir problemas de build.
* Criar documentação do projeto.
* Criar README profissional.
* Criar checklist de testes.
* Testar fluxo completo do sistema.
* Organizar issues no GitHub.
* Revisar pull requests.
* Garantir que o projeto rode em outra máquina.

Entregas esperadas:

* Banco Neon configurado.
* Estrutura inicial da API criada.
* Endpoints principais funcionando.
* Frontend publicado no Render.
* API publicada no Render.
* README atualizado.
* Documentação de instalação.
* Checklist de testes.
* Build funcionando.

Critérios de conclusão:

* `npm install` funciona.
* `npm run dev` funciona.
* `npm run build` funciona.
* Deploy no Render funciona.
* A API conecta no banco Neon.
* O README explica como rodar o projeto.
* O projeto pode ser clonado e executado por outra pessoa.

## 4. Estrutura técnica desejada

A estrutura final do repositório pode seguir este modelo:

```txt
auditra-saas/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── plano-de-trabalho.md
│   ├── checklist-testes.md
│   └── modelo-banco.md
│
├── README.md
└── .gitignore
```

Caso o projeto ainda esteja todo na raiz, a equipe deve primeiro organizar o repositório em `frontend/` e `backend/`.

## 5. Modelagem inicial do banco de dados

O banco Neon PostgreSQL deve começar com as tabelas principais.

Tabelas sugeridas:

### users

Campos:

* id
* firebase_uid
* name
* email
* role
* company_id
* status
* created_at
* updated_at

### companies

Campos:

* id
* name
* cnpj
* segment
* responsible_name
* status
* created_at
* updated_at

### projects

Campos:

* id
* company_id
* name
* description
* responsible_id
* status
* risk_level
* start_date
* end_date
* documentation_progress
* created_at
* updated_at

### time_entries

Campos:

* id
* project_id
* user_id
* date
* hours
* activity_type
* description
* deliverable
* status
* created_at
* updated_at

### evidences

Campos:

* id
* project_id
* user_id
* title
* description
* evidence_type
* file_url
* file_name
* status
* created_at
* updated_at

### approvals

Campos:

* id
* project_id
* item_type
* item_id
* requested_by
* reviewed_by
* status
* comment
* created_at
* updated_at

### reports

Campos:

* id
* project_id
* title
* status
* file_url
* generated_by
* created_at
* updated_at

### audit_events

Campos:

* id
* project_id
* user_id
* event_type
* action
* description
* created_at

## 6. Endpoints iniciais da API

A API em Node.js deve começar com endpoints simples.

### Auth e usuário

* `GET /api/me`
* `GET /api/users`
* `POST /api/users`
* `PUT /api/users/:id`

### Empresas

* `GET /api/companies`
* `GET /api/companies/:id`
* `POST /api/companies`
* `PUT /api/companies/:id`

### Projetos

* `GET /api/projects`
* `GET /api/projects/:id`
* `POST /api/projects`
* `PUT /api/projects/:id`

### Registro de horas

* `GET /api/time-entries`
* `POST /api/time-entries`
* `PUT /api/time-entries/:id`

### Evidências

* `GET /api/evidences`
* `POST /api/evidences`
* `PUT /api/evidences/:id`

### Aprovações

* `GET /api/approvals`
* `PUT /api/approvals/:id/status`

### Relatórios

* `GET /api/reports`
* `POST /api/reports`

### Auditoria

* `GET /api/audit-events`

## 7. Divisão por etapas

### Etapa 1: Organização e correção do frontend

Responsável principal: Integrante 1
Apoio: Integrante 3

Tarefas:

* Rodar o projeto localmente.
* Corrigir erros de instalação.
* Corrigir erros de importação.
* Remover arquivos desnecessários.
* Verificar se todas as rotas funcionam.
* Organizar componentes.
* Padronizar CSS.
* Melhorar responsividade.
* Criar estados de loading, erro e vazio.
* Revisar dashboard.
* Revisar formulários.
* Revisar tabelas.
* Fazer build local.

Entrega da etapa:

* Frontend rodando sem erro.
* Interface revisada.
* Código organizado.

---

### Etapa 2: GitHub e fluxo de trabalho

Responsável principal: Integrante 3
Apoio: todos

Tarefas:

* Criar issues no GitHub.
* Criar branch principal `main`.
* Criar branch de desenvolvimento `develop`.
* Definir padrão de branches.
* Definir padrão de commits.
* Criar pull requests para cada tarefa.
* Revisar código antes de juntar na branch principal.

Padrão de branches:

```txt
feature/nome-da-funcionalidade
fix/nome-do-ajuste
docs/nome-da-documentacao
```

Exemplos:

```txt
feature/firebase-auth
feature/upload-evidencias
feature/api-projetos
fix/responsividade-dashboard
docs/atualiza-readme
```

Padrão de commits:

```txt
feat: adiciona login com Firebase
fix: corrige responsividade da sidebar
docs: atualiza instruções de instalação
style: ajusta layout da tela de projetos
refactor: reorganiza componentes de formulário
```

Entrega da etapa:

* Repositório organizado.
* Issues criadas.
* Fluxo de trabalho definido.

---

### Etapa 3: Firebase Authentication

Responsável principal: Integrante 2
Apoio: Integrante 1

Tarefas:

* Criar projeto no Firebase.
* Ativar Authentication.
* Ativar login por e-mail e senha.
* Criar arquivo `firebase.js`.
* Criar `.env.example`.
* Configurar variáveis de ambiente.
* Criar `AuthContext`.
* Criar função de login.
* Criar função de logout.
* Criar proteção de rotas.
* Atualizar tela de login.
* Exibir usuário logado no header.
* Tratar erros de login.
* Criar loading de autenticação.

Entrega da etapa:

* Login real funcionando.
* Logout funcionando.
* Rotas protegidas funcionando.

---

### Etapa 4: Supabase Storage para evidências

Responsável principal: Integrante 2
Apoio: Integrante 1

Tarefas:

* Criar bucket `evidencias` no Supabase Storage.
* Criar função de upload.
* Integrar upload na página de Evidências.
* Exibir nome do arquivo selecionado.
* Enviar arquivo para o Storage.
* Recuperar URL do arquivo.
* Salvar metadados da evidência no Cloud Firestore.
* Registrar evento em `audit_events`.
* Exibir loading durante upload.
* Tratar erro de upload.
* Melhorar área visual de upload.

Entrega da etapa:

* Upload real funcionando.
* Arquivos aparecendo no Supabase Storage.
* Interface mostrando feedback ao usuário.

---

### Etapa 5: Banco Neon PostgreSQL

Responsável principal: Integrante 3
Apoio: Integrante 2

Tarefas:

* Criar banco no Neon.
* Criar string de conexão.
* Configurar `.env` do backend.
* Criar script SQL inicial.
* Criar tabelas principais.
* Criar dados iniciais de teste.
* Testar conexão local.
* Documentar modelo do banco.
* Criar arquivo `docs/modelo-banco.md`.

Entrega da etapa:

* Banco criado.
* Tabelas principais criadas.
* Documentação do banco pronta.

---

### Etapa 6: API Node.js

Responsável principal: Integrante 3
Apoio: Integrante 2

Tarefas:

* Criar pasta `backend`.
* Criar servidor Node.js.
* Configurar Express.
* Configurar CORS.
* Configurar conexão com Neon.
* Criar rotas principais.
* Criar controllers.
* Criar services.
* Criar tratamento básico de erro.
* Criar endpoint de health check.
* Testar API com Insomnia, Postman ou Thunder Client.
* Preparar API para deploy no Render.

Entrega da etapa:

* API local funcionando.
* Endpoints principais respondendo.
* API conectada ao Neon.

---

### Etapa 7: Integração frontend com API

Responsável principal: Integrante 1
Apoio: Integrante 3

Tarefas:

* Criar serviços no frontend em `src/services`.
* Criar cliente HTTP.
* Trocar dados mockados por chamadas reais aos poucos.
* Integrar listagem de projetos.
* Integrar detalhe do projeto.
* Integrar empresas.
* Integrar usuários.
* Integrar registros de horas.
* Integrar evidências.
* Integrar aprovações.
* Integrar relatórios.
* Integrar auditoria.
* Criar loading nas chamadas.
* Criar tratamento de erro.
* Criar fallback para dados vazios.

Entrega da etapa:

* Frontend buscando dados da API.
* Principais telas integradas.
* Mock data usada apenas como fallback ou removida.

---

### Etapa 8: Regras de negócio principais

Responsável: todos

Tarefas:

* Definir quem pode acessar cada página.
* Definir permissões por perfil.
* Pesquisador pode registrar horas e evidências.
* Gestor pode aprovar ou reprovar.
* Financeiro/Compliance pode ver relatórios e auditoria.
* Administrador pode gerenciar empresas e usuários.
* Criar validações nos formulários.
* Criar status padronizados.
* Criar eventos automáticos de auditoria.
* Registrar evento quando usuário cria evidência.
* Registrar evento quando usuário cria horas.
* Registrar evento quando gestor aprova ou reprova.
* Registrar evento quando relatório é gerado.

Entrega da etapa:

* Sistema com regras básicas de uso.
* Auditoria registrando ações importantes.

---

### Etapa 9: Deploy no Render

Responsável principal: Integrante 3
Apoio: todos

Tarefas:

* Criar Static Site no Render para o frontend.
* Configurar build command.
* Configurar publish directory.
* Configurar variáveis de ambiente.
* Resolver problema de rotas do React Router.
* Criar Web Service no Render para API.
* Configurar variáveis da API.
* Testar frontend em produção.
* Testar API em produção.
* Corrigir CORS se necessário.
* Atualizar README com links de produção.

Entrega da etapa:

* Frontend publicado.
* API publicada.
* Projeto acessível por link.

---

### Etapa 10: Testes, revisão e apresentação

Responsável: todos

Tarefas:

* Testar login.
* Testar logout.
* Testar navegação.
* Testar dashboard.
* Testar cadastro ou listagem de projetos.
* Testar registro de horas.
* Testar envio de evidência.
* Testar aprovação.
* Testar relatórios.
* Testar trilha de auditoria.
* Testar responsividade.
* Testar build.
* Testar deploy.
* Revisar README.
* Criar roteiro de apresentação.
* Criar prints das principais telas.
* Criar lista de funcionalidades prontas.
* Criar lista de próximos passos.

Entrega da etapa:

* Projeto revisado.
* Apresentação pronta.
* Sistema estável para demonstração.

## 8. Cronograma sugerido

### Semana 1

Foco: organizar o frontend e o repositório.

Integrante 1:

* Corrigir layout.
* Melhorar CSS.
* Ajustar páginas.
* Corrigir responsividade.

Integrante 2:

* Criar projeto Firebase.
* Estudar integração do Auth.
* Preparar `firebase.js`.

Integrante 3:

* Organizar GitHub.
* Criar estrutura do backend.
* Criar banco Neon.
* Criar documentação inicial.

### Semana 2

Foco: autenticação, storage e banco.

Integrante 1:

* Ajustar tela de login.
* Criar estados visuais.
* Melhorar formulários.

Integrante 2:

* Implementar Firebase Auth.
* Implementar logout.
* Proteger rotas.
* Configurar Storage.

Integrante 3:

* Criar tabelas no Neon.
* Criar API Node.js.
* Criar endpoints iniciais.

### Semana 3

Foco: integração real.

Integrante 1:

* Integrar frontend com API.
* Ajustar loading e erros.
* Corrigir interface com dados reais.

Integrante 2:

* Integrar upload real de evidências.
* Ajustar regras do Firebase.
* Apoiar autenticação na API.

Integrante 3:

* Finalizar endpoints.
* Criar eventos de auditoria.
* Preparar deploy no Render.

### Semana 4

Foco: finalizar, testar e apresentar.

Integrante 1:

* Polir visual.
* Revisar responsividade.
* Melhorar experiência do usuário.

Integrante 2:

* Testar login, logout e upload.
* Corrigir erros de autenticação.
* Validar segurança básica.

Integrante 3:

* Publicar frontend e API.
* Revisar README.
* Criar checklist de testes.
* Preparar apresentação final.

## 9. Checklist final do projeto

### Frontend

* Login funcionando.
* Dashboard funcionando.
* Sidebar funcionando.
* Rotas funcionando.
* Páginas responsivas.
* Formulários validados.
* Tabelas carregando dados.
* Gráficos aparecendo.
* Estados vazios criados.
* Estados de erro criados.
* Estados de loading criados.

### Firebase

* Authentication configurado.
* Login com e-mail e senha funcionando.
* Logout funcionando.
* Rotas protegidas.
* Cloud Firestore configurado para perfis, evidências e auditoria.
* Variáveis de ambiente configuradas.
* Nenhuma chave sensível exposta diretamente no código.

### Supabase Storage

* Bucket `evidencias` configurado.
* Upload de evidências funcionando.
* URLs de arquivos retornadas para demonstração.
* Configuração atual adequada para MVP e demonstração, mas não declarada como segura para produção.

### Banco e API

* Neon configurado.
* API conectando no banco.
* Endpoints principais funcionando.
* CORS configurado.
* `.env.example` criado.
* Health check funcionando.
* Rotas testadas.

### Deploy

* Frontend no Render.
* API no Render.
* Variáveis de ambiente no Render.
* React Router funcionando em produção.
* Build funcionando.
* README com instruções de deploy.

### Documentação

* README atualizado.
* Plano de trabalho documentado.
* Modelo do banco documentado.
* Checklist de testes criado.
* Instruções de instalação claras.
* Links do projeto adicionados.

## 10. Resultado esperado

Ao final do desenvolvimento, o projeto deve estar com aparência profissional e funcionando como um MVP real.

O sistema deve permitir:

* Login de usuário.
* Navegação entre páginas.
* Visualização de dashboard.
* Controle de projetos.
* Registro de horas.
* Envio de evidências.
* Aprovação ou reprovação de itens.
* Consulta de relatórios.
* Visualização da trilha de auditoria.
* Deploy online.
* Banco de dados configurado.
* Estrutura pronta para evolução futura.

O objetivo é que a Auditra pareça uma plataforma SaaS real, com organização técnica, visual profissional e funcionalidades suficientes para ser apresentada em banca, disciplina, cliente ou investidor.
