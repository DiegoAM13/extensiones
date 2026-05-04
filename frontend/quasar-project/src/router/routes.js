const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      
      { 
        path: '', component: () => import('pages/extensionesListPage.vue') 
      },

      { 
        path: '/extensiones', component: () => import('pages/extensionesListPage.vue') 
      },

      { 
        path: '/extensiones/asignar', component: () => import('pages/extensionAsignarPage.vue') 
      },

      { 
        path: '/extensiones/reasignar', component: () => import('pages/extensionReasignarPage.vue') 
      },
      { 
        path: '/extensiones/intercambiar', component: () => import('pages/extensionTrasladarPage.vue') 
      },
  
      { 
        path: '/extensiones/liberar', component: () => import('pages/extensionesLiberarPage.vue') 
      },

      { 
        path: '/usuarios', component: () => import('pages/listUsuarioPage.vue') 
      },
       { 
        path: '/extensiones/movimientos', component: () => import('pages/lmovimientoslistPage.vue') 
      },

      { 
        path: '/usuarios/crear', component: () => import('pages/crearUsuarioPage.vue') 
      },

      { 
        path: '/usuarios/editar/:id', component: () => import('pages/crearUsuarioPage.vue') 
      },

      { 
        path: '/catalogos', component: () => import('pages/catalogsListPage.vue') 
      },
      


    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
