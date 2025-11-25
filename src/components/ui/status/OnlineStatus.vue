<template>
  <div class="floating-users-panel" :class="{ 'panel-collapsed': isCollapsed }" ref="panelRef"
    :style="{ top: panelTop + 'px' }">
    <div class="panel-content">
      <div class="panel-header" @mousedown="startHeaderDrag" @click="handleHeaderClick">
        <i class="pi pi-users"></i>
        <span>Usuarios ({{ onlineCount }})</span>
      </div>

      <div class="panel-body">
        <div v-if="loading" class="loading-indicator">
          <ProgressSpinner style="width: 30px; height: 30px" />
        </div>
        <div v-else-if="onlineUsers.length === 0" class="empty-message">
          <i class="pi pi-users mr-2"></i>
          No hay usuarios conectados
        </div>
        <div v-else class="users-list">
          <!-- En tu template, cambiar las referencias a los contadores -->
          <div v-for="user in onlineUsers.filter(u => u.id !== myUserId)" :key="user.id" class="user-item">
            <Badge severity="success" class="mr-2"></Badge>
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <span class="fullname">{{ user.fullname }}</span>
            </div>
            <div class="user-actions">
              <span v-if="user.device_count > 1" class="connection-count">
                {{ user.device_count }}x
              </span>
              <!-- CORRECCIÓN: Usar reactiveUnreadCounts en lugar de chatStore.unreadCounts -->
              <Badge v-if="reactiveUnreadCounts[user.id] > 0" :value="reactiveUnreadCounts[user.id]" severity="danger"
                class="mr-2 unread-badge" />
              <Button v-if="user.id !== myUserId" icon="pi pi-comments" class="p-button-text p-button-sm chat-button"
                @click="startChat(user)" v-tooltip="'Iniciar chat'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="panel-toggle-button" :class="{ 'is-collapsed': isCollapsed }" @mousedown="startDrag"
      @click="handleButtonClick">
      <i class="pi pi-users"></i>
      <span v-if="onlineCount > 0" class="badge users-count">{{ onlineCount }}</span>
      <span v-if="totalUnreadCount > 0" class="badge unread-count">{{ totalUnreadCount }}</span>
    </button>

    <Toast />

    <!-- Dialog de Chat -->
    <Dialog v-model:visible="chatVisible" :header="'Chat con ' + currentChatUser?.username"
      :style="{ width: '500px', maxWidth: '90vw' }" :modal="true" class="telegram-chat-dialog" @show="onChatShow"
      @hide="onChatHide">
      <div class="telegram-chat-container">
        <!-- Header del chat -->
        <div class="telegram-chat-header">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-info">
            <div class="username">{{ currentChatUser?.username }}</div>
            <div class="status" :class="{ 'offline': !isUserOnline(currentChatUser?.id) }">
              {{ isUserOnline(currentChatUser?.id) ? 'En línea' : 'Desconectado' }}
            </div>
          </div>
          <div class="header-actions">
            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain" />
          </div>
        </div>

        <!-- Área de mensajes -->
        <div class="telegram-messages-container" ref="messagesContainer">
          <div class="messages-wrapper">
            <div v-for="message in chatStore.sortedMessages" :key="message.id" class="message-container"
              :class="{ 'sent': message.sender_id == myUserId, 'received': message.sender_id != myUserId }">

              <!-- Mensaje RECIBIDO -->
              <div v-if="message.sender_id != myUserId" class="message received">
                <div class="message-avatar">
                  <i class="pi pi-user"></i>
                </div>
                <div class="message-content">
                  <div class="sender-name">{{ getSenderName(message.sender_id) }}</div>
                  <div class="message-bubble received-bubble">
                    <div class="message-text">{{ message.content }}</div>
                    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                  </div>
                </div>
              </div>

              <!-- Mensaje ENVIADO -->
              <div v-else class="message sent">
                <div class="message-content">
                  <div class="message-bubble sent-bubble">
                    <div class="message-text">{{ message.content }}</div>
                    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                  </div>
                </div>
                <div class="message-avatar">
                  <i class="pi pi-user"></i>
                </div>
              </div>
            </div>

            <!-- Indicador de escritura -->
            <div v-if="chatStore.typingUsers.length > 0" class="typing-indicator">
              <div class="message received">
                <div class="message-avatar">
                  <i class="pi pi-user"></i>
                </div>
                <div class="message-content">
                  <div class="sender-name">{{ getTypingUsersText }}</div>
                  <div class="message-bubble received-bubble typing-bubble">
                    <div class="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de entrada de mensajes -->
        <div class="telegram-input-container">
          <div class="input-actions">
            <Button icon="pi pi-paperclip" class="p-button-text attachment-btn" />
          </div>
          <div class="message-input-wrapper">
            <InputText v-model="newMessage" placeholder="Escribe un mensaje..." @keypress.enter="sendMessage"
              class="telegram-input" @input="handleTyping" />
          </div>
          <div class="send-button-wrapper">
            <Button icon="pi pi-send" @click="sendMessage" class="telegram-send-btn" :disabled="!newMessage.trim()" />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import loginSoundFile from '@/assets/audios/notificacion/login.ogg'
