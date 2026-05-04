<template>
  <q-layout view="hHh Lpr lFf">

    <!-- TOPBAR -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title>
          Gestión Extensiones
        </q-toolbar-title>

        <q-btn flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer v-model="drawer" show-if-above bordered class="bg-white" :width="260">




      <!-- MENU -->
      <q-list padding>

        <q-item clickable v-ripple to="/extensiones" exact>
          <q-item-section avatar>
            <q-icon name="list_alt" />
          </q-item-section>
          <q-item-section>
            Extensiones
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/extensiones/asignar">
          <q-item-section avatar>
            <q-icon name="assignment_ind" />
          </q-item-section>
          <q-item-section>
            Asignar Extensión
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/extensiones/reasignar">
          <q-item-section avatar>
            <q-icon name="assignment_return" />
          </q-item-section>
          <q-item-section>
            Reasignar Extensión
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/extensiones/intercambiar">
          <q-item-section avatar>
            <q-icon name="swap_horiz" />
          </q-item-section>
          <q-item-section>
            Intercambiar Extensión
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/extensiones/liberar">
          <q-item-section avatar>
            <q-icon name="lock_open" />
          </q-item-section>
          <q-item-section>
            Liberar Extensión
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <q-item clickable v-ripple to="/extensiones/movimientos">
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            Movimientos
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <q-item clickable v-ripple to="/usuarios">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            Usuarios
          </q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />

        <q-item clickable v-ripple to="/catalogos">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            Catalogos
          </q-item-section>
        </q-item>


      </q-list>

      <q-separator />

      <!-- FOOTER -->
      <div class="q-pa-md text-caption text-grey-7">
        v1.0 - Sistema de extensiones
      </div>
    </q-drawer>

    <!-- CONTENIDO -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const router = useRouter()

function logout() {
  // si no tienes login aún, solo redirecciona
  void router.push('/')
}
</script>

<style scoped></style>