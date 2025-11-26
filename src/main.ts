import { createApp } from "vue";
import { createPinia } from "pinia"; // ← Importar Pinia
import router from "./router"; // ← Importar router
import App from "./App.vue";
import { initializeApi } from "@/components/services/Axios";

import PrimeVue from 'primevue/config';

import "primeicons/primeicons.css";
import Aura from '@primeuix/themes/aura';

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Tooltip from "primevue/tooltip";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Badge from "primevue/badge";
import OverlayBadge from "primevue/overlaybadge";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/Tag";
import ToggleSwitch from "primevue/toggleswitch";
import ProgressBar from "primevue/progressbar";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Password from "primevue/password";
import Sidebar from "primevue/sidebar";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import MultiSelect from "primevue/multiselect";
import Chip from "primevue/chip";
import Chart from "primevue/chart";
import ConfirmDialog from "primevue/confirmdialog";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import InputNumber from "primevue/inputnumber"; // <- AÑADIR ESTA IMPORTACIÓN
import Editor from "primevue/editor";
import Calendar from "primevue/calendar";
import AutoComplete from "primevue/autocomplete";
import FileUpload from "primevue/fileupload";

// Crear la instancia de la app
const app = createApp(App);
const pinia = createPinia();

// PERSONALIZADO
import "@/assets/css/main.css";
import "@/assets/css/font.css";
import "primeicons/primeicons.css";
import "bootstrap-icons/font/bootstrap-icons.css";

initializeApi(router);

// LOCALE EN ESPAÑOL MANUAL
const esLocale = {
  startsWith: "Comienza con",
  contains: "Contiene",
  notContains: "No contiene",
  endsWith: "Termina con",
  equals: "Igual a",
  notEquals: "No igual a",
  noFilter: "Sin filtro",
  lt: "Menor que",
  lte: "Menor o igual que",
  gt: "Mayor que",
  gte: "Mayor o igual que",
  dateIs: "La fecha es",
  dateIsNot: "La fecha no es",
  dateBefore: "La fecha es anterior",
  dateAfter: "La fecha es posterior",
  clear: "Limpiar",
  apply: "Aplicar",
  matchAll: "Coincidir con todos",
  matchAny: "Coincidir con cualquier",
  addRule: "Agregar regla",
  removeRule: "Eliminar regla",
  accept: "Sí",
  reject: "No",
  choose: "Elegir",
  upload: "Subir",
  cancel: "Cancelar",
  completed: "Completado",
  pending: "Pendiente",
  fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  today: "Hoy",
  weekHeader: "Sem",
  firstDayOfWeek: 1,
  dateFormat: "dd/mm/yy",
  weak: "Débil",
  medium: "Medio",
  strong: "Fuerte",
  passwordPrompt: "Ingrese una contraseña",
  emptyFilterMessage: "No se encontraron resultados",
  emptyMessage: "No hay opciones disponibles",
};
// Configure and use PrimeVue with Spanish locale
// ✅ CONFIGURA EL TEMA AURA DIRECTAMENTE:
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "false",
      cssLayer: false,
    },
  },
  locale: esLocale,
});
// Usar los plugins
app.use(pinia); //
app.use(router); //
app.use(ToastService); // ✅ AÑADE ESTO
app.use(ConfirmationService); // ✅ AÑADE ESTO

app.component("FloatLabel", FloatLabel);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber); // <- REGISTRAR InputNumber
app.directive("tooltip", Tooltip);
app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("Badge", Badge);
app.component("OverlayBadge", OverlayBadge);
app.component("Message", Message);
app.component("ProgressSpinner", ProgressSpinner);
app.component("ProgressBar", ProgressBar);
app.component("Toast", Toast);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Dropdown", Dropdown);
app.component("Tag", Tag);
app.component("ToggleSwitch", ToggleSwitch);
app.component("Card", Card);
app.component("Divider", Divider);
app.component("Password", Password);
app.component("Sidebar", Sidebar);
app.component("Textarea", Textarea);
app.component("Select", Select);
app.component("DatePicker", DatePicker);
app.component("Tabs", Tabs);
app.component("TabList", TabList);
app.component("Tab", Tab);
app.component("TabPanels", TabPanels);
app.component("TabPanel", TabPanel);
app.component("MultiSelect", MultiSelect);
app.component("Chip", Chip);
app.component("Chart", Chart);
app.component("ConfirmDialog", ConfirmDialog);
app.component("RadioButton", RadioButton);
app.component("RadioButtonGroup", RadioButtonGroup);
app.component("Editor", Editor);
app.component("Calendar", Calendar);
app.component("AutoComplete", AutoComplete);
app.component("FileUpload", FileUpload);

// Montar la apppero
app.mount("#app");
