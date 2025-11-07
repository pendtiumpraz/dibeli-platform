import { UserTier } from '@prisma/client'

export type Permission = 
  | 'create_store'
  | 'add_products'
  | 'unlimited_products'
  | 'choose_templates'
  | 'all_templates'
  | 'color_customization'
  | 'remove_branding'
  | 'custom_domain'
  | 'product_variants'
  | 'advanced_analytics'
  | 'upload_templates'
  | 'activate_users'
  | 'manage_templates'

const PERMISSIONS: Record<UserTier, Permission[]> = {
  TRIAL: [
    'create_store',
    'add_products', // max 3
    'choose_templates', // max 1
  ],
  FREE: [
    'create_store',
    'add_products', // max 3
    'choose_templates', // max 1
  ],
  PREMIUM: [
    'create_store',
    'add_products',
    'unlimited_products',
    'choose_templates',
    'all_templates',
    'color_customization',
    'remove_branding',
    'product_variants',
    'advanced_analytics',
  ],
  UNLIMITED: [
    'create_store',
    'add_products',
    'unlimited_products',
    'choose_templates',
    'all_templates',
    'color_customization',
    'remove_branding',
    'custom_domain',
    'product_variants',
    'advanced_analytics',
  ],
}

const SUPERADMIN_PERMISSIONS: Permission[] = [
  ...PERMISSIONS.UNLIMITED,
  'upload_templates',
  'activate_users',
  'manage_templates',
]

export function checkPermission(
  userTier: UserTier,
  permission: Permission,
  isSuperAdmin: boolean = false
): boolean {
  if (isSuperAdmin) {
    return SUPERADMIN_PERMISSIONS.includes(permission)
  }
  
  return PERMISSIONS[userTier]?.includes(permission) ?? false
}

export function getMaxProducts(userTier: UserTier): number | null {
  if (userTier === 'TRIAL' || userTier === 'FREE') {
    return 3
  }
  return null // unlimited
}

export function canAccessPremiumFeature(userTier: UserTier): boolean {
  return ['PREMIUM', 'UNLIMITED'].includes(userTier)
}
