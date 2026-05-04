<template>
  <q-page class="ext-page">

    <!-- HEADER -->
    <div class="ext-header">
      <div>
        <span class="ext-header__eyebrow">Extensiones</span>
        <h1 class="ext-header__title">Extensiones</h1>
        <p class="ext-header__sub">{{ extensiones.length }} registros</p>
      </div>

      <!-- BOTÓN EXPORTAR -->
      <div class="ext-header__actions">
        <q-btn color="green" icon="download" label="Exportar" :loading="loading" @click="exportar" unelevated />
      </div>

    </div>



    <!-- FILTROS -->
    <div class="ext-filters">


      <!-- TIPO ARRIBA CENTRADO -->
      <div class="ext-filters__top">
        <q-btn-toggle v-model="filtros.tipo" toggle-color="primary" unelevated rounded dense :options="[
          { label: 'Todos', value: null },
          { label: 'Operación', value: 'Operación' },
          { label: 'Administrativa', value: 'Administrativa' }
        ]" />
      </div>

      <!-- FILTROS ABAJO -->
      <div class="ext-filters__bottom">
        <q-input v-model="filtros.search" outlined dense debounce="0"
          placeholder="Buscar por extensión, cliente, usuario, cédula" class="ext-filters__search">
          <template #prepend>
            <q-icon name="search" size="18px" />
          </template>

          <template #append>
            <q-icon v-if="filtros.search" name="close" size="16px" class="cursor-pointer"
              @click="filtros.search = ''" />
          </template>
        </q-input>

        <q-select v-model="filtros.estado" :options="['DISPONIBLE', 'CREADA', 'ELIMINADA', 'DESACTIVADA']" outlined dense
          clearable placeholder="Estado" class="ext-filters__estado" />
      </div>

    </div>

    <!-- TABLA -->
    <div class="ext-table-wrap">
      <q-table :rows="extensiones" :columns="columnas" row-key="extension" flat :loading="loading"
        :pagination="{ rowsPerPage: 10 }" no-data-label="Sin extensiones." class="ext-table">
        <template #loading>
          <q-inner-loading showing>
            <q-spinner-dots size="40px" color="primary" />
          </q-inner-loading>
        </template>

        <template #body-cell-estado="props">
          <q-td :props="props">
            <span :class="chipClass(props.row.estado)">
              {{ props.row.estado }}
            </span>
          </q-td>
        </template>

        <template #body-cell-fecha_ultima_modificacion="props">
          <q-td :props="props">
            {{ formatFecha(props.row.fecha_ultima_modificacion) }}
          </q-td>
        </template>

        <template #body-cell-ticket_eliminacion="props">
          <q-td :props="props">
            {{ props.row.ticket_eliminacion || '—' }}
          </q-td>
        </template>

        <template #body-cell-observacion="props">
          <q-td :props="props">
            <span class="ext-obs" :title="props.row.observacion">
              {{ props.row.observacion || '—' }}
            </span>
          </q-td>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useExtensiones } from 'src/composables/useExtensiones'

const {
  extensiones,
  loading,
  filtros,
  listar,
  buscarConDebounce,
  exportar
} = useExtensiones()

onMounted(() => {
  listar()
})

watch(
  () => filtros.value.search,
  () => buscarConDebounce()
)

watch(
  () => [filtros.value.estado, filtros.value.tipo],
  () => listar()
)

