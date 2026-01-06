
export const ROLE_HIERARCHY = {
    superadmin: 4,
    admin: 3,
    social_admin: 2.5,
    host: 2,
    coach: 1,
    member: 0
};

export type UserRole = keyof typeof ROLE_HIERARCHY;

export function getHighestRole(roles: string[]): string {
    if (!roles || roles.length === 0) return 'member';

    return roles.reduce((prev, current) => {
        const prevPriority = ROLE_HIERARCHY[prev as UserRole] || 0;
        const currPriority = ROLE_HIERARCHY[current as UserRole] || 0;
        return currPriority > prevPriority ? current : prev;
    });
}

export function getRedirectUrl(role: string): string {
    switch (role) {
        case 'superadmin': return '/superadmin/dashboard';
        case 'admin': return '/admin/dashboard';
        case 'social_admin': return '/social-admin/dashboard';
        case 'host': return '/host/dashboard';
        case 'coach': return '/coach/dashboard'; // Asumsi ada dashboard coach
        default: return '/member/dashboard';
    }
}
