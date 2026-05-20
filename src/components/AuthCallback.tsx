import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [message, setMessage] = useState('Procesando inicio de sesión...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash || '';
        if (hash.includes('access_token=')) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }

        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session || !session.user) {
          setMessage('No se obtuvo sesión desde el callback.');
          return;
        }

        const email = session.user.email;
        if (!email) {
          setMessage('El usuario no tiene correo electrónico asociado.');
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('email', email)
          .maybeSingle();

        if (roleError) {
          setMessage(`Error al leer rol: ${roleError.message}`);
          return;
        }

        const role = roleData?.role;
        if (role !== 'admin') {
          setMessage('El usuario no tiene el rol admin.');
          return;
        }

        window.history.replaceState(null, '', '/callback');
        window.location.replace('/');
      } catch (error: any) {
        setMessage(`Error inesperado: ${error?.message ?? String(error)}`);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-3xl border border-gray-800 p-10 text-center max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-white mb-4">Autenticando...</h1>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );
}
