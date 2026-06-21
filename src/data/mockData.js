export const COMPANY_IDS = {
  BIOAMAZONIA: 'bioamazonia-labs',
  NEOTEC: 'neotec-energia',
  UFNORTE: 'universidade-federal-do-norte',
  INOVADATA: 'inovadata-analytics',
  AGROTECH: 'agrotech-norte',
  QUANTUMHUB: 'quantumhub-instituto'
};

export const users = [
  {
    id: 'u1',
    name: 'Marina Azevedo',
    email: 'marina.azevedo@bioamazonia.com.br',
    profile: 'Administrador Empresa',
    company: 'BioAmazônia Labs',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    status: 'Ativo',
    lastAccess: '10/06/2026 09:18',
    avatar: 'MA'
  },
  {
    id: 'u2',
    name: 'Rafael Costa',
    email: 'rafael.costa@neotec.com.br',
    profile: 'Gestor de P&D',
    company: 'NeoTec Energia',
    companyId: COMPANY_IDS.NEOTEC,
    status: 'Ativo',
    lastAccess: '09/06/2026 17:45',
    avatar: 'RC'
  },
  {
    id: 'u3',
    name: 'Camila Barros',
    email: 'camila.barros@ufnorte.edu.br',
    profile: 'Pesquisador',
    company: 'Universidade Federal do Norte',
    companyId: COMPANY_IDS.UFNORTE,
    status: 'Ativo',
    lastAccess: '10/06/2026 08:02',
    avatar: 'CB'
  },
  {
    id: 'u4',
    name: 'João Mendes',
    email: 'joao.mendes@inovadata.com.br',
    profile: 'Financeiro/Compliance',
    company: 'InovaData Analytics',
    companyId: COMPANY_IDS.INOVADATA,
    status: 'Ativo',
    lastAccess: '08/06/2026 15:12',
    avatar: 'JM'
  },
  {
    id: 'u5',
    name: 'Patrícia Lima',
    email: 'patricia.lima@agrotech.com.br',
    profile: 'Gestor de P&D',
    company: 'AgroTech Norte',
    companyId: COMPANY_IDS.AGROTECH,
    status: 'Pendente',
    lastAccess: 'Nunca acessou',
    avatar: 'PL'
  },
  {
    id: 'u6',
    name: 'Lucas Pereira',
    email: 'lucas.pereira@quantumhub.org',
    profile: 'Pesquisador',
    company: 'QuantumHub Instituto',
    companyId: COMPANY_IDS.QUANTUMHUB,
    status: 'Inativo',
    lastAccess: '29/05/2026 11:30',
    avatar: 'LP'
  }
];

export const companies = [
  {
    id: COMPANY_IDS.BIOAMAZONIA,
    companyId: COMPANY_IDS.BIOAMAZONIA,
    name: 'BioAmazônia Labs',
    cnpj: '14.832.991/0001-45',
    segment: 'Biotecnologia',
    projectsCount: 4,
    status: 'Ativa',
    responsible: 'Marina Azevedo'
  },
  {
    id: COMPANY_IDS.NEOTEC,
    companyId: COMPANY_IDS.NEOTEC,
    name: 'NeoTec Energia',
    cnpj: '28.554.770/0001-18',
    segment: 'Energia e Sustentabilidade',
    projectsCount: 3,
    status: 'Ativa',
    responsible: 'Rafael Costa'
  },
  {
    id: COMPANY_IDS.UFNORTE,
    companyId: COMPANY_IDS.UFNORTE,
    name: 'Universidade Federal do Norte',
    cnpj: '05.112.430/0001-20',
    segment: 'Pesquisa Acadêmica',
    projectsCount: 5,
    status: 'Ativa',
    responsible: 'Camila Barros'
  },
  {
    id: COMPANY_IDS.INOVADATA,
    companyId: COMPANY_IDS.INOVADATA,
    name: 'InovaData Analytics',
    cnpj: '33.190.224/0001-71',
    segment: 'Inteligência Artificial',
    projectsCount: 2,
    status: 'Em revisão',
    responsible: 'João Mendes'
  },
  {
    id: COMPANY_IDS.AGROTECH,
    companyId: COMPANY_IDS.AGROTECH,
    name: 'AgroTech Norte',
    cnpj: '41.667.910/0001-03',
    segment: 'Agritech',
    projectsCount: 2,
    status: 'Ativa',
    responsible: 'Patrícia Lima'
  },
  {
    id: COMPANY_IDS.QUANTUMHUB,
    companyId: COMPANY_IDS.QUANTUMHUB,
    name: 'QuantumHub Instituto',
    cnpj: '19.402.811/0001-62',
    segment: 'Segurança e IoT',
    projectsCount: 1,
    status: 'Ativa',
    responsible: 'Lucas Pereira'
  }
];

