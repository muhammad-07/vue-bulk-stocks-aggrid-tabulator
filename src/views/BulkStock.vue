<template>
  <div style="padding:20px;">
    <h2>Bulk Add Stocks</h2>
    <div style="margin-bottom:10px;">
      <button @click="addRow">Add New Record</button>
      <button @click="saveAll">Save All</button>
      <button @click="back">Back to list</button>
    </div>
    <ag-grid-vue class="ag-theme-alpine" style="width:100%; height:500px;" :columnDefs="columnDefs" :rowData="rowData"
      :defaultColDef="defaultColDef" @grid-ready="onGridReady">
    </ag-grid-vue>
  </div>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import api from '@/services/api';
import router from '@/router';

export default {
  components: { AgGridVue },
  setup() {
    const gridApi = ref(null);
    const rowData = ref([]);
    const stores = ref([]);

    // --- Value Formatter Function ---
    // This function displays the 'name' in the grid cell
    const storeValueFormatter = (params) => {
      if (!params.value || stores.value.length === 0) return '';
      const store = stores.value.find(s => s.id == params.value);
      return store ? store.name : params.value;
    };


    const valueSetter = (params) => {
      const selected = stores.value.find(s => s.name === params.newValue);
      if (selected) {
        params.data.store_id = selected.id;
        return true;
      }
      return false;
    };

    const columnDefs = ref([
      { headerName: 'No#', valueGetter: params => params.node.rowIndex + 1, editable: false, width: 100 },
      { headerName: 'Item Code', field: 'item_code', editable: true },
      { headerName: 'Item Name', field: 'item_name', editable: true },
      { headerName: 'Quantity', field: 'quantity', editable: true },
      { headerName: 'Location', field: 'location', editable: true },
      {
        headerName: 'Store',
        field: 'store_id',
        editable: true,
        cellEditor: 'agSelectCellEditor',

        cellEditorParams: () => ({
          values: stores.value.map(s => s.name)
        }),
        valueFormatter: storeValueFormatter,
        valueSetter: valueSetter
      },
      { headerName: 'In-Stock Date', field: 'in_stock_date', editable: true }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1, singleClickEdit: true };

    const onGridReady = async (params) => {
      gridApi.value = params.api;
      const resp = await api.get('/stores');
      stores.value = resp.data;

    };

    const addRow = () => {
      
      rowData.value = [...rowData.value, { 
        item_code: 'ItemCode-',
        item_name: 'Item',
        quantity: 1,
        location: 'Surat',
        store_id: stores.value[0]?.id.toString() || null,
        in_stock_date: new Date().toISOString().slice(0, 10) 
      }];
    };

    const saveAll = async () => {
      if (!gridApi.value) return;
      gridApi.value.stopEditing();
      const all = [];
      gridApi.value.forEachNode(node => {
        all.push(node.data);
      });


      if (!all.length) return alert('No records');
      await api.post('/stocks/bulk', { records: all });
      alert('All Records saved successfully.');
      router.push('/stocks');
    };

    const back = () => router.push('/stocks');

    return { columnDefs, rowData, defaultColDef, onGridReady, addRow, saveAll, back };
  }
}
</script>

<style>
.ag-theme-alpine {
  height: 500px;
  width: 100%;
}
</style>
