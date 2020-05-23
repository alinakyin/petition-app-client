import Vue from 'vue';
import App from './App.vue';
import Petitions from './Petitions.vue';
import Petition from './Petition.vue';
import Register from './Register.vue';
import Login from './Login.vue';
import CreatePetition from "./CreatePetition.vue";
import User from './User.vue';
import UploadPhoto from './UploadPhoto.vue';
import EditPetition from './EditPetition.vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "petitions",
    component: Petitions
  },
  {
    path: "/petitions/:petitionId",
    name: "petition",
    component: Petition
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/create",
    name: "create",
    component: CreatePetition
  },
  {
    path: "/user",
    name: "user",
    component: User
  },
  {
    path: "/create/:petitionId/photo",
    name: "petitionPhoto",
    component: UploadPhoto
  },
  {
    path: "/register/photo",
    name: "userPhoto",
    component: UploadPhoto
  },
  {
    path: "/petitions/:petitionId/edit",
    name: "editPetition",
    component: EditPetition
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App) // renders App.vue to #app DOM element, i.e. replaces <div id="app"></div> that is specified
                      // in index.html with App rendered template
});