import logoutSoundFile from '@/assets/audios/notificacion/logout.ogg'
import { useChatStore } from '@/stores/general/chatStore'

const chatStore = useChatStore()
const toast = useToast()

// Refs
const chatVisible = ref(false)
const currentChatUser = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)
const onlineUsers = ref([])
const loading = ref(true)
const isCollapsed = ref(true)
const panelRef = ref(null)
const panelTop = ref(0)
const isDragging = ref(false)
const hasDragged = ref(false)
const dragStartY = ref(0)
const dragStartTop = ref(0)
const currentConnectionId = ref(null)
const isConnected = ref(false)
const loginSound = ref(null)
const logoutSound = ref(null)
const previousUsers = ref(new Map())
const firstLoad = ref(true)
const myUserId = ref(Number(localStorage.getItem('user_id')))
const typingTimeout = ref(null)
const userCache = ref(new Map())
const reactiveUnreadCounts = computed(() => chatStore.unreadCounts)

// WebSocket variables
let socket = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 3000
let heartbeatInterval = null

// Computed properties - SIMPLIFICADO (usar el getter del store)
const totalUnreadCount = computed(() => {
  if (!reactiveUnreadCounts.value) return 0
  return Object.values(reactiveUnreadCounts.value).reduce((total, count) => total + count, 0)
})

const onlineCount = computed(() => {
  return onlineUsers.value.filter(user => user.id !== myUserId.value).length
})

const getTypingUsersText = computed(() => {
  const users = chatStore.typingUsers
  if (users.length === 0) return ''

  if (users.length === 1) {
    return `${users[0].username} está escribiendo...`
  } else if (users.length === 2) {
    return `${users[0].username} y ${users[1].username} están escribiendo...`
  } else {
    return `${users[0].username} y ${users.length - 1} más están escribiendo...`
  }
})

// Función faltante: Verificar si un usuario está online
const isUserOnline = (userId) => {
  if (!userId) return false
  // Convertir a número para comparación segura
  const numericUserId = Number(userId)
  return onlineUsers.value.some(user => Number(user.id) === numericUserId)
}
// Obtener nombre del remitente
const getSenderName = (senderId) => {
  const onlineUser = onlineUsers.value.find(user => user.id === senderId)
  if (onlineUser) {
    userCache.value.set(senderId, onlineUser)
    return onlineUser.fullname || onlineUser.username
  }

  const cachedUser = userCache.value.get(senderId)
  if (cachedUser) {
    return cachedUser.fullname || cachedUser.username
  }

  return `Usuario ${senderId}`
}

