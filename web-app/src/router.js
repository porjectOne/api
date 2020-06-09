import Vue from 'vue'
import Router from 'vue-router'
import store from './store/auth'
import Login from './components/Login.vue'
import Room from './components/Room';
import Student from './components/Student';
import Subject from './components/Subject';
import Teacher from './components/Teacher';
import Test from './components/Test';


Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/room',
        name: 'room',
        component: Room
      },
      {
        path: '/student',
        name: 'student',
        component: Student
      },
      {
        path: '/subject',
        name: 'subject',
        component: Subject
      },
      {
        path: '/teacher',
        name: 'teacher',
        component: Teacher
      },
      {
        path: '/test',
        name: 'test',
        component: Test
      }
    ]
  })

//   router.beforeEach((to, from, next) => {
//     if(to.matched.some(record => record.meta.requiresAuth)) {
//       if (store.getters.isLoggedIn) {
//         next()
//         return
//       }
//       next('/login') 
//     } else {
//       next() 
//     }
//   })  
  
  router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.state.user;
    // console.log("login:" + loggedIn)

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
  })

export default router