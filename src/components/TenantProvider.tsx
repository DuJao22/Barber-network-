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
    
    // If they have an active subscription with a future due date
    if (tenant.subscription_due_date) {
      const dueDate = new Date(tenant.subscription_due_date);
      if (dueDate > new Date()) return true;
      return false;
    }

    // No due date yet (new tenant) - Allow 3 minutes trial
    const createdAt = new Date(tenant.created_at);
    const trialEnd = new Date(createdAt.getTime() + 3 * 60 * 1000);
    return new Date() < trialEnd;
  };

  if (!isSubscriptionActive() && !location.includes('/admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <h1 className="text-3xl font-display mb-4 text-text-main">Sistema Temporariamente Indisponível</h1>
        <p className="text-text-light mb-8 max-w-md">
          Esta barbearia está com pendências de manutenção no sistema. Por favor, tente novamente mais tarde ou entre em contato diretamente com o estabelecimento.
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
