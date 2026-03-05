import { defineStore } from 'pinia';

export type FloorTable = {
  id: string;
  name: string;
  x: number;
  y: number;
  chairs: number;
  charge: number;
};

const STORAGE_KEY = 'pos-table-layout-v1';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildDefaultTables = (): FloorTable[] => {
  const tables: FloorTable[] = [];
  const columns = 5;

  for (let index = 0; index < 10; index += 1) {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const x = 12 + col * 19;
    const y = row === 0 ? 28 : 68;

    tables.push({
      id: `table-${index + 1}`,
      name: `Table ${index + 1}`,
      x,
      y,
      chairs: 4,
      charge: 0,
    });
  }

  return tables;
};

export const useTableLayoutStore = defineStore('tableLayout', {
  state: () => ({
    tables: [] as FloorTable[],
    initialized: false,
    selectedTableId: null as string | null,
  }),

  getters: {
    selectedTable: (state) => state.tables.find((table) => table.id === state.selectedTableId) ?? null,
  },

  actions: {
    initializeTables() {
      if (this.initialized) return;

      if (typeof window === 'undefined') {
        this.tables = [];
        this.initialized = true;
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as FloorTable[];
          if (Array.isArray(parsed)) {
            this.tables = parsed.map((table) => ({
              ...table,
              chairs: clamp(Number(table.chairs) || 4, 1, 8),
              charge: Math.max(0, Number(table.charge) || 0),
              x: clamp(Number(table.x) || 50, 8, 92),
              y: clamp(Number(table.y) || 50, 14, 90),
            }));
            this.initialized = true;
            return;
          }
        } catch {
          // fall back to empty
        }
      }

      this.tables = [];
      this.persistTables();
      this.initialized = true;
    },

    persistTables() {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tables));
    },

    addTable() {
      const maxNumber = this.tables.reduce((max, table) => {
        const match = table.name.match(/\d+/);
        const number = match ? Number(match[0]) : 0;
        return Math.max(max, number);
      }, 0);

      const newTable: FloorTable = {
        id: `table-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `Table ${maxNumber + 1}`,
        x: 50,
        y: 52,
        chairs: 4,
        charge: 0,
      };

      this.tables.push(newTable);
      this.persistTables();
      return newTable;
    },

    setTablePosition(tableId: string, x: number, y: number) {
      const table = this.tables.find((entry) => entry.id === tableId);
      if (!table) return;

      table.x = clamp(x, 8, 92);
      table.y = clamp(y, 14, 90);
      // Force reactivity by reassigning the array
      this.tables = [...this.tables];
      this.persistTables();
    },

    setTableChairs(tableId: string, chairs: number) {
      const table = this.tables.find((entry) => entry.id === tableId);
      if (!table) return;

      table.chairs = clamp(chairs, 1, 8);
      // Force reactivity by reassigning the array
      this.tables = [...this.tables];
      this.persistTables();
    },

    setTableCharge(tableId: string, charge: number) {
      const table = this.tables.find((entry) => entry.id === tableId);
      if (!table) return;

      table.charge = Math.max(0, Number(charge) || 0);
      // Force reactivity by reassigning the array
      this.tables = [...this.tables];
      this.persistTables();
    },

    removeTable(tableId: string) {
      this.tables = this.tables.filter((entry) => entry.id !== tableId);
      this.persistTables();
    },

    setTableName(tableId: string, name: string) {
      const table = this.tables.find((entry) => entry.id === tableId);
      if (!table) return;

      table.name = name.trim();
      this.tables = [...this.tables];
      this.persistTables();
    },

    setSelectedTableId(tableId: string | null) {
      this.selectedTableId = tableId;
    },

    clearSelection() {
      this.selectedTableId = null;
    },
  },
});