export const projects = [
  {
    id: 'p1',
    name: 'Plataforma de rastreabilidade para bioinsumos',
    company: 'BioAmazônia Labs',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    responsible: 'Marina Azevedo',
    status: 'Ativo',
    period: 'Jan/2026 - Dez/2026',
    completion: 82,
    risk: 'Baixo',
    totalHours: 1240,
    evidenceCount: 38,
    approvalsDone: 31,
    linkedCosts: 428500,
    description: 'Desenvolvimento de uma plataforma para registrar, validar e auditar a produção de bioinsumos com rastreabilidade técnica.'
  },
  {
    id: 'p2',
    name: 'Modelo preditivo de consumo energético',
    company: 'NeoTec Energia',
    companyId: COMPANY_IDS.NEOTEC,
    responsible: 'Rafael Costa',
    status: 'Em revisão',
    period: 'Mar/2026 - Nov/2026',
    completion: 64,
    risk: 'Médio',
    totalHours: 860,
    evidenceCount: 24,
    approvalsDone: 18,
    linkedCosts: 297300,
    description: 'Pesquisa aplicada com modelos estatísticos e aprendizado de máquina para previsão de consumo energético em unidades industriais.'
  },
  {
    id: 'p3',
    name: 'Sensores IoT para monitoramento ambiental',
    company: 'Universidade Federal do Norte',
    companyId: COMPANY_IDS.UFNORTE,
    responsible: 'Camila Barros',
    status: 'Ativo',
    period: 'Fev/2026 - Fev/2027',
    completion: 71,
    risk: 'Baixo',
    totalHours: 1435,
    evidenceCount: 42,
    approvalsDone: 35,
    linkedCosts: 512900,
    description: 'Projeto de P&D para criação de sensores IoT de baixo consumo voltados ao monitoramento de variáveis ambientais.'
  },
  {
    id: 'p4',
    name: 'Motor de recomendação para análise documental',
    company: 'InovaData Analytics',
    companyId: COMPANY_IDS.INOVADATA,
    responsible: 'João Mendes',
    status: 'Pendente',
    period: 'Abr/2026 - Out/2026',
    completion: 39,
    risk: 'Alto',
    totalHours: 410,
    evidenceCount: 9,
    approvalsDone: 5,
    linkedCosts: 153700,
    description: 'Pesquisa e desenvolvimento de recursos inteligentes para classificação de documentos técnicos e fiscais.'
  },
  {
    id: 'p5',
    name: 'Sistema de irrigação inteligente para pequenos produtores',
    company: 'AgroTech Norte',
    companyId: COMPANY_IDS.AGROTECH,
    responsible: 'Patrícia Lima',
    status: 'Ativo',
    period: 'Mai/2026 - Abr/2027',
    completion: 58,
    risk: 'Médio',
    totalHours: 720,
    evidenceCount: 17,
    approvalsDone: 11,
    linkedCosts: 238400,
    description: 'Solução para automatizar irrigação com base em sensores, previsão climática e dados do solo.'
  },
  {
    id: 'p6',
    name: 'Framework de segurança pós-quântica para IoT',
    company: 'QuantumHub Instituto',
    companyId: COMPANY_IDS.QUANTUMHUB,
    responsible: 'Lucas Pereira',
    status: 'Finalizado',
    period: 'Ago/2025 - Mai/2026',
    completion: 96,
    risk: 'Baixo',
    totalHours: 1680,
    evidenceCount: 51,
    approvalsDone: 48,
    linkedCosts: 640000,
    description: 'Avaliação de algoritmos pós-quânticos em dispositivos IoT com restrições de memória, energia e processamento.'
  }
];