// Panel drag functions
const startHeaderDrag = (e) => {
  if (e.button !== 0) return
  isDragging.value = true
  hasDragged.value = false
  dragStartY.value = e.clientY
  dragStartTop.value = panelTop.value

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (e) => {
  if (!isDragging.value) return
  const deltaY = e.clientY - dragStartY.value
  const newTop = dragStartTop.value + deltaY
  const maxTop = window.innerHeight - (panelRef.value?.offsetHeight || 44)
  panelTop.value = Math.min(Math.max(0, newTop), maxTop)
  hasDragged.value = true
}

const stopDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Panel toggle functions
const togglePanel = () => { isCollapsed.value = !isCollapsed.value }

const handleHeaderClick = (e) => {
  if (hasDragged.value) {
    e.preventDefault()
    hasDragged.value = false
  } else {
    togglePanel()
  }
}

const handleButtonClick = handleHeaderClick

// Mejorar la generación del connection_id
const generateConnectionId = () => {
  const user_id = localStorage.getItem('user_id')
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `user_${user_id}_${timestamp}_${random}`
}

// En el método connectWebSocket del componente Vue
const connectWebSocket = () => {
  const token = localStorage.getItem('auth_token')
  if (!token || (socket && socket.readyState === WebSocket.OPEN)) {
    return
  }

  if (socket) {
    socket.close()
    if (heartbeatInterval) clearInterval(heartbeatInterval)
  }

  const wsUrl = import.meta.env.VITE_API_URL_WS_URL ||
    `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/ws/online-status/`

  try {
    socket = new WebSocket(wsUrl)
    currentConnectionId.value = generateConnectionId()

    socket.onopen = () => {
      console.log('WebSocket conectado con ID:', currentConnectionId.value)
      reconnectAttempts = 0
      isConnected.value = true

      // Enviar autenticación con el connection_id
      socket.send(JSON.stringify({
        type: 'authenticate',
        token,
        connection_id: currentConnectionId.value // Cambiado a connection_id
      }))

      // Heartbeat más frecuente para evitar timeouts
      heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'heartbeat',
            connection_id: currentConnectionId.value // 
          }))
        }
      }, 25000) // Reducido a 25 segundos
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'online_users') {
          detectUserChanges(data.users)
          onlineUsers.value = data.users

          data.users.forEach(user => {
            userCache.value.set(user.id, user)
          })
          loading.value = false
        } else if (data.type === 'authentication_success') {
          console.log('Autenticación exitosa, connection_id:', data.connection_id)

          // 🔥 USAR el connection_id del servidor si está disponible
          if (data.connection_id) {
            currentConnectionId.value = data.connection_id
            console.log('✅ Connection ID establecido por servidor:', currentConnectionId.value)
          } else {
            console.warn('⚠️ Servidor no envió connection_id, usando el local:', currentConnectionId.value)
          }
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e)
      }
    }

    socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event.code, event.reason)
      isConnected.value = false
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
        heartbeatInterval = null
      }

      // Reconexión más agresiva para conexiones perdidas
      if (reconnectAttempts < maxReconnectAttempts) {
        const delay = Math.min(reconnectDelay * Math.pow(1.5, reconnectAttempts), 30000)
        setTimeout(() => {
          reconnectAttempts++
          console.log(`Reconectando (intento ${reconnectAttempts}/${maxReconnectAttempts})...`)
          connectWebSocket()
        }, delay)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }
  } catch (error) {
    console.error('Error al crear WebSocket:', error)
  }
}

// Chat functions
const handleTyping = () => {
  if (chatStore.socket && chatStore.socket.readyState === WebSocket.OPEN) {
    clearTimeout(typingTimeout.value)
    chatStore.sendTyping(true)

    typingTimeout.value = setTimeout(() => {
      chatStore.sendTyping(false)
    }, 1000)
  }
}



const sendMessage = () => {
  if (!newMessage.value.trim() || !currentChatUser.value) return
  try {
    chatStore.sendMessage(newMessage.value)
    newMessage.value = ''
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
      typingTimeout.value = null
    }
    chatStore.sendTyping(false)
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar', life: 3000 })
  }
}

// En el método startChat del componente
const startChat = async (user) => {
  if (!user || !user.id || Number(user.id) === Number(myUserId.value)) {
    return;
  }

  currentChatUser.value = user;
  try {
    const conversationId = await chatStore.getOrCreateConversation(user.id);
    await chatStore.loadMessages(conversationId);
    await chatStore.connectToChat(conversationId);

    // IMPORTANTE: Marcar el chat como abierto ANTES de mostrar el diálogo
    chatStore.setChatDialogOpen(true, conversationId);
    chatVisible.value = true;

  } catch (error) {
    console.error('Error al iniciar chat:', error);
  }
};

