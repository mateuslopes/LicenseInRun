import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import RunManagerPlugin from './plugins/global-run-manager';
import GlobalHelpersPlugin from './plugins/helpers-plugin';
import GlobalFiltersPlugin from './plugins/global-filters';
import PrimeVue from 'primevue/config';

//
import Avatar from 'primevue/avatar';
// import AutoComplete from 'primevue/autocomplete';
// import Accordion from 'primevue/accordion';
// import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
// import Breadcrumb from 'primevue/breadcrumb';
// import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
// import Carousel from 'primevue/carousel';
// import Chart from 'primevue/chart';
// import Checkbox from 'primevue/checkbox';
// import ConfirmPopup from 'primevue/confirmpopup';
// import Chips from 'primevue/chips';
// import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import ConfirmationService from 'primevue/confirmationservice';
// import ContextMenu from 'primevue/contextmenu';
import DataTable from 'primevue/datatable';
// import DataView from 'primevue/dataview';
// import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Fieldset from 'primevue/fieldset';
// import FileUpload from 'primevue/fileupload';
// import FullCalendar from 'primevue/fullcalendar';
// import InlineMessage from 'primevue/inlinemessage';
// import Inplace from 'primevue/inplace';
// import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
// import Galleria from 'primevue/galleria';
// import Listbox from 'primevue/listbox';
// import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
// import Message from 'primevue/message';
// import MultiSelect from 'primevue/multiselect';
// import OrderList from 'primevue/orderlist';
// import OrganizationChart from 'primevue/organizationchart';
// import OverlayPanel from 'primevue/overlaypanel';
// import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
// import PanelMenu from 'primevue/panelmenu';
// import Password from 'primevue/password';
// import PickList from 'primevue/picklist';
import ProgressBar from 'primevue/progressbar';
// import Rating from 'primevue/rating';
// import RadioButton from 'primevue/radiobutton';
// import Ripple from 'primevue/ripple';
import SelectButton from 'primevue/selectbutton';
// import Slider from 'primevue/slider';
// import Sidebar from 'primevue/sidebar';
// import SplitButton from 'primevue/splitbutton';
// import Steps from 'primevue/steps';
import TabMenu from 'primevue/tabmenu';
// import TieredMenu from 'primevue/tieredmenu';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
// import Toolbar from 'primevue/toolbar';
// import TabView from 'primevue/tabview';
// import TabPanel from 'primevue/tabpanel';
import Tooltip from 'primevue/tooltip';
// import ToggleButton from 'primevue/togglebutton';
// import Tree from 'primevue/tree';
// import TreeTable from 'primevue/treetable';
// import TriStateCheckbox from 'primevue/tristatecheckbox';

import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/saga-blue/theme.css';

import './index.css'

createApp(App)
.use(store)
.use(router)
.use(GlobalHelpersPlugin)
.use(GlobalFiltersPlugin)
.use(RunManagerPlugin)
.use(PrimeVue)
.use(ToastService)
.use(ConfirmationService)
.component('Avatar', Avatar)
.component('Button', Button)
.component('Card', Card)
.component('Column', Column)
.component('DataTable', DataTable)
.component('Dialog', Dialog)
.component('Dropdown', Dropdown)
.component('Fieldset', Fieldset)
.component('InputSwitch', InputSwitch)
.component('InputText', InputText)
.component('ProgressBar', ProgressBar)
.component('Toast', Toast)
.component('Menu', Menu)
.component('Menubar', Menubar)
.component('TabMenu', TabMenu)
.component('Panel', Panel)
.component('Textarea', Textarea)
.component('SelectButton', SelectButton)
.component('InputNumber', InputNumber)
// .component('SelectButton', SelectButton)
// .component('SelectButton', SelectButton)


// .component('ConfirmPopup', ConfirmPopup)
.directive('Tooltip', Tooltip)
.mount('#app');
