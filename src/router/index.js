import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/licenses',
    name: 'Licenses',
    component: () => import(/* webpackChunkName: "licenses_panel" */ '../views/LicensesPanel.vue'),
    children: [
      {
        path: '/inbox',
        name: 'Inbox',
        component: () => import(/* webpackChunkName: "inbox" */ '../views/Inbox.vue')    
      },
      {
        path: '',
        name: 'Buckets',
        component: () => import(/* webpackChunkName: "buckets" */ '../views/Buckets.vue')    
      },
      {
        path: '/bucket/:id',
        name: 'BucketId',
        component: () => import(/* webpackChunkName: "bucket" */ '../views/Bucket.vue')    
      },
      {
        path: '/license/:id',
        name: 'License',
        component: () => import(/* webpackChunkName: "license" */ '../views/License.vue')    
      },
      // {
      //   path: '/payments/:id',
      //   name: 'Payments',
      //   component: () => import(/* webpackChunkName: "payments" */ '../views/Payments.vue')    
      // },
      // {
      //   path: '/cancelled/:id',
      //   name: 'Cancelled',
      //   component: () => import(/* webpackChunkName: "cancelled" */ '../views/Cancelled.vue')    
      // }
    ]
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import(/* webpackChunkName: "about" */ '../views/Help.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// Initialize all app data before enter in first route
const storeInit = store.dispatch("initAppData");
let storeInitDone = false;

// Before all other beforeEach, verify if it must load all app initial data
router.beforeEach((to, from, next) => {
    if (storeInitDone) {
        next();
        return;
    }
    storeInit.then(() => {
        storeInitDone = true;
        next()
    })
    .catch(e => {
        console.log("storeInit error", e);
        next()
    });
})


export default router
