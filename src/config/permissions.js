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
    'settings:view',

    'support:view',
    'support:create',
    'support:reply',
    'support:manage'
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
    'settings:view',

    'support:view',
    'support:create'
  ],

  [ROLES.R_AND_D_MANAGER]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view',
    'approvals:view',
    'reports:view',

    'support:view',
    'support:create'
  ],

  [ROLES.RESEARCHER]: [
    'dashboard:view',
    'projects:view',
    'projects:detail',
    'time:view',
    'evidence:view',

    'support:view',
    'support:create'
  ],

  [ROLES.FINANCE_COMPLIANCE]: [
    'dashboard:view',
    'approvals:view',
    'reports:view',
    'audit:view',

    'support:view',
    'support:create'
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

export function canReplySupport(userProfile) {
  return hasPermission(userProfile?.role, 'support:reply');
}

export function canManageSupport(userProfile) {
  return hasPermission(userProfile?.role, 'support:manage');
}