export const timeEntries = [
  {
    id: 'h1',
    projectId: 'p1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    date: '2026-06-09',
    hours: 6,
    activityType: 'Desenvolvimento',
    description: 'Implementação do fluxo de validação documental e revisão dos critérios de aprovação.',
    deliverable: 'Módulo de validação',
    observations: 'Necessário revisar regras com compliance.',
    user: 'Marina Azevedo',
    status: 'Aprovado'
  },
  {
    id: 'h2',
    projectId: 'p2',
    companyId: COMPANY_IDS.NEOTEC,
    project: 'Modelo preditivo de consumo energético',
    date: '2026-06-08',
    hours: 4.5,
    activityType: 'Testes',
    description: 'Validação dos dados históricos e comparação entre modelos de regressão.',
    deliverable: 'Matriz de testes',
    observations: 'Resultado parcial dentro do esperado.',
    user: 'Rafael Costa',
    status: 'Em análise'
  },
  {
    id: 'h3',
    projectId: 'p3',
    companyId: COMPANY_IDS.UFNORTE,
    project: 'Sensores IoT para monitoramento ambiental',
    date: '2026-06-07',
    hours: 5,
    activityType: 'Pesquisa',
    description: 'Levantamento bibliográfico sobre sensores de baixo consumo para campo.',
    deliverable: 'Revisão técnica',
    observations: 'Separar referências para relatório mensal.',
    user: 'Camila Barros',
    status: 'Pendente'
  },
  {
    id: 'h4',
    projectId: 'p4',
    companyId: COMPANY_IDS.INOVADATA,
    project: 'Motor de recomendação para análise documental',
    date: '2026-06-06',
    hours: 3,
    activityType: 'Documentação',
    description: 'Organização das hipóteses do motor de classificação documental.',
    deliverable: 'Documento de arquitetura',
    observations: 'Faltam evidências anexas.',
    user: 'João Mendes',
    status: 'Correção solicitada'
  },
  {
    id: 'h5',
    projectId: 'p5',
    companyId: COMPANY_IDS.AGROTECH,
    project: 'Sistema de irrigação inteligente para pequenos produtores',
    date: '2026-06-05',
    hours: 7,
    activityType: 'Validação',
    description: 'Teste de campo com sensores de umidade e ajuste do tempo de resposta.',
    deliverable: 'Relatório de campo',
    observations: 'Coletar fotos e medições finais.',
    user: 'Patrícia Lima',
    status: 'Aprovado'
  },
  {
    id: 'h6',
    projectId: 'p6',
    companyId: COMPANY_IDS.QUANTUMHUB,
    project: 'Framework de segurança pós-quântica para IoT',
    date: '2026-06-04',
    hours: 6.5,
    activityType: 'Revisão',
    description: 'Revisão final dos benchmarks de criptografia pós-quântica em dispositivos de baixa memória.',
    deliverable: 'Benchmark comparativo',
    observations: 'Resultados consolidados para relatório de encerramento.',
    user: 'Lucas Pereira',
    status: 'Aprovado'
  }
];

export const evidence = [
  {
    id: 'e1',
    projectId: 'p1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    type: 'Documento técnico',
    title: 'Arquitetura do módulo de rastreabilidade',
    description: 'Documento com regras de negócio, fluxos de aprovação e critérios de auditoria.',
    fileName: 'arquitetura-rastreabilidade.pdf',
    relatedActivity: 'Desenvolvimento',
    status: 'Aprovada',
    date: '08/06/2026',
    owner: 'Marina Azevedo'
  },
  {
    id: 'e2',
    projectId: 'p2',
    companyId: COMPANY_IDS.NEOTEC,
    project: 'Modelo preditivo de consumo energético',
    type: 'Planilha',
    title: 'Base consolidada de consumo',
    description: 'Dados tratados usados para treino e validação dos modelos.',
    fileName: 'base-consumo-junho.xlsx',
    relatedActivity: 'Testes',
    status: 'Em análise',
    date: '07/06/2026',
    owner: 'Rafael Costa'
  },
  {
    id: 'e3',
    projectId: 'p3',
    companyId: COMPANY_IDS.UFNORTE,
    project: 'Sensores IoT para monitoramento ambiental',
    type: 'Imagem',
    title: 'Protótipo instalado em campo',
    description: 'Registro visual do sensor instalado em área de teste.',
    fileName: 'prototipo-campo.jpg',
    relatedActivity: 'Validação',
    status: 'Enviada',
    date: '06/06/2026',
    owner: 'Camila Barros'
  },
  {
    id: 'e4',
    projectId: 'p4',
    companyId: COMPANY_IDS.INOVADATA,
    project: 'Motor de recomendação para análise documental',
    type: 'Código-fonte',
    title: 'Pipeline inicial de classificação',
    description: 'Primeira versão do pipeline de classificação textual.',
    fileName: 'pipeline-classificador.zip',
    relatedActivity: 'Desenvolvimento',
    status: 'Reprovada',
    date: '03/06/2026',
    owner: 'João Mendes'
  },
  {
    id: 'e5',
    projectId: 'p5',
    companyId: COMPANY_IDS.AGROTECH,
    project: 'Sistema de irrigação inteligente para pequenos produtores',
    type: 'Relatório',
    title: 'Validação de sensores de umidade',
    description: 'Relatório com resultados do teste de campo.',
    fileName: 'validacao-sensores.pdf',
    relatedActivity: 'Validação',
    status: 'Aprovada',
    date: '02/06/2026',
    owner: 'Patrícia Lima'
  },
  {
    id: 'e6',
    projectId: 'p6',
    companyId: COMPANY_IDS.QUANTUMHUB,
    project: 'Framework de segurança pós-quântica para IoT',
    type: 'Documento técnico',
    title: 'Resultados finais de benchmarks pós-quânticos',
    description: 'Relatório técnico com métricas de desempenho, consumo de memória e recomendações de implementação.',
    fileName: 'benchmarks-pos-quanticos.pdf',
    relatedActivity: 'Revisão',
    status: 'Aprovada',
    date: '31/05/2026',
    owner: 'Lucas Pereira'
  }
];