// ─── Columnas ─────────────────────────────────────────────────
const columnas = [
  { name: 'extension', label: 'Extensión', field: 'extension', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left', sortable: true },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left', sortable: true },
  { name: 'direccion', label: 'Direccion', field: 'direccion', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'division', label: 'División', field: 'division', align: 'left' },
  { name: 'campana', label: 'Campaña', field: 'campana', align: 'left' },
  { name: 'codigoceco', label: 'Cod.Ceco', field: 'codigoceco', align: 'left' },
  { name: 'ceco', label: 'Ceco', field: 'ceco', align: 'left' },
  { name: 'cliente2', label: 'Cliente 2', field: 'cliente2', align: 'left' },
  { name: 'plataforma', label: 'Plataforma', field: 'plataforma', align: 'left' },
  { name: 'cedula', label: 'Cédula', field: 'cedula', align: 'left' },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
  { name: 'puesto_trabajo', label: 'Puesto de trabajo', field: 'puesto_trabajo', align: 'left' },
  { name: 'sede', label: 'Sede', field: 'sede', align: 'left' },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
  { name: 'fecha_ultima_modificacion', label: 'Última modificación', field: 'fecha_ultima_modificacion', align: 'left' },
  { name: 'ticket_solicitud', label: 'Ticket solicitud', field: 'ticket_solicitud', align: 'left' },
  { name: 'ticket_eliminacion', label: 'Ticket eliminación', field: 'ticket_eliminacion', align: 'left' },
  { name: 'observacion', label: 'Observación', field: 'observacion', align: 'left' }
]

// ─── Helpers ──────────────────────────────────────────────────
function chipClass(estado) {
  const base = 'ext-chip'
  const map = {
    DISPONIBLE: 'ext-chip--disponible',
    CREADA: 'ext-chip--creada',
    ELIMINADA: 'ext-chip--eliminada'
  }
  return `${base} ${map[estado] ?? ''}`
}

function formatFecha(val) {
  if (!val) return "—"

  // Si viene como "YYYY-MM-DD", parsear manualmente
  const parts = val.split("-")
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number)
    const d = new Date(year, month - 1, day) // crea fecha en hora local
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  // Si viene con hora UTC, ajustar manualmente
  const d = new Date(val)
  if (isNaN(d.getTime())) return val

  const local = new Date(d.getTime() + d.getTimezoneOffset() * 60000)
  return local.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}
</script>


<style scoped>
.ext-page {
  background: #f0f2f7;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
}

.ext-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 28px 32px 20px;
  background: #1c2a45;
  flex-shrink: 0;
}

.ext-header__eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #6fa3ef;
  margin-bottom: 4px;
}

.ext-header__actions {
  display: flex;
  align-items: center;
}

.ext-header__title {
  margin: 0 0 2px;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.ext-header__sub {
  margin: 0;
  font-size: 13px;
  color: #7a8faf;
}

.ext-btn--ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-weight: 600;
}

.ext-filters {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
  margin-top: 20px;
}

.ext-filters__top {
  display: flex;
  justify-content: center;
}

.ext-filters__bottom {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.ext-filters__search {
  width: 100%;
  max-width: 650px;
}

.ext-filters__estado {
  width: 170px;
}

.ext-table-wrap {
  flex: 1;
  padding: 20px 32px 32px;
}

.ext-table {
  border-radius: 12px;
  border: 1px solid #e2e7f0;
  background: #fff;
}

:deep(.ext-table thead th) {
  background: #f7f9fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #7a8faf;
  white-space: nowrap;
  border-bottom: 2px solid #e2e7f0;
}

:deep(.ext-table tbody td) {
  font-size: 13px;
  color: #2c3e60;
  white-space: nowrap;
  border-bottom: 1px solid #f0f2f7;
}

:deep(.ext-table tbody tr:hover td) {
  background: #f5f8ff;
}

.ext-obs {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ext-chip {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.ext-chip--disponible {
  background: #e6f9f0;
  color: #1a8a55;
}

.ext-chip--creada {
  background: #e8f0fe;
  color: #1a56c4;
}

.ext-chip--eliminada {
  background: #fde8e8;
  color: #c0392b;
}

.ext-error {
  background: #fff0f0;
  color: #c0392b;
  border-left: 3px solid #e74c3c;
}

@media (max-width: 600px) {
  .ext-header {
    padding: 20px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .ext-filters {
    padding: 12px 16px;
  }

  .ext-table-wrap {
    padding: 12px 16px;
  }
}
</style>