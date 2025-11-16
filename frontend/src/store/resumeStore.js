import {create} from "zustand";
export const useResumeStore = create((set) => ({
  completedSections: [],

  addCompletedSection: (section) =>
    set((state) => {
      const updated = state.completedSections.filter(
        (s) => s.id !== section.id
      );
      return { completedSections: [...updated, section] };
    }),

  updateCompletedSection: (id, updatedData) =>
    set((state) => ({
      completedSections: state.completedSections.map((s) =>
        s.id === id ? { ...s, ...updatedData } : s
      ),
    })),

  removeCompletedSection: (id) =>
    set((state) => ({
      completedSections: state.completedSections.filter((s) => s.id !== id),
    })),

  activeSectionId: null,

  setActiveSection: (id) => set({ activeSectionId: id }),
}));