// En onChatHide
const onChatHide = () => {
  // IMPORTANTE: Marcar el chat como cerrado
  if (chatStore.currentConversationId) {
    chatStore.setChatDialogOpen(false, chatStore.currentConversationId);
  }
  chatStore.loadUnreadCounts();
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
    typingTimeout.value = null;
  }
};

const onChatShow = async () => {
  if (currentChatUser.value && chatStore.currentConversationId) {
    // Marcar mensajes como leídos al abrir el chat
    await chatStore.markMessagesAsRead(chatStore.currentConversationId);
    // Resetear contador específico
    chatStore.resetUnreadCount(currentChatUser.value.id);
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
  }
};

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// User change detection
const detectUserChanges = (newUsers) => {
  const currentUsersMap = new Map(newUsers.filter(u => u.id !== myUserId.value).map(u => [u.id, u]))
  if (!firstLoad.value) {
    for (const [id, u] of currentUsersMap) {
      if (!previousUsers.value.has(id)) {
        showUserNotification(u, 'conectado')
        playLoginSound()
      }
    }
    for (const [id, u] of previousUsers.value) {
      if (!currentUsersMap.has(id)) {
        showUserNotification(u, 'desconectado')
        playLogoutSound()
      }
    }
  }
  previousUsers.value = currentUsersMap
  firstLoad.value = false
}

const playLoginSound = () => { loginSound.value?.play().catch(() => { }) }
const playLogoutSound = () => { logoutSound.value?.play().catch(() => { }) }

const showUserNotification = (user, action) => {
  toast.add({
    severity: action === 'conectado' ? 'info' : 'warn',
    summary: `Usuario ${action}`,
    detail: `${user.fullname || user.username} se ha ${action}`,
    life: 4000
  })
}

// Lifecycle
onMounted(() => {
  loginSound.value = new Audio(loginSoundFile)
  logoutSound.value = new Audio(logoutSoundFile)
  panelTop.value = window.innerHeight / 2 - 22
  connectWebSocket()
  chatStore.loadUnreadCounts()

  window.addEventListener('resize', () => {
    panelTop.value = Math.min(panelTop.value, window.innerHeight - 44)
  })
})

onUnmounted(() => {
  socket?.close()
  if (heartbeatInterval) clearInterval(heartbeatInterval)
  loginSound.value?.pause()
  logoutSound.value?.pause()
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  clearTimeout(typingTimeout.value)
  chatStore.disconnect()
})

// Watch para scroll automático
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})
watch(chatVisible, (newVal) => {
  if (newVal && chatStore.currentConversationId) {
    // Chat se abre
    chatStore.setChatDialogOpen(true, chatStore.currentConversationId);
  } else if (!newVal && chatStore.currentConversationId) {
    // Chat se cierra
    chatStore.setChatDialogOpen(false, chatStore.currentConversationId);
  }
});
// En el componente, agregar este watch para debug
watch(reactiveUnreadCounts, (newCounts) => {
  console.log('🔄 Contadores actualizados:', newCounts)
}, { deep: true })
</script>

<style scoped>
.floating-users-panel {
  position: fixed;
  right: 0;
  z-index: 9999;
  display: flex;
  contain: layout;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

.panel-content {
  width: 200px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-right: none;
  overflow: hidden;
  backdrop-filter: blur(5px);
  transform-origin: right center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  pointer-events: auto;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-weight: 600;
  color: #2d3748;
  user-select: none;
}

.panel-header i {
  margin-right: 0.5rem;
  color: #3B82F6;
}

.panel-body {
  max-height: 400px;
  overflow: hidden;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
}

.users-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 0.75rem;
  flex-grow: 1;
  min-width: 0;
}

