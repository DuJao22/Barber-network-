import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';

interface TenantContextType {
  tenant: any;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true, error: null });

export const useTenant = () => useContext(TenantContext);

export function TenantProvider() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = window.location.pathname;

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`/api/tenant-info`, {
      headers: { 'x-tenant-slug': tenantSlug }
    })
      .then(res => {
        if (!res.ok) throw new Error('Tenant not found or suspended');
        return res.json();
      })
      .then(data => {
        setTenant(data);
        // Apply custom colors
        if (data.primary_color) {
          document.documentElement.style.setProperty('--color-primary', data.primary_color);
        }
        if (data.secondary_color) {
          document.documentElement.style.setProperty('--color-secondary', data.secondary_color);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [tenantSlug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Sistema Indisponível</h1>
        <p className="text-text-light mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-xl">
          Voltar ao Início
        </button>
      </div>
    );
  }

  const isSubscriptionActive = () => {
    if (!tenant) return true;
    if (tenant.subscription_status !== 'active') return false;
    if (!tenant.subscription_due_date) return true;
    const dueDate = new Date(tenant.subscription_due_date);
    return dueDate > new Date();
  };

  if (!isSubscriptionActive() && !location.includes('/admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <h1 className="text-3xl font-display mb-4 text-text-main">Sistema Temporariamente Indisponível</h1>
        <p className="text-text-light mb-8 max-w-md">
          A barbearia está com pendências no sistema. Por favor, tente novamente mais tarde ou entre em contato diretamente com o estabelecimento.
        </p>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      <Outlet />
    </TenantContext.Provider>
  );
}
