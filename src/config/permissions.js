export const ROLES = {
  AUDITRA_ADMIN: 'Administrador Auditra',
  COMPANY_ADMIN: 'Administrador Empresa',
  R_AND_D_MANAGER: 'Gestor de P&D',
  RESEARCHER: 'Pesquisador',
  FINANCE_COMPLIANCE: 'Financeiro/Compliance'
};

export const ROLE_PERMISSIONS = {
  [ROLES.AUDITRA_ADMIN]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view',
    'approvals:view',
    'reports:view',
    'audit:view',
    'companies:view',
    'users:view',
    'settings:view'
  ],

  [ROLES.COMPANY_ADMIN]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view',
    'approvals:view',
    'reports:view',
    'audit:view',
    'users:view',
    'settings:view'
  ],

  [ROLES.R_AND_D_MANAGER]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view',
    'approvals:view',
    'reports:view'
  ],

  [ROLES.RESEARCHER]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view'
  ],

  [ROLES.FINANCE_COMPLIANCE]: [
    'dashboard:view',
    'approvals:view',
    'reports:view',
    'audit:view'
  ]
};

export function hasPermission(role, permission) {
  if (!permission) return true;
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role] || [];

  return permissions.includes(permission);
}

export function isAuditraAdmin(userProfile) {
  return userProfile?.role === ROLES.AUDITRA_ADMIN;
}