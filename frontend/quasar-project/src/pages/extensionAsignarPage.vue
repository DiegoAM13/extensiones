<template>
    <q-page class="asig-page">

        <!-- HEADER -->
        <div class="asig-header">
            <q-btn flat round icon="arrow_back" color="white" class="asig-header__back" @click="router.back()" />

            <div>
                <span class="asig-header__eyebrow">Extensiones</span>
                <h1 class="asig-header__title">Asignar extensión</h1>
                <p class="asig-header__sub">
                    El usuario quedara en una extension que se encuentra en estado DISPONIBLE.
                </p>
            </div>
        </div>

        <!-- BODY -->
        <div class="asig-body">

            <!-- PARTE 1: EXTENSION REFERENCIA -->
            <div class="asig-card">
                <p class="asig-card__title">Extensión de referencia</p>

                <q-select v-model="extensionReferencia" outlined dense use-input input-debounce="300" clearable
                    label="Buscar extensión referencia" class="asig-input" :options="extensionesRefFiltradas"
                    @filter="filtrarExtensionesRef" emit-value map-options @update:model-value="cargarCoincidencias">
                    <template #prepend>
                        <q-icon name="dialpad" />
                    </template>
                </q-select>

                <div v-if="extensionRefObj" class="q-mt-md">

                    <q-table :rows="[extensionRefObj]" :columns="columnasReferencia" row-key="extension" flat bordered
                        dense hide-pagination :rows-per-page-options="[0]" class="asig-table">
                        <template #body-cell-estado="props">
                            <q-td :props="props">
                                <span :class="chipClass(props.row.estado)">
                                    {{ props.row.estado }}
                                </span>
                            </q-td>
                        </template>

                        <template #body-cell-observacion="props">
                            <q-td :props="props">
                                {{ props.row.observacion || '—' }}
                            </q-td>
                        </template>
                    </q-table>

                </div>
            </div>

            <!-- PARTE 2: TABLA COINCIDENCIAS -->
            <div class="asig-card">
                <p class="asig-card__title">
                    Extensiones disponibles con mismo tipo, división y plataforma
                </p>

                <q-input v-model="filtroTablaCoincidencias" outlined dense clearable debounce="300"
                    placeholder="Buscar en coincidencias..." class="q-mb-md">
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-table :rows="extensionesCoincidentes" :columns="columnasCoincidencias" row-key="extension" flat
                    bordered dense :loading="loading" no-data-label="No hay extensiones disponibles con esos criterios."
                    @row-click="seleccionarExtension" class="asig-table" :pagination="{ rowsPerPage: 3 }"
                    :filter="filtroTablaCoincidencias">
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
                </q-table>
            </div>

            <!-- FORMULARIO -->
            <q-form ref="formRef" class="asig-form" @submit.prevent="enviar">

                <!-- EXTENSION SELECCIONADA -->
                <div class="asig-card">
                    <p class="asig-card__title">
                        Extensión seleccionada <span class="asig-required">*</span>
                    </p>

                    <q-input v-model="form.extension" outlined dense label="Extensión a asignar" class="asig-input"
                        disable :rules="[val => !!val || 'La extensión es obligatoria']">
                        <template #prepend>
                            <q-icon name="dialpad" />
                        </template>
                    </q-input>
                </div>

                <!-- DATOS USUARIO -->
                <div class="asig-card">
                    <p class="asig-card__title">Datos del usuario</p>

                    <div class="asig-grid">
                        <q-select v-model="form.usuario" outlined dense use-input input-debounce="300" clearable
                            label="Usuario" class="asig-input" :options="usuariosFiltrados" @filter="filtrarUsuarios">
                        </q-select>

                        <q-input v-model="form.puesto_trabajo" outlined dense label="Puesto de trabajo"
                            class="asig-input">
                        </q-input>
                    </div>
                </div>

                <!-- ORGANIZACION -->
                <div class="asig-card">
                    <p class="asig-card__title">Organización</p>

                    <div class="asig-grid">

                        <q-select v-model="form.direccion" outlined dense use-input input-debounce="300" clearable
                            label="Dirección" class="asig-input" :options="direccionesFiltradas"
                            @filter="filtrarDirecciones">
                        </q-select>

                        <q-select v-model="form.campana" outlined dense use-input input-debounce="300" clearable
                            label="Campaña" class="asig-input" :options="campanasFiltradas" @filter="filtrarCampanas">
                        </q-select>

                        <q-select v-model="form.sede" outlined dense use-input input-debounce="300" clearable
                            label="Sede" class="asig-input" :options="sedesFiltradas" @filter="filtrarSedes">
                        </q-select>

                        <q-select v-model="form.cliente2" outlined dense use-input input-debounce="300" clearable
                            label="Cliente 2" class="asig-input" :options="clientes2Filtrados"
                            @filter="filtrarClientes2">
                        </q-select>

                        <q-select v-model="form.codigoceco" outlined dense use-input input-debounce="300" clearable
                            label="Código CECO" class="asig-input" :options="codigoCecoFiltrados"
                            @filter="filtrarCodigoCeco">
                        </q-select>

                        <q-select v-model="form.ceco" outlined dense use-input input-debounce="300" clearable
                            label="CECO" class="asig-input" :options="cecoFiltrados" @filter="filtrarCeco">
                        </q-select>

                    </div>
                </div>

                <!-- TRAZABILIDAD -->
                <div class="asig-card">
                    <p class="asig-card__title">Trazabilidad</p>

                    <div class="asig-grid asig-grid--full">

                        <q-input v-model="form.ticket_solicitud" outlined dense label="Ticket de solicitud *"
                            class="asig-input" :rules="[val => !!val || 'El ticket es obligatorio']">
                        </q-input>

                        <q-input v-model="form.observacion" outlined dense label="Observación" type="textarea" autogrow
                            class="asig-input">
                        </q-input>

                    </div>
                </div>

                <!-- ACCIONES -->
                <div class="asig-actions">
                    <q-btn flat label="Cancelar" class="asig-btn--cancel" @click="router.back()" />

                    <q-btn unelevated type="submit" label="Asignar extensión" color="primary" class="asig-btn"
                        :loading="loading" />
                </div>

            </q-form>
        </div>

        <q-dialog v-model="showMovDialog">
            <q-card style="min-width: 1200px">

                <q-card-section class="text-h6">
                    Movimientos generados
                </q-card-section>

                <q-separator />

                <q-card-section>

                    <q-table :rows="movimientoActual ? [movimientoActual] : []" :columns="columnasMovimiento"
                        row-key="id" dense flat hide-pagination />

                </q-card-section>

                <q-card-actions align="right">
                    <q-btn color="primary" label="Aceptar" @click="cerrarDialog" />
                </q-card-actions>

            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup>

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useExtensiones } from 'src/composables/useExtensiones'
import { useUsuarios } from 'src/composables/useUsuarios'
import { useDireccion, useCampana, useSede, useCliente2, useCeco, useCodigoCeco } from 'src/composables/useCatalogo'