export const approvals = [
  {
    id: 'a1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    type: 'Horas',
    requester: 'Marina Azevedo',
    description: '6h em desenvolvimento do fluxo de validação documental.',
    status: 'Pendente',
    createdAt: '09/06/2026',
    priority: 'Média'
  },
  {
    id: 'a2',
    companyId: COMPANY_IDS.NEOTEC,
    project: 'Modelo preditivo de consumo energético',
    type: 'Evidência',
    requester: 'Rafael Costa',
    description: 'Planilha de dados consolidados para validação do modelo.',
    status: 'Pendente',
    createdAt: '08/06/2026',
    priority: 'Alta'
  },
  {
    id: 'a3',
    companyId: COMPANY_IDS.UFNORTE,
    project: 'Sensores IoT para monitoramento ambiental',
    type: 'Relatório',
    requester: 'Camila Barros',
    description: 'Relatório mensal de atividades técnicas.',
    status: 'Aprovado',
    createdAt: '05/06/2026',
    priority: 'Baixa'
  },
  {
    id: 'a4',
    companyId: COMPANY_IDS.INOVADATA,
    project: 'Motor de recomendação para análise documental',
    type: 'Evidência',
    requester: 'João Mendes',
    description: 'Pipeline inicial enviado sem documentação complementar.',
    status: 'Correção solicitada',
    createdAt: '04/06/2026',
    priority: 'Alta'
  },
  {
    id: 'a5',
    companyId: COMPANY_IDS.AGROTECH,
    project: 'Sistema de irrigação inteligente para pequenos produtores',
    type: 'Horas',
    requester: 'Patrícia Lima',
    description: 'Validação de horas de teste de campo.',
    status: 'Reprovado',
    createdAt: '02/06/2026',
    priority: 'Média'
  }
];

export const reports = [
  {
    id: 'r1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    period: 'Maio/2026',
    status: 'Pronto',
    generatedAt: '06/06/2026',
    responsible: 'Marina Azevedo'
  },
  {
    id: 'r2',
    companyId: COMPANY_IDS.NEOTEC,
    project: 'Modelo preditivo de consumo energético',
    period: 'Maio/2026',
    status: 'Aguardando revisão',
    generatedAt: '05/06/2026',
    responsible: 'Rafael Costa'
  },
  {
    id: 'r3',
    companyId: COMPANY_IDS.UFNORTE,
    project: 'Sensores IoT para monitoramento ambiental',
    period: 'Maio/2026',
    status: 'Aprovado',
    generatedAt: '03/06/2026',
    responsible: 'Camila Barros'
  },
  {
    id: 'r4',
    companyId: COMPANY_IDS.INOVADATA,
    project: 'Motor de recomendação para análise documental',
    period: 'Maio/2026',
    status: 'Em geração',
    generatedAt: 'Em processamento',
    responsible: 'João Mendes'
  },
  {
    id: 'r5',
    companyId: COMPANY_IDS.QUANTUMHUB,
    project: 'Framework de segurança pós-quântica para IoT',
    period: 'Maio/2026',
    status: 'Aprovado',
    generatedAt: '31/05/2026',
    responsible: 'Lucas Pereira'
  }
];

