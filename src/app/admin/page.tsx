import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to the overview page which is the main dashboard
  redirect('/admin/overview');
}