const router = useRouter()
const $q = useQuasar()

////// COMPOSABLES

const { extensiones, loading, listar, asignar } = useExtensiones()
const { usuarios, listar: listarUsuarios } = useUsuarios()

const direccionCrud = useDireccion()
const campanaCrud = useCampana()
const sedeCrud = useSede()
const cliente2Crud = useCliente2()
const cecoCrud = useCeco()
const codigoCecoCrud = useCodigoCeco()

////////   FORM

const formRef = ref(null)
const filtroTablaCoincidencias = ref('')

const form = reactive({
    extension: '',
    usuario: '',
    puesto_trabajo: '',
    direccion: '',
    campana: '',
    sede: '',
    cliente2: '',
    codigoceco: '',
    ceco: '',
    ticket_solicitud: '',
    observacion: ''
})

///// EXTENSION REFERENCIA

const extensionReferencia = ref(null)
const extensionRefObj = ref(null)

const extensionesRefFiltradas = ref([])

async function filtrarExtensionesRef(val, update) {
    update(() => {
        extensionesRefFiltradas.value = []
    })

    await listar({ search: val || '', estado: 'CREADA' })

    extensionesRefFiltradas.value = extensiones.value.map(e => ({
        label: e.extension,
        value: e.extension
    }))
}

///COINCIDENCIAS

const extensionesCoincidentes = ref([])

