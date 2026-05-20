import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [message, setMessage] = useState('Procesando inicio de sesión...');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      return session;
    };

    const handleCallback = async () => {
      try {
        const hash = window.location.hash || '';
        if (hash.includes('access_token=')) {
          setMessage('Procesando la respuesta de Google...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        let session = await getSession();

        if ((!session || !session.user) && hash.includes('access_token=')) {
          setMessage('Esperando al procesamiento del token...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          session = await getSession();
        }

        if (!session || !session.user) {
          setMessage('No se obtuvo sesión desde el callback. Revisa el redirect URI y el estado de OAuth.');
          setFailed(true);
          return;
        }

        const email = session.user.email;
        if (!email) {
          setMessage('El usuario no tiene correo electrónico asociado.');
          setFailed(true);
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('email', email)
          .maybeSingle();

        if (roleError) {
          setMessage(`Error al leer rol: ${roleError.message}`);
          setFailed(true);
          return;
        }

        const role = roleData?.role;
        if (role !== 'admin') {
          setMessage('El usuario no tiene el rol admin.');
          setFailed(true);
          return;
        }

        window.history.replaceState(null, '', '/callback');
        window.location.replace('/');
      } catch (error: any) {
        setMessage(`Error inesperado: ${error?.message ?? String(error)}`);
        setFailed(true);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-3xl border border-gray-800 p-10 text-center max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-white mb-4">Autenticando...</h1>
        <p className="text-gray-300 mb-6">{message}</p>
        {failed && (
          <div className="flex flex-col gap-3">
            <a
              href="/"
              className="inline-flex justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Volver al login
            </a>
            <a
              href="/"
              className="inline-flex justify-center rounded-2xl border border-gray-700 bg-transparent px-4 py-3 text-sm font-semibold text-gray-100 hover:bg-gray-800"
            >
              Intentar de nuevo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
