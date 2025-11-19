import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import "tabulator-tables/dist/css/tabulator.min.css";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

createApp(App).use(store).use(router).mount('#app')