export const auditEvents = [
  {
    id: 'ev1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    datetime: '10/06/2026 09:12',
    user: 'Marina Azevedo',
    action: 'Usuário registrou horas',
    project: 'Plataforma de rastreabilidade para bioinsumos',
    type: 'Registro de horas',
    status: 'Registrado',
    details: '6h lançadas para atividade de desenvolvimento.'
  },
  {
    id: 'ev2',
    companyId: COMPANY_IDS.NEOTEC,
    datetime: '09/06/2026 16:40',
    user: 'Rafael Costa',
    action: 'Evidência enviada',
    project: 'Modelo preditivo de consumo energético',
    type: 'Evidência',
    status: 'Em análise',
    details: 'Planilha de base consolidada enviada para validação.'
  },
  {
    id: 'ev3',
    companyId: COMPANY_IDS.INOVADATA,
    datetime: '09/06/2026 11:05',
    user: 'João Mendes',
    action: 'Correção solicitada',
    project: 'Motor de recomendação para análise documental',
    type: 'Aprovação',
    status: 'Pendente',
    details: 'Solicitada documentação complementar do pipeline.'
  },
  {
    id: 'ev4',
    companyId: COMPANY_IDS.UFNORTE,
    datetime: '08/06/2026 14:22',
    user: 'Camila Barros',
    action: 'Evidência aprovada',
    project: 'Sensores IoT para monitoramento ambiental',
    type: 'Evidência',
    status: 'Aprovado',
    details: 'Relatório de campo validado pelo gestor.'
  },
  {
    id: 'ev5',
    companyId: COMPANY_IDS.AGROTECH,
    datetime: '07/06/2026 10:18',
    user: 'Patrícia Lima',
    action: 'Custo vinculado',
    project: 'Sistema de irrigação inteligente para pequenos produtores',
    type: 'Custos',
    status: 'Registrado',
    details: 'Compra de sensores vinculada ao projeto.'
  },
  {
    id: 'ev6',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    datetime: '06/06/2026 17:30',
    user: 'Marina Azevedo',
    action: 'Relatório gerado',
    project: 'Plataforma de rastreabilidade para bioinsumos',
    type: 'Relatório',
    status: 'Pronto',
    details: 'Relatório técnico de Maio/2026 gerado.'
  },
  {
    id: 'ev7',
    companyId: COMPANY_IDS.NEOTEC,
    datetime: '05/06/2026 15:45',
    user: 'Rafael Costa',
    action: 'Projeto alterado',
    project: 'Modelo preditivo de consumo energético',
    type: 'Projeto',
    status: 'Atualizado',
    details: 'Período de revisão atualizado no cadastro do projeto.'
  },
  {
    id: 'ev8',
    companyId: COMPANY_IDS.QUANTUMHUB,
    datetime: '04/06/2026 13:15',
    user: 'Lucas Pereira',
    action: 'Relatório final aprovado',
    project: 'Framework de segurança pós-quântica para IoT',
    type: 'Relatório',
    status: 'Aprovado',
    details: 'Encerramento técnico validado com evidências e custos conciliados.'
  }
];

export const costs = [
  {
    id: 'cost1',
    projectId: 'p1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    category: 'Equipe técnica',
    value: 210000,
    status: 'Validado'
  },
  {
    id: 'cost2',
    projectId: 'p1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    project: 'Plataforma de rastreabilidade para bioinsumos',
    category: 'Infraestrutura',
    value: 98500,
    status: 'Validado'
  },
  {
    id: 'cost3',
    projectId: 'p2',
    companyId: COMPANY_IDS.NEOTEC,
    project: 'Modelo preditivo de consumo energético',
    category: 'Consultoria técnica',
    value: 74000,
    status: 'Em revisão'
  },
  {
    id: 'cost4',
    projectId: 'p5',
    companyId: COMPANY_IDS.AGROTECH,
    project: 'Sistema de irrigação inteligente para pequenos produtores',
    category: 'Equipamentos',
    value: 62400,
    status: 'Pendente'
  },
  {
    id: 'cost5',
    projectId: 'p6',
    companyId: COMPANY_IDS.QUANTUMHUB,
    project: 'Framework de segurança pós-quântica para IoT',
    category: 'Infraestrutura de testes',
    value: 118400,
    status: 'Validado'
  }
];

