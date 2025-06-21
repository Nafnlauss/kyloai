// List of email addresses that should automatically have admin privileges
export const ADMIN_EMAILS = [
  'leonardovyguimaraes@proton.me',
  'leonardo@kylo.video' // backup admin email
];

// Check if an email should have admin privileges
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}