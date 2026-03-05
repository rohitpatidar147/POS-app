<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="hookShowTablePicker && orderType === 'dine-in'"
        type="button"
        class="fixed inset-0 z-40 bg-black/35"
        @click="closeTablePicker"
        aria-label="Close table picker"
      ></button>
    </transition>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <section
        v-if="hookShowTablePicker && orderType === 'dine-in'"
        class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[98vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold text-slate-800">Table Layout</h4>
          <div class="flex items-center gap-2">
            <button
              v-if="isAdmin"
              type="button"
              @click="toggleEditMode"
              class="px-3 py-1.5 text-xs font-bold rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            >
              {{ isEditMode ? 'Done' : 'Edit Layout' }}
            </button>
            <button
              type="button"
              @click="closeTablePicker"
              class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <p class="text-sm text-slate-500 mb-4">
          {{ isEditMode ? 'Drag tables to change layout. Select a table to edit chairs and charge.' : 'Tap a table to select it for this order.' }}
        </p>

        <div v-if="isAdmin && isEditMode" class="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="addTable"
            class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Add Table
          </button>
          <button
            type="button"
            @click="removeEditingTable"
            class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
            :disabled="!selectedTableId"
          >
            Delete Table
          </button>
        </div>

        <div v-if="isAdmin && isEditMode && selectedTable" class="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label class="text-xs text-slate-500 font-semibold block mb-2">Table Name/Number</label>
          <div class="flex items-center gap-2">
            <input
              v-model="editingTableName"
              type="text"
              class="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              @click="saveTableName"
              class="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="editingTableName === (selectedTable as any)?.name || tableNameError !== ''"
            >
              ✓
            </button>
          </div>
          <p v-if="tableNameError" class="mt-2 text-xs text-red-600 font-medium">{{ tableNameError }}</p>
        </div>

        <div
          ref="layoutBoardRef"
          class="relative h-[420px] sm:h-[520px] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden"
        >
          <button
            v-for="tableConfig in tables"
            :key="tableConfig.id"
            type="button"
            class="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 transition"
            :class="[
              selectedTableId === tableConfig.id ? 'z-20' : 'z-10',
              isAdmin && isEditMode ? 'cursor-move' : 'cursor-pointer'
            ]"
            :style="{ left: `${tableConfig.x}%`, top: `${tableConfig.y}%` }"
            @click.stop="handleTableClick(tableConfig)"
            @pointerdown="onTablePointerDown(tableConfig.id, $event)"
          >
            <span
              class="absolute inset-[26px] rounded-lg border-2 flex items-center justify-center text-sm font-semibold"
              :class="selectedTableId === tableConfig.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-400 bg-white text-slate-600'"
            >
              {{ extractTableNumber(tableConfig.name) }}
            </span>
          </button>
        </div>
      </section>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useTableLayout } from './TableLayout.js';
import { useTableLayoutStore } from '../../stores/tableLayoutStore';

interface Props {
  orderType: string;
  showTablePicker: boolean;
}

const props = defineProps<Props>();
defineEmits(['close']);

const tableLayoutStore = useTableLayoutStore();

const {
  selectedTableId,
  showTablePicker: hookShowTablePicker,
  isEditMode,
  editingTableName,
  isAdmin,
  layoutBoardRef,
  tables,
  selectedTable,
  tableNameError,
  extractTableNumber,
  closeTablePicker,
  toggleEditMode,
  handleTableClick,
  addTable,
  removeEditingTable,
  onTablePointerDown,
  stopDragging,
  saveTableName
} = useTableLayout();

// Sync the parent's showTablePicker prop with the hook's showTablePicker ref
watch(() => props.showTablePicker, (newVal) => {
  hookShowTablePicker.value = newVal;
});

// Ensure layoutBoardRef is available for template ref binding
void layoutBoardRef;

onMounted(() => {
  tableLayoutStore.initializeTables();

  const stored = localStorage.getItem('currentUser');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      isAdmin.value = user.role === 'admin';
    } catch {
      isAdmin.value = false;
    }
  }
});

onUnmounted(() => {
  stopDragging();
});
</script>
