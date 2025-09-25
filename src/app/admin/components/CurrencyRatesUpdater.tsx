"use client";
import React, { useState } from 'react';
import * as apiClient from '@/lib/api-client';
import { currencyData } from '@/lib/hostvoucher-data';

export const CurrencyRatesUpdater = ({ settings, showNotification }: any) => {
  const [updating, setUpdating] = useState(false);
  const lastUpdate = settings?.currency_rates?.lastUpdate || null;

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await fetch('https://api.exchangerate.host/latest?base=USD');
      const data = await res.json();
      if (!data || !data.rates) throw new Error('Failed to fetch rates');

      const wanted = new Set((currencyData || []).map((c: any) => c.code));
      const filtered: Record<string, number> = {};
      for (const [code, rate] of Object.entries(data.rates as Record<string, number>)) {
        if (wanted.has(code)) filtered[code] = Number(rate);
      }

      await apiClient.saveCurrencyRates({ rates: filtered, lastUpdate: new Date().toISOString() });
      showNotification('Currency rates updated.', 'success');
    } catch (e: any) {
      console.error(e);
      showNotification(e.message || 'Failed to update currency rates', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-300">Update exchange rates used across the site.</p>
        <p className="text-xs text-slate-500">Last update: {lastUpdate ? new Date(lastUpdate).toLocaleString() : 'Never'}</p>
      </div>
      <button onClick={handleUpdate} disabled={updating} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded disabled:opacity-60">
        {updating ? 'Updating…' : 'Update Currency Rates'}
      </button>
    </div>
  );
};

