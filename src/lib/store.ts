import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Drug } from "@/data/types";

export type Snap = {
  id: string;
  at: string;
  drugId: string;
  drugName: string;
  summary: string;
};

type PharmacyState = {
  hydrated: boolean;
  favorites: string[];
  custom: Drug[];
  recent: string[];
  snaps: Snap[];
  setHydrated: () => void;
  toggleFavorite: (id: string) => void;
  addCustom: (drug: Drug) => void;
  removeCustom: (id: string) => void;
  touchRecent: (id: string) => void;
  saveSnap: (snap: Snap) => void;
  removeSnap: (id: string) => void;
};

export const usePharmacy = create<PharmacyState>()(
  persist(
    (set) => ({
      hydrated: false,
      favorites: [],
      custom: [],
      recent: [],
      snaps: [],
      setHydrated: () => set({ hydrated: true }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [id, ...s.favorites],
        })),
      addCustom: (drug) => set((s) => ({ custom: [drug, ...s.custom.filter((d) => d.id !== drug.id)] })),
      removeCustom: (id) =>
        set((s) => ({
          custom: s.custom.filter((d) => d.id !== id),
          favorites: s.favorites.filter((x) => x !== id),
        })),
      touchRecent: (id) =>
        set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 8) })),
      saveSnap: (snap) => set((s) => ({ snaps: [snap, ...s.snaps].slice(0, 12) })),
      removeSnap: (id) => set((s) => ({ snaps: s.snaps.filter((x) => x.id !== id) })),
    }),
    {
      name: "smart-pharmacist",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