export const dashboardMetrics = {
  activeProjects: 4,
  monthlyHours: 486,
  pendingEvidence: 13,
  openApprovals: 9,
  documentRisks: 3,
  readyReports: 7,
  documentCompleteness: 74,
  validationAverage: '2,8 dias'
};

export const weeklyHours = [
  { week: 'Sem 1', hours: 96 },
  { week: 'Sem 2', hours: 112 },
  { week: 'Sem 3', hours: 134 },
  { week: 'Sem 4', hours: 144 }
];

export const projectStatusChart = [
  { name: 'Ativo', value: 3 },
  { name: 'Em revisão', value: 1 },
  { name: 'Pendente', value: 1 },
  { name: 'Finalizado', value: 1 }
];

export const evidenceChart = [
  { month: 'Mar', enviadas: 18, pendentes: 6 },
  { month: 'Abr', enviadas: 24, pendentes: 8 },
  { month: 'Mai', enviadas: 31, pendentes: 11 },
  { month: 'Jun', enviadas: 22, pendentes: 13 }
];

export const validationTimeChart = [
  { label: 'Horas', days: 1.8 },
  { label: 'Evidências', days: 3.1 },
  { label: 'Relatórios', days: 4.4 },
  { label: 'Custos', days: 2.6 }
];

export const alerts = [
  {
    id: 'al1',
    companyId: COMPANY_IDS.INOVADATA,
    title: 'Projeto com baixa taxa de preenchimento de horas',
    description: 'Motor de recomendação para análise documental está com 42% de preenchimento no mês.',
    severity: 'warning'
  },
  {
    id: 'al2',
    companyId: COMPANY_IDS.NEOTEC,
    title: 'Evidência pendente há mais de 7 dias',
    description: 'Base consolidada de consumo ainda aguarda validação do gestor responsável.',
    severity: 'danger'
  },
  {
    id: 'al3',
    companyId: COMPANY_IDS.NEOTEC,
    title: 'Relatório aguardando aprovação',
    description: 'Relatório de Maio/2026 do projeto NeoTec Energia precisa de revisão final.',
    severity: 'warning'
  },
  {
    id: 'al4',
    companyId: COMPANY_IDS.INOVADATA,
    title: 'Projeto com risco documental alto',
    description: 'Faltam evidências mínimas no projeto de análise documental.',
    severity: 'danger'
  }
];

export const recentActivities = [
  {
    id: 'ra1',
    companyId: COMPANY_IDS.UFNORTE,
    title: 'Evidência técnica aprovada',
    description: 'Relatório de campo validado no projeto Sensores IoT.',
    time: 'há 32 min',
    type: 'success'
  },
  {
    id: 'ra2',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    title: 'Novo registro de horas',
    description: 'Marina Azevedo registrou 6h em desenvolvimento.',
    time: 'há 1h',
    type: 'info'
  },
  {
    id: 'ra3',
    companyId: COMPANY_IDS.INOVADATA,
    title: 'Correção solicitada',
    description: 'Pipeline de classificação precisa de documentação complementar.',
    time: 'ontem',
    type: 'warning'
  },
  {
    id: 'ra4',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    title: 'Relatório mensal gerado',
    description: 'Relatório de Maio/2026 disponível para revisão.',
    time: '2 dias atrás',
    type: 'success'
  }
];

export const projectPendingItems = [
  {
    id: 'pd1',
    projectId: 'p1',
    companyId: COMPANY_IDS.BIOAMAZONIA,
    title: 'Revisar evidência de arquitetura',
    owner: 'Compliance',
    dueDate: '12/06/2026',
    status: 'Em análise'
  },
  {
    id: 'pd2',
    projectId: 'p2',
    companyId: COMPANY_IDS.NEOTEC,
    title: 'Aprovar relatório de validação',
    owner: 'Gestor de P&D',
    dueDate: '14/06/2026',
    status: 'Pendente'
  },
  {
    id: 'pd3',
    projectId: 'p4',
    companyId: COMPANY_IDS.INOVADATA,
    title: 'Anexar documento técnico complementar',
    owner: 'Pesquisador',
    dueDate: '11/06/2026',
    status: 'Atrasado'
  }
];

export const dashboardCriticalProjects = projects
  .filter((project) => project.risk !== 'Baixo' || project.completion < 65)
  .map((project) => ({
    id: project.id,
    name: project.name,
    company: project.company,
    companyId: project.companyId,
    completion: project.completion,
    risk: project.risk,
    status: project.status
  }));