.username {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a202c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fullname {
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.unread-badge {
  margin-right: 8px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7rem;
}

.connection-count {
  background: #e2e8f0;
  color: #4a5568;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  margin-right: 8px;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.empty-message {
  padding: 1.5rem;
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.empty-message i {
  margin-right: 0.5rem;
}

.panel-toggle-button {
  position: absolute;
  right: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  border: none;
  border-radius: 50% 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  clip-path: circle(71% at 50% 50%);
}

.panel-toggle-button .users-count {
  position: absolute;
  top: -3px;
  right: -6px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid white;
}

.panel-toggle-button .unread-count {
  position: absolute;
  top: -2px;
  left: -6px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

.panel-collapsed .panel-content {
  transform: translateX(100%);
  opacity: 0;
  width: 0;
  border: none;
  padding: 0;
  margin: 0;
  pointer-events: none;
}

/* CONTENEDOR PRINCIPAL DEL CHAT */
.telegram-chat-container {
  height: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* HEADER DEL CHAT */
.telegram-chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #54a4e3;
  color: white;
  border-bottom: 1px solid #e0e0e0;
}

.telegram-chat-header .user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.telegram-chat-header .user-info {
  flex: 1;
}

.telegram-chat-header .user-info .username {
  font-weight: 600;
  font-size: 1.1rem;
}

.telegram-chat-header .user-info .status {
  font-size: 0.85rem;
  opacity: 0.9;
}

.telegram-chat-header .user-info .status.offline {
  opacity: 0.7;
}

/* CONTENEDOR DE MENSAJES - CORREGIDO */
.telegram-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #e6ebf5;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0);
  background-size: 20px 20px;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: min-content;
}

/* CONTENEDOR DE CADA MENSAJE */
.message-container {
  display: flex;
  width: 100%;
}

.message-container.received {
  justify-content: flex-start;
}

.message-container.sent {
  justify-content: flex-end;
}

/* ESTRUCTURA BASE DEL MENSAJE */
.message {
  display: flex;
  max-width: 80%;
  gap: 8px;
  align-items: flex-start;
}

/* MENSAJE RECIBIDO (OTRO USUARIO) */
.received-message {
  flex-direction: row;
}

/* MENSAJE ENVIADO (YO) */
.sent-message {
  flex-direction: row-reverse;
}

/* AVATAR */
.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #54a4e3, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* CONTENIDO DEL MENSAJE */
.message-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* NOMBRE DEL REMITENTE (solo recibidos) */
.sender-name {
  font-size: 12px;
  font-weight: 600;
  color: #54a4e3;
  margin-bottom: 4px;
  margin-left: 4px;
}

/* BURBUJA DE MENSAJE */
.message-bubble {
  padding: 8px 12px;
  border-radius: 18px;
  word-break: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

/* BURBUJA RECIBIDA */
.received-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  border: 1px solid #e0e0e0;
}

/* BURBUJA ENVIADA */
.sent-bubble {
  background: linear-gradient(135deg, #54a4e3, #3b82f6);
  color: white;
  border-bottom-right-radius: 4px;
}

/* TEXTO DEL MENSAJE */
.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 2px;
}

/* HORA DEL MENSAJE */
.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  margin-top: 2px;
}

.received-bubble .message-time {
  text-align: left;
}

/* INDICADOR DE ESCRITURA */
.typing-indicator {
  opacity: 0.7;
}

.typing-bubble {
  padding: 8px 16px;
  min-width: 60px;
}

.typing-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #666;
  animation: typing-dot 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-dot {

  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ÁREA DE ENTRADA DE MENSAJES */
.telegram-input-container {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

.telegram-input-container .telegram-input {
  flex: 1;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  padding: 10px 16px;
  background: white;
  width: 100%;

}

.message-input-wrapper {
  flex: 1;
  /* Esto hace que ocupe todo el espacio disponible */
  width: 100%;
}

.telegram-send-btn {
  background: #54a4e3;
  border-color: #54a4e3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.telegram-send-btn:disabled {
  background: #ccc;
  border-color: #ccc;
  opacity: 0.5;
}

.telegram-send-btn:not(:disabled):hover {
  background: #3a8bc8;
  border-color: #3a8bc8;
}

/* SCROLLBAR */
.telegram-messages-container::-webkit-scrollbar {
  width: 6px;
}

.telegram-messages-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.telegram-messages-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.telegram-messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .message {
    max-width: 90%;
  }

  .telegram-messages-container {
    padding: 12px;
  }

  .message-bubble {
    padding: 6px 10px;
  }
}

/* EFECTOS HOVER */
.message-bubble {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>