async function cargarCoincidencias(ext) {
    if (!ext) {
        extensionRefObj.value = null
        extensionesCoincidentes.value = []
        return
    }

    // buscar extension referencia exacta
    await listar({ extension: ext })
    extensionRefObj.value = extensiones.value?.[0] ?? null

    if (!extensionRefObj.value) {
        extensionesCoincidentes.value = []
        return
    }

    // buscar coincidencias
    await listar({
        estado: 'DISPONIBLE',
        tipo: extensionRefObj.value.tipo,
        division: extensionRefObj.value.division,
        plataforma: extensionRefObj.value.plataforma
    })

    extensionesCoincidentes.value = extensiones.value

}

//// COLUMNAS TABLA

const columnasCoincidencias = [
    { name: 'extension', label: 'Extensión', field: 'extension', align: 'left', sortable: true },
    { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
    { name: 'division', label: 'División', field: 'division', align: 'left' },
    { name: 'plataforma', label: 'Plataforma', field: 'plataforma', align: 'left' },
    { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
    { name: 'ticket_solicitud', label: 'Ticket solicitud', field: 'ticket_solicitud', align: 'left' },
    { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
    { name: 'observacion', label: 'Observación', field: 'observacion', align: 'left' }
]

const columnasReferencia = [
    { name: 'extension', label: 'Extensión', field: 'extension', align: 'left' },
    { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
    { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' },
    { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
    { name: 'division', label: 'División', field: 'division', align: 'left' },
    { name: 'campana', label: 'Campaña', field: 'campana', align: 'left' },
    { name: 'plataforma', label: 'Plataforma', field: 'plataforma', align: 'left' },
    { name: 'codigo_ceco', label: 'Código CECO', field: 'codigo_ceco', align: 'left' },
    { name: 'ceco', label: 'CECO', field: 'ceco', align: 'left' },
    { name: 'cliente2', label: 'Cliente 2', field: 'cliente2', align: 'left' },
    { name: 'cedula', label: 'Cédula', field: 'cedula', align: 'left' },
    { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
    { name: 'puesto_trabajo', label: 'Puesto trabajo', field: 'puesto_trabajo', align: 'left' },
    { name: 'sede', label: 'Sede', field: 'sede', align: 'left' },
    { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
    { name: 'ticket_solicitud', label: 'Ticket solicitud', field: 'ticket_solicitud', align: 'left' },
    { name: 'ticket_eliminacion', label: 'Ticket eliminación', field: 'ticket_eliminacion', align: 'left' },
    { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
    { name: 'observacion', label: 'Observación', field: 'observacion', align: 'left' }
]

//SELECT FILTRADOS

const direccionesFiltradas = ref([])
const campanasFiltradas = ref([])
const usuariosFiltrados = ref([])
const sedesFiltradas = ref([])
const clientes2Filtrados = ref([])
const codigoCecoFiltrados = ref([])
const cecoFiltrados = ref([])

async function filtrarDirecciones(val, update) {
    update(() => {
        direccionesFiltradas.value = []
    })

    await direccionCrud.listar({ search: val || '' })
    direccionesFiltradas.value = direccionCrud.items.value.map(x => x.direccion)
}

async function filtrarCampanas(val, update) {
    update(() => {
        campanasFiltradas.value = []
    })

    await campanaCrud.listar({ search: val || '' })
    campanasFiltradas.value = campanaCrud.items.value.map(x => x.campana)
}

async function filtrarUsuarios(val, update) {
    update(() => {
        usuariosFiltrados.value = []
    })

    await listarUsuarios({ search: val || '' })
    usuariosFiltrados.value = usuarios.value.map(u => u.usuario)
}

async function filtrarSedes(val, update) {
    update(() => {
        sedesFiltradas.value = []
    })

    await sedeCrud.listar({ search: val || '' })
    sedesFiltradas.value = sedeCrud.items.value.map(x => x.sede)
}

async function filtrarClientes2(val, update) {
    update(() => {
        clientes2Filtrados.value = []
    })

    await cliente2Crud.listar({ search: val || '' })
    clientes2Filtrados.value = cliente2Crud.items.value.map(x => x.cliente2)
}

async function filtrarCodigoCeco(val, update) {
    update(() => {
        codigoCecoFiltrados.value = []
    })

    await codigoCecoCrud.listar({ search: val || '' })
    codigoCecoFiltrados.value = codigoCecoCrud.items.value.map(x => x.codigoceco)
}

async function filtrarCeco(val, update) {
    update(() => {
        cecoFiltrados.value = []
    })

    await cecoCrud.listar({ search: val || '' })
    cecoFiltrados.value = cecoCrud.items.value.map(x => x.ceco)
}
/* ==========================
   CLICK EN FILA
========================== */
function seleccionarExtension(evt, row) {
    if (!extensionRefObj.value) {
        $q.notify({
            type: 'warning',
            message: 'Primero selecciona una extensión de referencia',
            position: 'top'
        })
        return
    }

    Object.assign(form, {
        // LA QUE SE VA A ASIGNAR (la que eliges de la tabla)
        extension: row.extension || '',

        // TODO LO DEMÁS SALE DE LA REFERENCIA
        usuario: '',
        puesto_trabajo: '',
        direccion: extensionRefObj.value.direccion || '',
        campana: extensionRefObj.value.campana || '',
        codigoceco: extensionRefObj.value.codigoceco || '',
        ceco: extensionRefObj.value.ceco || '',
        cliente2: extensionRefObj.value.cliente2 || '',
        sede: extensionRefObj.value.sede || '',
        observacion: '',

        // SIEMPRE NUEVO
        ticket_solicitud: ''
    })

    $q.notify({
        type: 'info',
        message: `Se seleccionó la extensión ${row.extension} y se cargaron datos desde la referencia`,
        position: 'top'
    })
}

////// ENVIAR

async function enviar() {
    const valido = await formRef.value?.validate()
    if (valido !== true) return
    const res = await asignar({ ...form })

    movimientoActual.value =
        res?.movimientos?.[0] ||
        res?.movimiento ||
        null

    showMovDialog.value = true
}

///CHIP ESTADO

function chipClass(estado) {
    const base = 'asig-chip'
    const map = {
        DISPONIBLE: 'asig-chip--disponible',
        CREADA: 'asig-chip--creada',
        ELIMINADA: 'asig-chip--eliminada'
    }
    return `${base} ${map[estado] ?? ''}`
}

///mostrar movimiento

function cerrarDialog() {
    showMovDialog.value = false
    router.push('/extensiones')
}


const showMovDialog = ref(false)
const movimientoActual = ref(null)

const columnasMovimiento = [

    { name: 'extension', label: 'Extensión', field: 'extension', align: 'left' },
    { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
    { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' },
    { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
    { name: 'division', label: 'División', field: 'division', align: 'left' },
    { name: 'plataforma', label: 'Plataforma', field: 'plataforma', align: 'left' },
    { name: 'cedula', label: 'Cedula', field: 'cedula', align: 'left' },
    { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
    { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
    { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
]


</script>

<style scoped>
.asig-page {
    background: #f0f2f7;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
}

.asig-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 28px 32px 24px;
    background: #1c2a45;
}

.asig-header__back {
    flex-shrink: 0;
}

.asig-header__eyebrow {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #6fa3ef;
    margin-bottom: 4px;
}

.asig-header__title {
    margin: 0 0 2px;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
}

.asig-header__sub {
    margin: 0;
    font-size: 13px;
    color: #7a8faf;
}

.asig-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 24px 48px;
}

.asig-card {
    background: #fff;
    border: 1px solid #e2e7f0;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
}

.asig-card__title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #7a8faf;
    margin: 0 0 14px;
}

.asig-required {
    color: #e74c3c;
}

.asig-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.asig-grid--full {
    grid-template-columns: 1fr;
}

.asig-input {
    width: 100%;
}

.asig-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
}

.asig-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 0 24px;
    height: 40px;
}

.asig-btn--cancel {
    border-radius: 8px;
    font-weight: 600;
    color: #555;
}

.asig-error {
    background: #fff0f0;
    color: #c0392b;
    border-left: 3px solid #e74c3c;
}

.asig-chip {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}

.asig-chip--disponible {
    background: #e6f9f0;
    color: #1a8a55;
}

.asig-chip--creada {
    background: #e8f0fe;
    color: #1a56c4;
}

.asig-chip--eliminada {
    background: #fde8e8;
    color: #c0392b;
}

@media (max-width: 600px) {
    .asig-header {
        padding: 20px 16px;
    }

    .asig-body {
        padding: 16px 12px 40px;
    }

    .asig-grid {
        grid-template-columns: 1fr;
    }
}
</style>