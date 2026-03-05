import { computed, ref, watch } from 'vue';
import { useTableLayoutStore } from '../../stores/tableLayoutStore';

export function useTableLayout() {
  const tableLayoutStore = useTableLayoutStore();

  const showTablePicker = ref(false);
  const isEditMode = ref(false);
  const draggingTableId = ref(null);
  const editingTableName = ref('');
  const isAdmin = ref(false);
  const layoutBoardRef = ref(null);
  const tableNameError = ref('');

  const tables = computed(() => tableLayoutStore.tables);
  const selectedTableId = computed(() => tableLayoutStore.selectedTableId);
  const selectedTable = computed(() => tableLayoutStore.selectedTable);
  const selectedTableLabel = computed(() => selectedTable.value?.name ?? '');
  const tableCharge = computed(() => selectedTable.value?.charge ?? 0);

  function extractTableNumber(name) {
    const match = name.match(/\d+/);
    return match ? match[0] : name;
  }

  function toggleTablePicker(orderType) {
    if (orderType !== 'dine-in') return;
    showTablePicker.value = !showTablePicker.value;
  }

  function closeTablePicker() {
    showTablePicker.value = false;
    isEditMode.value = false;
    stopDragging();
  }

  function toggleEditMode() {
    if (!isAdmin.value) return;

    isEditMode.value = !isEditMode.value;
    if (!isEditMode.value) {
      stopDragging();
      return;
    }

    if (!selectedTableId.value) {
      const firstTable = tables.value[0];
      if (firstTable) {
        tableLayoutStore.setSelectedTableId(firstTable.id);
      }
    }
  }

  function handleTableClick(tableConfig) {
    if (isAdmin.value && isEditMode.value) {
      tableLayoutStore.setSelectedTableId(tableConfig.id);
      return;
    }

    tableLayoutStore.setSelectedTableId(tableConfig.id);
    closeTablePicker();
  }

  function addTable() {
    if (!isAdmin.value || !isEditMode.value) return;
    const newTable = tableLayoutStore.addTable();
    tableLayoutStore.setSelectedTableId(newTable.id);
  }

  function removeEditingTable() {
    if (!selectedTableId.value) return;
    const removedId = selectedTableId.value;
    tableLayoutStore.removeTable(removedId);
    tableLayoutStore.setSelectedTableId(null);
  }

  function onTablePointerDown(tableId, event) {
    if (!isAdmin.value || !isEditMode.value) return;
    if (event.button !== 0) return;

    event.preventDefault();
    draggingTableId.value = tableId;
    moveDraggingTable(event);

    window.addEventListener('pointermove', moveDraggingTable);
    window.addEventListener('pointerup', stopDragging);
  }

  function moveDraggingTable(event) {
    if (!draggingTableId.value || !layoutBoardRef.value) return;

    const rect = layoutBoardRef.value.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    tableLayoutStore.setTablePosition(draggingTableId.value, x, y);
  }

  function stopDragging() {
    draggingTableId.value = null;
    window.removeEventListener('pointermove', moveDraggingTable);
    window.removeEventListener('pointerup', stopDragging);
  }

  function saveTableName() {
    if (!selectedTable.value || !editingTableName.value.trim()) return;
    
    // Check if table name already exists (excluding current table)
    const nameExists = tables.value.some(
      table => table.name === editingTableName.value && table.id !== selectedTable.value.id
    );
    
    if (nameExists) {
      tableNameError.value = `Table ${editingTableName.value} already exists`;
      return;
    }
    
    tableNameError.value = '';
    tableLayoutStore.setTableName(selectedTable.value.id, editingTableName.value);
  }

  watch(selectedTable, (table) => {
    if (table) {
      editingTableName.value = table.name;
      tableNameError.value = '';
    }
  }, { deep: true });

  watch(editingTableName, () => {
    tableNameError.value = '';
  });

  return {
    selectedTableId,
    showTablePicker,
    isEditMode,
    draggingTableId,
    editingTableName,
    isAdmin,
    layoutBoardRef,
    tables,
    selectedTable,
    selectedTableLabel,
    tableCharge,
    tableNameError,
    extractTableNumber,
    toggleTablePicker,
    closeTablePicker,
    toggleEditMode,
    handleTableClick,
    addTable,
    removeEditingTable,
    onTablePointerDown,
    stopDragging,
    saveTableName
  };
}
