<template>
  <div style="padding:20px;">
    <h2>Stocks</h2>
    <div style="margin-bottom:10px;">
      <input v-model="q" placeholder="Search..." @keyup.enter="reload" />
      <button @click="reload">Search</button>
      <button @click="goBulk">Bulk Add</button>
      
    </div>
    <div id="stock-table"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import api from '../services/api';
import router from '../router';

export default {
  setup() {
    const q = ref('');
    let table = null;

    const ajaxRequestFunc = async (url, config, params) => {
      const page = params.page || 1;
      const size = params.size || 25;
      let sortField = null;
      let sortDir = null;
      if (params.sort && params.sort.length) {
        sortField = params.sort[0].field;
        sortDir = params.sort[0].dir;
      }
      const resp = await api.get('/stocks', { params: { page, size, sortField, sortDir, search: q.value } });

      return resp.data.data;
    };

    onMounted(() => {
      table = new Tabulator('#stock-table', {
        ajaxRequestFunc: function (url, config, params) { return ajaxRequestFunc(url, config, params); },
        ajaxURL: '/api/stocks',
        pagination: 'remote',
        paginationSize: 5,
        layout: 'fitColumns',
        columns: [
          { title: 'Stock No', field: 'id', width: 80 },
          { title: 'Item Code', field: 'item_code' },
          { title: 'Item Name', field: 'item_name' },
          { title: 'Qty', field: 'quantity', width: 80 },
          { title: 'Store', field: 'store.name' },
          {
            title: 'In-Stock Date',
            field: 'in_stock_date',
            formatter: function (cell, formatterParams, onRendered) {
              return new Date(cell.getValue()).toLocaleDateString('en-GB');
            }
          },
          { title: 'Status', field: 'status' },
          {
            title: 'Actions', hozAlign: 'center', formatter: function (cell, formatterParams, onRendered) {
              return '<button class="row-delete">Delete</button>';
            }, cellClick: async function (e, cell) {
              const id = cell.getRow().getData().id;
              if (!confirm('Delete record?')) return;
              await api.delete('/stocks/' + id);
              cell.getRow().delete();
            }, width: 120
          }
        ],
      });
      table.on("tableBuilt", function () {
        table.setData();
      });
    });

    const reload = () => {
      if (table) {
        table.setPage(1);
        table.setData();
      }
    };

    const goBulk = () => router.push('/bulk');

    return { q, reload, goBulk };
  }
}
</script>

<style>
#stock-table {
  margin-top: 10px;
}
</style>
