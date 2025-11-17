<template>
  <CrudComponent
    :config="crudConfig"
    :data="personalStore.personal"
    :loading="personalStore.loading"
    @create="openCreateModal"
    @filter-change="handleFilterChange"
    @form-submit="handleFormSubmit"
    @action="handleAction"
    @sort="handleSort"
    ref="crudRef"
  >
    <!-- Slots personalizados para columnas -->
    <template #column-dni="{ item }">
      {{ item.dni || '-' }}
    </template>

    <template #column-ruc="{ item }">
      {{ item.ruc || '-' }}
    </template>

    <template #column-full_name="{ item }">
      {{ item.full_name || '-' }}
    </template>

    <template #column-sexo="{ item }">
      <div class="flex items-center gap-1">
        <i v-if="item.sexo === 'M'" class="fas fa-mars text-blue-500 text-sm"></i>
        <i v-else-if="item.sexo === 'F'" class="fas fa-venus text-pink-500 text-sm"></i>
        <span>{{ item.sexo || '-' }}</span>
      </div>
    </template>

    <template #column-fecha_nac="{ item }">
      <div>
        {{ item.fecha_nac || '-' }}
        <br v-if="item.edad">
        <span v-if="item.edad" class="text-xs text-gray-500">
          ({{ item.edad }} años)
        </span>
      </div>
    </template>

    <template #column-celular="{ item }">
      {{ item.celular || '-' }}
    </template>

    <template #column-email="{ item }">
      {{ item.email || '-' }}
    </template>

    <template #column-dependencia_nombre="{ item }">
      {{ item.dependencia_nombre || '-' }}
    </template>

    <template #column-area_nombre="{ item }">
      {{ item.area_nombre || '-' }}
    </template>

    <template #column-condicion_nombre="{ item }">
      {{ item.condicion_nombre || '-' }}
    </template>

    <template #column-acceso="{ item }" v-if="isSuperuser">
      <span v-if="item.acceso === true" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <i class="fas fa-check-circle mr-1"></i>
        Habilitado
      </span>
      <span v-else-if="item.acceso === false" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <i class="fas fa-times-circle mr-1"></i>
        Deshabilitado
      </span>
      <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <i class="fas fa-minus-circle mr-1"></i>
        Sin acceso
      </span>
    </template>

    <!-- Slot para acciones del header -->
    <template #header-actions>
      <button 
        @click="handleExportExcel" 
        :disabled="exporting"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="fas fa-file-excel"></i>
        Excel
      </button>
      <button 
        @click="handleExportCSV" 
        :disabled="exporting"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="fas fa-file-csv"></i>
        CSV
      </button>
      <button 
        @click="handleExportPDF" 
        :disabled="exporting"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="fas fa-file-pdf"></i>
        PDF
      </button>
    </template>
  </CrudComponent>

  <!-- Modal de formulario para crear/editar -->
  <ModalBase 
    :visible="showModal" 
    :mode="editing ? 'edit' : 'create'" 
    entityName="personal"
    :confirm-text="isSubmitting ? 'Guardando...' : 'Guardar'" 
    :loading="isSubmitting" 
    @close="closeModal"
    @confirm="handleSubmit"
    width="90vw"
    max-height="85vh"
  >
    <template #content>
      <!-- Tu formulario completo con pestañas -->
      <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <!-- Pestañas para organizar la información -->
        <div class="mb-5">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>
        </div>

        <div class="tab-content">
          <!-- Pestaña de Información Básica -->
          <div v-show="activeTab === 'basic'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Columna 1 -->
              <div class="space-y-3">
                <!-- Nombre -->
                <div>
                  <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">
                    Nombres <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="nombre"
                    v-model="form.nombre"
                    type="text"
                    required
                    @input="convertToUppercase('nombre')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.nombre }"
                  />
                  <div v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre[0] }}</div>
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Institucional
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.email }"
                  />
                  <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</div>
                </div>

                <!-- Fecha de Nacimiento -->
                <div>
                  <label for="fecha_nac" class="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    id="fecha_nac"
                    v-model="form.fecha_nac"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.fecha_nac }"
                  />
                  <div v-if="errors.fecha_nac" class="text-red-500 text-xs mt-1">{{ errors.fecha_nac[0] }}</div>
                </div>
              </div>

              <!-- Columna 2 -->
              <div class="space-y-3">
                <!-- Apellido -->
                <div>
                  <label for="apellido" class="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="apellido"
                    v-model="form.apellido"
                    type="text"
                    required
                    @input="convertToUppercase('apellido')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.apellido }"
                  />
                  <div v-if="errors.apellido" class="text-red-500 text-xs mt-1">{{ errors.apellido[0] }}</div>
                </div>

                <!-- Email personal -->
                <div>
                  <label for="email_per" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Personal
                  </label>
                  <input
                    id="email_per"
                    v-model="form.email_per"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.email_per }"
                  />
                  <div v-if="errors.email_per" class="text-red-500 text-xs mt-1">{{ errors.email_per[0] }}</div>
                </div>

                <!-- Sexo -->
                <div>
                  <label for="sexo" class="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    id="sexo"
                    v-model="form.sexo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.sexo }"
                  >
                    <option value="">Seleccionar género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                  <div v-if="errors.sexo" class="text-red-500 text-xs mt-1">{{ errors.sexo[0] }}</div>
                </div>
              </div>

              <!-- Columna 3 -->
              <div class="space-y-3">
                <!-- DNI -->
                <div>
                  <label for="dni" class="block text-sm font-medium text-gray-700 mb-1">
                    DNI <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="dni"
                    v-model="form.dni"
                    type="text"
                    required
                    maxlength="8"
                    @input="onlyNumbersDNI"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.dni }"
                  />
                  <div v-if="errors.dni" class="text-red-500 text-xs mt-1">{{ errors.dni[0] }}</div>
                </div>

                <!-- Celular -->
                <div>
                  <label for="celular" class="block text-sm font-medium text-gray-700 mb-1">
                    Celular
                  </label>
                  <input
                    id="celular"
                    v-model="form.celular"
                    type="text"
                    maxlength="9"
                    @input="onlyNumbersCelular"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.celular }"
                  />
                  <div v-if="errors.celular" class="text-red-500 text-xs mt-1">{{ errors.celular[0] }}</div>
                </div>

                <!-- Es Padre / Madre -->
                <div>
                  <label for="padre_madre" class="block text-sm font-medium text-gray-700 mb-1">
                    Es Padre / Madre
                  </label>
                  <select
                    id="padre_madre"
                    v-model="form.padre_madre"
                    @change="handlePadreMadreChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.padre_madre }"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                  <div v-if="errors.padre_madre" class="text-red-500 text-xs mt-1">{{ errors.padre_madre[0] }}</div>
                </div>
              </div>

              <!-- Columna 4 -->
              <div class="space-y-3">
                <!-- RUC -->
                <div>
                  <label for="ruc" class="block text-sm font-medium text-gray-700 mb-1">
                    RUC
                  </label>
                  <input
                    id="ruc"
                    v-model="form.ruc"
                    type="text"
                    maxlength="11"
                    @input="onlyNumbersRUC"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.ruc }"
                  />
                  <div v-if="errors.ruc" class="text-red-500 text-xs mt-1">{{ errors.ruc[0] }}</div>
                </div>

                <!-- Teléfono -->
                <div>
                  <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    v-model="form.telefono"
                    type="text"
                    maxlength="8"
                    @input="onlyNumbersTelefono"
                    placeholder="123-4567"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.telefono }"
                  />
                  <div v-if="errors.telefono" class="text-red-500 text-xs mt-1">{{ errors.telefono[0] }}</div>
                </div>

                <!-- Número de hijos -->
                <div>
                  <label for="n_hijos" class="block text-sm font-medium text-gray-700 mb-1">
                    N° de hijos
                  </label>
                  <select
                    id="n_hijos"
                    v-model="form.n_hijos"
                    :disabled="form.padre_madre !== 'Si'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :class="{ 'border-red-500': errors.n_hijos, 'bg-gray-100': form.padre_madre !== 'Si' }"
                  >
                    <option value="">Seleccionar</option>
                    <option v-for="n in 6" :key="n" :value="n.toString()">{{ n }} hijo{{ n > 1 ? 's' : '' }}</option>
                  </select>
                  <div v-if="errors.n_hijos" class="text-red-500 text-xs mt-1">{{ errors.n_hijos[0] }}</div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="md:col-span-2">
                <!-- Dirección -->
                <div>
                  <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    id="direccion"
                    v-model="form.direccion"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.direccion }"
                  />
                  <div v-if="errors.direccion" class="text-red-500 text-xs mt-1">{{ errors.direccion[0] }}</div>
                </div>
              </div>

              <div>
                <!-- Distrito -->
                <div>
                  <label for="distrito" class="block text-sm font-medium text-gray-700 mb-1">
                    Distrito
                  </label>
                  <select
                    id="distrito"
                    v-model="form.distrito"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.distrito }"
                  >
                    <option value="">Seleccionar distrito</option>
                    <option v-for="distrito in distritosLima" :key="distrito.value" :value="distrito.value">
                      {{ distrito.label }}
                    </option>
                  </select>
                  <div v-if="errors.distrito" class="text-red-500 text-xs mt-1">{{ errors.distrito[0] }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pestaña de Datos Laborales -->
          <div v-show="activeTab === 'contract'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Columna 1 -->
              <div class="space-y-4">
                <!-- Dependencia -->
                <div>
                  <label for="dependencia" class="block text-sm font-medium text-gray-700 mb-1">
                    Dependencia
                  </label>
                  <select
                    id="dependencia"
                    v-model="form.dependencia"
                    @change="onDependenciaChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.dependencia }"
                  >
                    <option value="">Seleccionar dependencia</option>
                    <option v-for="dep in dependenciasOptions" :key="dep.id" :value="dep.id">
                      {{ dep.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.dependencia" class="text-red-500 text-xs mt-1">{{ errors.dependencia[0] }}</div>
                </div>

                <!-- Fecha de inicio -->
                <div>
                  <label for="fecha_inicio" class="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    id="fecha_inicio"
                    v-model="form.fecha_inicio"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.fecha_inicio }"
                  />
                  <div v-if="errors.fecha_inicio" class="text-red-500 text-xs mt-1">{{ errors.fecha_inicio[0] }}</div>
                </div>

                <!-- Estado -->
                <div>
                  <label for="estado" class="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    v-model="form.estado"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.estado }"
                  >
                    <option value="">Seleccionar estado</option>
                    <option v-for="estado in estadoOptions" :key="estado.id" :value="estado.id">
                      {{ estado.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.estado" class="text-red-500 text-xs mt-1">{{ errors.estado[0] }}</div>
                </div>

                <!-- Grupo Ocupacional -->
                <div>
                  <label for="grupo_ocupacional" class="block text-sm font-medium text-gray-700 mb-1">
                    Grupo Ocupacional
                  </label>
                  <select
                    id="grupo_ocupacional"
                    v-model="form.grupo_ocupacional"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.grupo_ocupacional }"
                  >
                    <option value="">Seleccionar grupo ocupacional</option>
                    <option v-for="grupo in grupoOcupacionalOptions" :key="grupo.id" :value="grupo.id">
                      {{ grupo.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.grupo_ocupacional" class="text-red-500 text-xs mt-1">{{ errors.grupo_ocupacional[0] }}</div>
                </div>

                <!-- Nivel -->
                <div>
                  <label for="nivel" class="block text-sm font-medium text-gray-700 mb-1">
                    Nivel
                  </label>
                  <select
                    id="nivel"
                    v-model="form.nivel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.nivel }"
                  >
                    <option value="">Seleccionar nivel</option>
                    <option v-for="nivel in nivelOptions" :key="nivel.id" :value="nivel.id">
                      {{ nivel.name }}
                    </option>
                  </select>
                  <div v-if="errors.nivel" class="text-red-500 text-xs mt-1">{{ errors.nivel[0] }}</div>
                </div>
              </div>

              <!-- Columna 2 -->
              <div class="space-y-4">
                <!-- Área -->
                <div>
                  <label for="area" class="block text-sm font-medium text-gray-700 mb-1">
                    Área
                  </label>
                  <select
                    id="area"
                    v-model="form.area"
                    :disabled="!form.dependencia || personalStore.loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :class="{ 'border-red-500': errors.area }"
                  >
                    <option value="">Seleccionar área</option>
                    <option v-for="area in areasOptions" :key="area.id" :value="area.id">
                      {{ area.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.area" class="text-red-500 text-xs mt-1">{{ errors.area[0] }}</div>
                  <div v-if="personalStore.loading" class="text-blue-500 text-xs mt-1">
                    <i class="fas fa-spinner fa-spin mr-1"></i> Cargando áreas...
                  </div>
                </div>

                <!-- Fecha de fin -->
                <div>
                  <label for="fecha_fin" class="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <input
                    id="fecha_fin"
                    v-model="form.fecha_fin"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.fecha_fin }"
                  />
                  <div v-if="errors.fecha_fin" class="text-red-500 text-xs mt-1">{{ errors.fecha_fin[0] }}</div>
                </div>

                <!-- Cargo -->
                <div>
                  <label for="cargo" class="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <select
                    id="cargo"
                    v-model="form.cargo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.cargo }"
                  >
                    <option value="">Seleccionar cargo</option>
                    <option v-for="cargo in cargoOptions" :key="cargo.id" :value="cargo.id">
                      {{ cargo.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.cargo" class="text-red-500 text-xs mt-1">{{ errors.cargo[0] }}</div>
                </div>

                <!-- Genérica -->
                <div>
                  <label for="generica" class="block text-sm font-medium text-gray-700 mb-1">
                    Genérica
                  </label>
                  <select
                    id="generica"
                    v-model="form.generica"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.generica }"
                  >
                    <option value="">Seleccionar genérica</option>
                    <option v-for="generica in genericaOptions" :key="generica.id" :value="generica.id">
                      {{ generica.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.generica" class="text-red-500 text-xs mt-1">{{ errors.generica[0] }}</div>
                </div>

                <!-- Régimen -->
                <div>
                  <label for="regimen" class="block text-sm font-medium text-gray-700 mb-1">
                    Régimen
                  </label>
                  <select
                    id="regimen"
                    v-model="form.regimen"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.regimen }"
                  >
                    <option value="">Seleccionar régimen</option>
                    <option v-for="regimen in regimenOptions" :key="regimen.id" :value="regimen.id">
                      {{ regimen.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.regimen" class="text-red-500 text-xs mt-1">{{ errors.regimen[0] }}</div>
                </div>
              </div>

              <!-- Columna 3 -->
              <div class="space-y-4">
                <!-- Condición -->
                <div>
                  <label for="condicion" class="block text-sm font-medium text-gray-700 mb-1">
                    Condición
                  </label>
                  <select
                    id="condicion"
                    v-model="form.condicion"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.condicion }"
                  >
                    <option value="">Seleccionar condición</option>
                    <option v-for="condicion in condicionOptions" :key="condicion.id" :value="condicion.id">
                      {{ condicion.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.condicion" class="text-red-500 text-xs mt-1">{{ errors.condicion[0] }}</div>
                </div>

                <!-- Profesión -->
                <div>
                  <label for="profesion" class="block text-sm font-medium text-gray-700 mb-1">
                    Profesión
                  </label>
                  <select
                    id="profesion"
                    v-model="form.profesion"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.profesion }"
                  >
                    <option value="">Seleccionar profesión</option>
                    <option v-for="profesion in profesionOptions" :key="profesion.id" :value="profesion.id">
                      {{ profesion.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.profesion" class="text-red-500 text-xs mt-1">{{ errors.profesion[0] }}</div>
                </div>

                <!-- Anexo -->
                <div>
                  <label for="anexo" class="block text-sm font-medium text-gray-700 mb-1">
                    Anexo
                  </label>
                  <select
                    id="anexo"
                    v-model="form.anexo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.anexo }"
                  >
                    <option value="">Seleccionar anexo</option>
                    <option v-for="anexo in anexoOptions" :key="anexo.id" :value="anexo.id">
                      {{ anexo.number }}
                    </option>
                  </select>
                  <div v-if="errors.anexo" class="text-red-500 text-xs mt-1">{{ errors.anexo[0] }}</div>
                </div>

                <!-- Salario -->
                <div>
                  <label for="salario" class="block text-sm font-medium text-gray-700 mb-1">
                    Salario
                  </label>
                  <input
                    id="salario"
                    v-model="form.salario"
                    type="text"
                    @input="formatSalario"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.salario }"
                  />
                  <div v-if="errors.salario" class="text-red-500 text-xs mt-1">{{ errors.salario[0] }}</div>
                </div>

                <!-- Número de contrato -->
                <div>
                  <label for="n_contrato" class="block text-sm font-medium text-gray-700 mb-1">
                    Número de Contrato
                  </label>
                  <input
                    id="n_contrato"
                    v-model="form.n_contrato"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.n_contrato }"
                  />
                  <div v-if="errors.n_contrato" class="text-red-500 text-xs mt-1">{{ errors.n_contrato[0] }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pestaña de Datos de Emergencia -->
          <div v-show="activeTab === 'emergency'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <!-- Contacto de emergencia -->
                <div>
                  <label for="cont_emergencia" class="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  <input
                    id="cont_emergencia"
                    v-model="form.cont_emergencia"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.cont_emergencia }"
                  />
                  <div v-if="errors.cont_emergencia" class="text-red-500 text-xs mt-1">{{ errors.cont_emergencia[0] }}</div>
                </div>
              </div>

              <div>
                <!-- Celular de emergencia -->
                <div>
                  <label for="cel_emergencia" class="block text-sm font-medium text-gray-700 mb-1">
                    Celular de Emergencia
                  </label>
                  <input
                    id="cel_emergencia"
                    v-model="form.cel_emergencia"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.cel_emergencia }"
                  />
                  <div v-if="errors.cel_emergencia" class="text-red-500 text-xs mt-1">{{ errors.cel_emergencia[0] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
  </ModalBase>

  <!-- Modal de confirmación para eliminar -->
  <ModalBase 
    :visible="showDeleteModal" 
    mode="delete" 
    entityName="personal"
    confirm-text="Eliminar Permanentemente" 
    :loading="isDeleting"
    @close="closeDeleteModal" 
    @confirm="proceedDelete"
  >
    <template #content>
      ¿Estás seguro de eliminar permanentemente al personal 
      <strong>{{ personalToDelete?.nombre }} {{ personalToDelete?.apellido }}</strong>?
      <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
        Esta acción no se puede deshacer y eliminará todos los datos asociados.
      </div>
    </template>
  </ModalBase>

  <!-- Modal para módulos -->
  <ModalBase 
    :visible="showModulosModal" 
    :mode="modalMode === 'habilitar' ? 'create' : 'edit'"
    :entityName="modalMode === 'habilitar' ? 'acceso' : 'módulos'"
    :confirm-text="modalMode === 'habilitar' ? 'Habilitar' : 'Actualizar'" 
    :loading="false"
    @close="closeModulosModal" 
    @confirm="confirmarAccionModulos" 
    width="600px"
  >
    <template #content>
      <div class="modulos-selection">
        <h6 class="text-lg font-medium mb-4">Seleccionar módulos para {{ selectedPerson?.nombre }} {{ selectedPerson?.apellido }}:</h6>
        <div class="modulos-list border border-gray-200 rounded-md p-4" style="max-height: 300px; overflow-y: auto;">
          <div v-if="personalStore.loading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-500">Cargando módulos...</p>
          </div>
          <div v-else>
            <div v-for="modulo in personalStore.modulos" :key="modulo.id" class="flex items-center mb-3">
              <input 
                type="checkbox" 
                :id="'modulo-' + modulo.id"
                :value="modulo.id" 
                v-model="selectedModulos"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label :for="'modulo-' + modulo.id" class="ml-2 block text-sm text-gray-900">
                <strong>{{ modulo.name || modulo.codename }}</strong> - {{ modulo.description }}
              </label>
            </div>
            <div v-if="personalStore.modulos.length === 0" class="text-center py-3 text-gray-500">
              No hay módulos disponibles
            </div>
          </div>
        </div>
        <div v-if="selectedModulos.length === 0 && !personalStore.loading" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <i class="fas fa-info-circle text-blue-600 mr-2"></i>
          Debe seleccionar al menos un módulo
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { usePersonalStore } from '@/stores/dgos/personalStore'
import CrudComponent from '@/components/ui/table/CrudLayout.vue'
import ModalBase from '@/components/ui/table/ModalBase.vue'
// import { usePersonalExports } from '@/components/utils/exportData'
//import { distritosLima } from "@/components/utils/distritos"
//import { calculateTimeWorked, formatCurrency, onlyNumbersDNI, onlyNumbersRUC, onlyNumbersCelular, onlyNumbersTelefono, formatDateToISO, parseDateFromISO } from "@/components/utils/format"

// const { exporting, exportExcel, exportCSV, exportPDF } = usePersonalExports()
const personalStore = usePersonalStore()
const crudRef = ref()

// Estados existentes
const showModal = ref(false)
const showDeleteModal = ref(false)
const showModulosModal = ref(false)
const editing = ref(false)
const isSubmitting = ref(false)
const personalToDelete = ref(null)
const personalToEdit = ref(null)
const isDeleting = ref(false)
const selectedPerson = ref(null)
const selectedModulos = ref([])
const modalMode = ref('habilitar')
const exporting = ref(false)
const activeTab = ref('basic')

// Tabs del formulario
const tabs = [
  { id: 'basic', name: 'Información General' },
  { id: 'contract', name: 'Datos Laborales' },
  { id: 'emergency', name: 'Emergencia' }
]

// Computed properties
const isSuperuser = computed(() => localStorage.getItem('is_superuser') === 'true')

const dependenciaOptions = computed(() => {
  return [...new Set(personalStore.personal.map(p => p.dependencia_nombre))].filter(Boolean)
})

const areaOptions = computed(() => {
  return [...new Set(personalStore.personal.map(p => p.area_nombre))].filter(Boolean)
})

const condicionOptions = computed(() => {
  return [...new Set(personalStore.personal.map(p => p.condicion_nombre))].filter(Boolean)
})

// Configuración del CRUD
const crudConfig = ref({
  title: 'GESTIÓN DE PERSONAL',
  description: 'Administra el personal del sistema',
  columns: [
    { key: 'dni', label: 'DNI', sortable: true, width: 'w-20' },
    { key: 'ruc', label: 'RUC', sortable: true, width: 'w-24' },
    { key: 'full_name', label: 'NOMBRE COMPLETO', sortable: true },
    { key: 'sexo', label: 'GÉNERO', sortable: true, width: 'w-20' },
    { key: 'fecha_nac', label: 'F. NACIMIENTO', sortable: true, type: 'date', width: 'w-32' },
    { key: 'celular', label: 'CELULAR', sortable: false, width: 'w-24' },
    { key: 'email', label: 'EMAIL', sortable: false },
    { key: 'dependencia_nombre', label: 'DEPENDENCIA', sortable: true },
    { key: 'area_nombre', label: 'AREA', sortable: true },
    { key: 'condicion_nombre', label: 'CONDICIÓN', sortable: true },
    ...(isSuperuser.value ? [{ key: 'acceso', label: 'ACCESO', sortable: true, width: 'w-24' }] : [])
  ],
  actions: [
    {
      name: 'edit',
      icon: 'fas fa-edit',
      color: 'text-blue-600 hover:bg-blue-50',
      handler: (item) => openEditModal(item)
    },
    {
      name: 'delete',
      icon: 'fas fa-trash',
      color: 'text-red-600 hover:bg-red-50',
      handler: (item) => confirmDelete(item)
    },
    {
      name: 'habilitar',
      icon: 'fas fa-key',
      color: 'text-green-600 hover:bg-green-50',
      condition: (item) => isSuperuser.value && !item.acceso && item.email,
      handler: (item) => openModalHabilitar(item)
    },
    {
      name: 'modulos',
      icon: 'fas fa-cog',
      color: 'text-purple-600 hover:bg-purple-50',
      condition: (item) => isSuperuser.value && item.acceso,
      handler: (item) => openModalEditarModulos(item)
    },
    {
      name: 'deshabilitar',
      icon: 'fas fa-times',
      color: 'text-orange-600 hover:bg-orange-50',
      condition: (item) => isSuperuser.value && item.acceso,
      handler: (item) => deshabilitarAcceso(item)
    },
    {
      name: 'reset-password',
      icon: 'fas fa-key',
      color: 'text-indigo-600 hover:bg-indigo-50',
      condition: (item) => isSuperuser.value && item.acceso,
      handler: (item) => resetearPassword(item)
    }
  ],
  filters: [
    {
      key: 'dependencia_nombre',
      label: 'Dependencia',
      type: 'select',
      options: dependenciaOptions.value.map(dep => ({ value: dep, label: dep }))
    },
    {
      key: 'area_nombre',
      label: 'Área',
      type: 'select',
      options: areaOptions.value.map(area => ({ value: area, label: area }))
    },
    {
      key: 'condicion_nombre',
      label: 'Condición',
      type: 'select',
      options: condicionOptions.value.map(cond => ({ value: cond, label: cond }))
    }
  ],
  formFields: []
})

// Definimos la estructura del formulario como constante
const FORM_STATE = {
  dni: '',
  ruc: '',
  nombre: '',
  apellido: '',
  email: '',
  email_per: '',
  sexo: '',
  fecha_nac: '',
  celular: '',
  telefono: '',
  direccion: '',
  distrito: '',
  padre_madre: '',
  n_hijos: '',
  dependencia: '',
  area: '',
  fecha_inicio: '',
  fecha_fin: '',
  estado: '',
  grupo_ocupacional: '',
  nivel: '',
  cargo: '',
  generica: '',
  regimen: '',
  condicion: '',
  profesion: '',
  anexo: '',
  salario: '',
  n_contrato: '',
  cont_emergencia: '',
  cel_emergencia: '',
  is_active: true
}

// Usamos la estructura para el formulario reactivo
const form = ref({ ...FORM_STATE })
const errors = ref({})

// Opciones para selects
const anexoOptions = ref([])
const nivelOptions = ref([])
const dependenciasOptions = ref([])
const areasOptions = ref([])
const profesionOptions = ref([])
const cargoOptions = ref([])
const regimenOptions = ref([])
const grupoOcupacionalOptions = ref([])
const estadoOptions = ref([])
const genericaOptions = ref([])

// Funciones del formulario
const resetForm = () => {
  form.value = { ...FORM_STATE }
  errors.value = {}
  activeTab.value = 'basic'
}

const openCreateModal = () => {
  resetForm()
  editing.value = false
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const openEditModal = async (personal) => {
  try {
    editing.value = true
    personalToEdit.value = personal

    // Resetear formulario primero
    resetForm()
    
    // Llenar el formulario con los datos del personal
    form.value = {
      ...personal,
      // Convertir nombre y apellido a mayúsculas
      nombre: personal.nombre ? personal.nombre.toUpperCase() : '',
      apellido: personal.apellido ? personal.apellido.toUpperCase() : '',
      fecha_nac: parseDateFromISO(personal.fecha_nac),
      fecha_inicio: parseDateFromISO(personal.fecha_inicio),
      fecha_fin: parseDateFromISO(personal.fecha_fin),
      dependencia: personal.dependencia?.id || personal.dependencia,
      area: personal.area?.id || personal.area,
      anexo: personal.anexo?.id || personal.anexo,
      condicion: personal.condicion?.id || personal.condicion,
      nivel: personal.nivel?.id || personal.nivel,
      profesion: personal.profesion?.id || personal.profesion,
      cargo: personal.cargo?.id || personal.cargo,
      regimen: personal.regimen?.id || personal.regimen,
      grupo_ocupacional: personal.grupo_ocupacional?.id || personal.grupo_ocupacional,
      estado: personal.estado?.id || personal.estado,
      generica: personal.generica?.id || personal.generica
    }

    console.log('Datos del formulario:', form.value)

    // Si hay dependencia, cargar sus áreas
    if (form.value.dependencia) {
      try {
        console.log('Cargando áreas para dependencia ID:', form.value.dependencia)
        const areasData = await personalStore.ListAreasByDependencia(form.value.dependencia)
        console.log('Áreas cargadas:', areasData)
        areasOptions.value = areasData

        // Esperar a que el DOM se actualice
        await nextTick()
      } catch (error) {
        console.error('Error loading areas for edit:', error)
        areasOptions.value = []
      }
    }

    showModal.value = true

  } catch (error) {
    console.error('Error al abrir modal de edición:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    // ================= VALIDACIONES PREVIAS =================
    const validationErrors = {}

    // Validar DNI (permitir ceros al inicio)
    if (form.value.dni) {
      const dniClean = form.value.dni.replace(/\D/g, '')
      if (dniClean.length !== 8) {
        validationErrors.dni = 'El DNI debe tener exactamente 8 dígitos'
      }
    }

    // Validar RUC (exactamente 11 dígitos si tiene valor)
    if (form.value.ruc) {
      const rucClean = form.value.ruc.replace(/\D/g, '')
      if (rucClean.length !== 11) {
        validationErrors.ruc = 'El RUC debe tener exactamente 11 dígitos'
      }
    }

    // Validar Celular (exactamente 9 dígitos si tiene valor)
    if (form.value.celular) {
      const celularClean = form.value.celular.replace(/\D/g, '')
      if (celularClean.length !== 9) {
        validationErrors.celular = 'El celular debe tener exactamente 9 dígitos'
      }
    }

    // Si hay errores de validación, NO enviar
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      return
    }

    // ================= PREPARAR DATOS PARA ENVIAR =================
    const submitData = {
      ...form.value,
      salario: getUnformattedSalario(),
      fecha_nac: formatDateToISO(form.value.fecha_nac),
      fecha_inicio: formatDateToISO(form.value.fecha_inicio),
      fecha_fin: formatDateToISO(form.value.fecha_fin),

      // Asegurar que los IDs sean números
      dependencia: form.value.dependencia ? parseInt(form.value.dependencia) : null,
      area: form.value.area ? parseInt(form.value.area) : null,
      condicion: form.value.condicion ? parseInt(form.value.condicion) : null,
      nivel: form.value.nivel ? parseInt(form.value.nivel) : null,
      profesion: form.value.profesion ? parseInt(form.value.profesion) : null,
      cargo: form.value.cargo ? parseInt(form.value.cargo) : null,
      regimen: form.value.regimen ? parseInt(form.value.regimen) : null,
      grupo_ocupacional: form.value.grupo_ocupacional ? parseInt(form.value.grupo_ocupacional) : null,
      estado: form.value.estado ? parseInt(form.value.estado) : null,
      generica: form.value.generica ? parseInt(form.value.generica) : null,

      // Mantener como strings para conservar formato
      dni: form.value.dni ? form.value.dni.replace(/\D/g, '') : null,
      ruc: form.value.ruc ? form.value.ruc.replace(/\D/g, '') : null,
      n_hijos: form.value.n_hijos ? parseInt(form.value.n_hijos.replace(/\D/g, '')) : null,
      celular: form.value.celular ? form.value.celular.replace(/\D/g, '') : null,
      telefono: form.value.telefono || null,
      cel_emergencia: form.value.cel_emergencia ? form.value.cel_emergencia.replace(/\D/g, '') : null
    }

    console.log('Datos a enviar:', submitData)

    if (editing.value) {
      await personalStore.UpdatePersonal(personalToEdit.value.id, submitData)
    } else {
      await personalStore.CreatePersonal(submitData)
    }

    closeModal()

  } catch (error) {
    if (error.response?.data) {
      errors.value = error.response.data
    } else {
      console.error('Error al guardar:', error)
    }
  } finally {
    isSubmitting.value = false
  }
}

// Funciones de utilidad
const convertToUppercase = (field) => {
  if (form.value[field]) {
    form.value[field] = form.value[field].toUpperCase()
  }
}

const handlePadreMadreChange = (event) => {
  if (form.value.padre_madre !== 'Si') {
    form.value.n_hijos = ''
  }
}

const formatSalario = (event) => {
  let input = event.target.value
  let numericValue = input.replace(/[^\d.]/g, '')
  
  const decimalParts = numericValue.split('.')
  if (decimalParts.length > 2) {
    numericValue = decimalParts[0] + '.' + decimalParts.slice(1).join('')
  }
  
  if (decimalParts.length === 2) {
    numericValue = decimalParts[0] + '.' + decimalParts[1].slice(0, 2)
  }
  
  if (numericValue) {
    const parts = numericValue.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    numericValue = parts.join('.')
  }
  
  form.value.salario = numericValue
}

const getUnformattedSalario = () => {
  if (!form.value.salario) return null
  return parseFloat(form.value.salario.replace(/,/g, ''))
}

const onDependenciaChange = async () => {
  if (form.value.dependencia) {
    try {
      const areasData = await personalStore.ListAreasByDependencia(form.value.dependencia)
      areasOptions.value = areasData
      
      // Limpiar área si no pertenece a la nueva dependencia
      if (form.value.area) {
        const areaExists = areasData.some(area => area.id == form.value.area)
        if (!areaExists) {
          form.value.area = ''
        }
      }
    } catch (error) {
      console.error('Error loading areas:', error)
      areasOptions.value = []
      form.value.area = ''
    }
  } else {
    areasOptions.value = []
    form.value.area = ''
  }
}

// Funciones de eliminación
const confirmDelete = (user) => {
  personalToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  personalToDelete.value = null
}

const proceedDelete = async () => {
  isDeleting.value = true
  try {
    if (personalToDelete.value) {
      await personalStore.DeletePersonal(personalToDelete.value.id)
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error al eliminar:', error)
  } finally {
    isDeleting.value = false
  }
}

// Funciones de módulos
const openModalHabilitar = (person) => {
  selectedPerson.value = person
  selectedModulos.value = []
  modalMode.value = 'habilitar'
  showModulosModal.value = true
}

const openModalEditarModulos = (person) => {
  selectedPerson.value = person
  modalMode.value = 'editar'
  if (person.user && person.user.modulos) {
    selectedModulos.value = person.user.modulos.map(modulo => modulo.id)
  } else {
    selectedModulos.value = []
  }
  showModulosModal.value = true
}

const closeModulosModal = () => {
  showModulosModal.value = false
  selectedPerson.value = null
  selectedModulos.value = []
}

const confirmarAccionModulos = async () => {
  if (!selectedPerson.value || selectedModulos.value.length === 0) return
  try {
    await personalStore.gestionarModulos(
      selectedPerson.value.id,
      selectedModulos.value,
      modalMode.value
    )
    closeModulosModal()
  } catch (error) {
    console.error('Error gestionando módulos:', error)
  }
}

const deshabilitarAcceso = async (person) => {
  if (!confirm(`¿Deshabilitar acceso a ${person.nombre} ${person.apellido}?`)) return
  try {
    await personalStore.deshabilitarAcceso(person)
  } catch (error) {
    console.error('Error al deshabilitar acceso:', error)
  }
}

const resetearPassword = async (person) => {
  if (!confirm(`¿Resetear contraseña de ${person.nombre} ${person.apellido}?`)) return
  try {
    await personalStore.resetearPassword(person)
  } catch (error) {
    console.error('Error al resetear contraseña:', error)
  }
}

// Funciones de exportación (placeholder)
const handleExportExcel = async () => {
  exporting.value = true
  try {
    console.log('Exportando a Excel...')
    // await exportExcel()
  } catch (error) {
    console.error('Error exportando Excel:', error)
  } finally {
    exporting.value = false
  }
}

const handleExportCSV = async () => {
  exporting.value = true
  try {
    console.log('Exportando a CSV...')
    // await exportCSV()
  } catch (error) {
    console.error('Error exportando CSV:', error)
  } finally {
    exporting.value = false
  }
}

const handleExportPDF = async () => {
  exporting.value = true
  try {
    console.log('Exportando a PDF...')
    // await exportPDF()
  } catch (error) {
    console.error('Error exportando PDF:', error)
  } finally {
    exporting.value = false
  }
}

// Event handlers del CRUD
const handleFilterChange = (filters) => {
  console.log('Filtros aplicados:', filters)
}

const handleFormSubmit = (event) => {
  console.log('Formulario enviado:', event)
}

const handleAction = (actionName, item) => {
  console.log(`Acción ${actionName} en item:`, item)
}

const handleSort = (columnKey) => {
  console.log('Ordenar por:', columnKey)
}

// Inicialización
onMounted(async () => {
  try {
    await personalStore.ListPersonal()
    await personalStore.ListModulos()

    // Cargar opciones de selects
    const [
      anexosData,
      condicionData,
      nivelData,
      dependenciasData,
      profesionData,
      cargoData,
      regimenData,
      grupoOcupacionalData,
      estadoData,
      genericaData
    ] = await Promise.all([
      personalStore.ListAnexos(),
      personalStore.ListCondicion(),
      personalStore.ListNivel(),
      personalStore.ListDependencias(),
      personalStore.ListProfesion(),
      personalStore.ListCargo(),
      personalStore.ListRegimen(),
      personalStore.ListGrupoOcupacional(),
      personalStore.ListEstado(),
      personalStore.ListGenerica()
    ])

    anexoOptions.value = anexosData
    condicionOptions.value = condicionData
    nivelOptions.value = nivelData
    dependenciasOptions.value = dependenciasData
    profesionOptions.value = profesionData
    cargoOptions.value = cargoData
    regimenOptions.value = regimenData
    grupoOcupacionalOptions.value = grupoOcupacionalData
    estadoOptions.value = estadoData
    genericaOptions.value = genericaData

  } catch (error) {
    console.error('Error loading data:', error)
  }
})

// Watchers
watch(() => form.value.dependencia, async (newDependencia) => {
  await onDependenciaChange()
}, { immediate: false })
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
.tab-content {
  min-height: 400px;
}

/* Asegurar que los inputs sean consistentes */
input, select {
  font-size: 0.875rem;
}

/* Mejorar la apariencia de los campos deshabilitados */
input:disabled, select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}
</style>