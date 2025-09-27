import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice } from '@/types/invoice';

type State = {
  invoices: Invoice[];
};
type Actions = {
  addInvoices: (rows: Invoice[]) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  removeInvoice: (id: string) => void;
  resetDemo: () => void;
};

export const useInvoiceStore = create<State & Actions>()(
  persist(
    (set) => ({
      invoices: [],
      addInvoices: (rows) => set((s) => ({ invoices: [...rows, ...s.invoices] })),
      updateInvoice: (id, patch) =>
        set((s) => ({
          invoices: s.invoices.map((inv) => (inv.id === id ? { ...inv, ...patch, updatedAt: new Date().toISOString() } : inv)),
        })),
      removeInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((x) => x.id !== id) })),
      resetDemo: () => set({ invoices: [] }),
    }),
    { name: 'billscan-invoices' }
  )
);
