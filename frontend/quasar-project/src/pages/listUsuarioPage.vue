<template>
  <q-page class="usu-page">

    <!-- HEADER -->
    <div class="usu-header">
      <div>
        <span class="usu-header__eyebrow">Usuarios</span>
        <h1 class="usu-header__title">Gestión de usuarios</h1>
        <p class="usu-header__sub">{{ usuarios.length }} registros</p>
      </div>
    </div>

    <q-card class="q-mb-md shadow-card rounded-card">
      <q-card-section class="row items-center q-col-gutter-sm">

        <!-- Crear separado -->
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Nuevo"
            unelevated
            class="usu-btn"
            @click="router.push('/usuarios/crear')"
          />
        </div>

        <q-separator vertical class="q-mx-md" />

        <!-- Editar / eliminar -->
        <div class="col-auto">
          <q-btn
            color="warning"
            icon="edit"
            row-key="usuario"
            label="Actualizar"
            unelevated
            class="usu-btn"
            :disable="!registroSeleccionado"
            @click="editarUsuario(registroSeleccionado.usuario)"
          />
        </div>

        <div class="col-auto">
          <q-btn
            color="negative"
            icon="delete"
            label="Eliminar"
            unelevated
            class="usu-btn"
            :disable="!registroSeleccionado"
            @click="eliminarUsuario(registroSeleccionado.usuario)"
          />
        </div>

        <div class="col-grow" />

        <!-- FILTROS -->
    <div class="usu-filters">
      <q-input
        v-model="filtros.search"
        outlined
        dense
        debounce="0"
        placeholder="Buscar por usuario, cliente, cédula..."
        class="usu-filters__search"
      >
        <template #prepend>
          <q-icon name="search" size="18px" />
        </template>

        <template #append>
          <q-icon
            v-if="filtros.search"
            name="close"
            size="16px"
            class="cursor-pointer"
            @click="filtros.search = ''"
          />
        </template>
      </q-input>
    </div>

    

      </q-card-section>
    </q-card>

    

    <div class="usu-table-wrap">
      <q-table
        :rows="usuarios"
        :columns="columns"
        row-key="usuario"
        flat
        selection="single"
        v-model:selected="selected"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay usuarios."
        class="usu-table"
      >
        <template #loading>
          <q-inner-loading showing>
            <q-spinner-dots size="40px" color="primary" />
          </q-inner-loading>
        </template>
      </q-table>
    </div>

    


  </q-page>
</template>

<script setup>
import { onMounted, watch,computed,ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUsuarios } from 'src/composables/useUsuarios'

const router = useRouter()
const $q = useQuasar()

const {
  usuarios,
  loading,
  filtros,
  listar,
  eliminar,
  buscarConDebounce
} = useUsuarios()

onMounted(() => {
  listar()
})

watch(
  () => filtros.value.search,
  () => buscarConDebounce()
)

const selected = ref([])
const registroSeleccionado = computed(() => selected.value[0] || null)

function editarUsuario(id) {
  router.push(`/usuarios/editar/${id}`)
}

function eliminarUsuario(id) {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Deseas eliminar el usuario "${id}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
        eliminar(id)
    })()
  })
}

const columns = [
  { name: 'cliente',    label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'usuario',    label: 'Usuario', field: 'usuario', align: 'left' },
  { name: 'cedula',     label: 'Cédula',  field: 'cedula',  align: 'left' },
  { name: 'cargo',      label: 'Cargo',   field: 'cargo',   align: 'left' }
]

</script>


<style scoped>
.usu-page {
  background: #f0f2f7;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
}

.usu-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 28px 32px 20px;
  background: #1c2a45;
  flex-shrink: 0;
}

.usu-header__actions {
  display: flex;
  gap: 10px;
}

.usu-header__eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #6fa3ef;
  margin-bottom: 4px;
}

.usu-header__title {
  margin: 0 0 2px;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.usu-header__sub {
  margin: 0;
  font-size: 13px;
  color: #7a8faf;
}

.usu-btn--ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-weight: 600;
}

.usu-btn {
  border-radius: 8px;
  font-weight: 600;
}

.usu-filters {
  display: flex;
  justify-content: center;
  padding: 18px 32px 0;
}

.usu-filters__search {
  margin-left: auto;
  width: 100%;
  max-width: 700px;
}

.usu-table-wrap {
  flex: 1;
  padding: 20px 32px 32px;
}

.usu-table {
  border-radius: 12px;
  border: 1px solid #e2e7f0;
  background: #fff;
}

:deep(.usu-table thead th) {
  background: #f7f9fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #7a8faf;
  white-space: nowrap;
  border-bottom: 2px solid #e2e7f0;
}

:deep(.usu-table tbody td) {
  font-size: 13px;
  color: #2c3e60;
  white-space: nowrap;
  border-bottom: 1px solid #f0f2f7;
}

:deep(.usu-table tbody tr:hover td) {
  background: #f5f8ff;
}

.usu-error {
  background: #fff0f0;
  color: #c0392b;
  border-left: 3px solid #e74c3c;
}

@media (max-width: 600px) {
  .usu-header {
    padding: 20px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .usu-filters {
    padding: 12px 16px 0;
  }

  .usu-table-wrap {
    padding: 12px 16px;
  }
}
</style>