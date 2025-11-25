// stores/chatStore.ts - VERSIÓN TYPESCRIPT
import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import { api } from "@/components/services/Axios";
import notificationSoundFile from '@/assets/audios/notificacion/notificacion2.ogg';

// Interfaces para tipado
interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
  conversation_id: number;
}

interface TypingUser {
  id: number;
  username: string;
}

interface UnreadCounts {
  [participantId: string]: number;
}

export const useChatStore = defineStore("chat", () => {
  const socket: Ref<WebSocket | null> = ref(null);
  const currentConversationId: Ref<number | null> = ref(null);
  const messages: Ref<Message[]> = ref([]);
  const unreadCounts: Ref<UnreadCounts> = ref({});
  const currentChatParticipantId: Ref<number | null> = ref(null);
  const typingUsers: Ref<TypingUser[]> = ref([]);
  const notificationSound: Ref<HTMLAudioElement | null> = ref(null);
  
  const isChatDialogOpen: Ref<boolean> = ref(false);
  const currentOpenConversationId: Ref<number | null> = ref(null);

  const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  const initializeNotificationSound = (): void => {
    if (typeof Audio !== 'undefined') {
      notificationSound.value = new Audio(notificationSoundFile);
      notificationSound.value.volume = 0.7;
    }
  };

  const playNotificationSound = (): void => {
    if (notificationSound.value) {
      notificationSound.value.currentTime = 0;
      notificationSound.value.play().catch((error: Error) => {
        console.log('Error reproduciendo sonido:', error);
      });
    }
  };

  const setChatDialogOpen = (isOpen: boolean, conversationId: number | null = null): void => {
    isChatDialogOpen.value = isOpen;
    currentOpenConversationId.value = conversationId;
    
    if (!isOpen && conversationId) {
      markMessagesAsRead(conversationId);
    }
  };

  // Método reactivo para actualizar contadores
  const updateUnreadCounts = (counts: UnreadCounts): void => {
    unreadCounts.value = { ...unreadCounts.value, ...counts };
  };

  // Método reactivo para incrementar contador
  const incrementUnreadCount = (participantId: number): void => {
    if (participantId) {
      const newCounts = { ...unreadCounts.value };
      const currentCount = newCounts[participantId] || 0;
      newCounts[participantId] = currentCount + 1;
      unreadCounts.value = newCounts;
      
      console.log('✅ Contador incrementado para usuario:', participantId, 'Nuevo valor:', newCounts[participantId]);
    }
  };

  // Método reactivo para resetear contador
  const resetUnreadCount = (participantId: number): void => {
    if (participantId) {
      const newCounts = { ...unreadCounts.value };
      newCounts[participantId] = 0;
      unreadCounts.value = newCounts;
      
      console.log('✅ Contador reseteado para usuario:', participantId);
    }
  };

  const loadMessages = async (conversationId: number): Promise<void> => {
    try {
      const { data } = await api.get(
        `componentes/conversations/${conversationId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      
      messages.value = data.messages.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      if (currentChatParticipantId.value) {
        resetUnreadCount(currentChatParticipantId.value);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  };

  const getOrCreateConversation = async (participantId: number): Promise<number> => {
    try {
      const { data } = await api.post(
        "componentes/conversations/get_or_create/",
        { participant_id: participantId }
      );
      currentConversationId.value = data.conversation_id;
      currentChatParticipantId.value = participantId;

      if (data.unread_count !== undefined) {
        updateUnreadCounts({ [participantId]: data.unread_count });
      }

      return data.conversation_id;
    } catch (error) {
      console.error('Error al obtener/conversación:', error);
      throw error;
    }
  };

  const loadUnreadCounts = async (): Promise<void> => {
    try {
      const { data } = await api.get(
        "componentes/conversations/unread_counts/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      updateUnreadCounts(data.unread_counts);
    } catch (error) {
      console.error("Error al carcar conteos de no leídos:", error);
    }
  };

  const connectToChat = (conversationId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket.value) socket.value.close();

      if (!notificationSound.value) {
        initializeNotificationSound();
      }

      const token = localStorage.getItem("auth_token");
      const base = import.meta.env.VITE_API_URL_WS_CHAT ||
        `${window.location.protocol === "https:" ? "wss://" : "ws://"}${
          window.location.host
        }/ws/chat/`;

      const wsUrl = `${base}${conversationId}/`;

      try {
        socket.value = new WebSocket(wsUrl);

        socket.value.onopen = (): void => {
          socket.value?.send(JSON.stringify({ type: "authenticate", token }));
          console.log('✅ WebSocket de chat conectado para conversación:', conversationId);
          resolve();
        };

        socket.value.onmessage = (event: MessageEvent): void => {
          try {
            const data = JSON.parse(event.data);
            const myUserId = localStorage.getItem("user_id");

            if (data.type === "chat_message") {
              const newMessage: Message = {
                id: data.message_id,
                content: data.message,
                sender_id: data.sender_id,
                sender_username: data.sender_username,
                timestamp: data.timestamp,
                conversation_id: data.conversation_id
              };

              messages.value.push(newMessage);
              messages.value.sort((a: Message, b: Message) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );

              // LÓGICA MEJORADA CON MÁS LOGS PARA DEBUG
              if (data.sender_id.toString() !== myUserId) {
                const isFromCurrentConversation = currentConversationId.value === data.conversation_id;
                const isChatCurrentlyOpen = isChatDialogOpen.value && 
                  currentOpenConversationId.value === data.conversation_id;

                console.log('📨 Mensaje recibido:', {
                  de: data.sender_id,
                  para: myUserId,
                  conversaciónActual: currentConversationId.value,
                  conversaciónMensaje: data.conversation_id,
                  chatAbierto: isChatCurrentlyOpen,
                  esConversaciónActual: isFromCurrentConversation
                });

                if (!isChatCurrentlyOpen || !isFromCurrentConversation) {
                  console.log('🔔 Notificando mensaje no leído');
                  playNotificationSound();
                  incrementUnreadCount(data.sender_id);
                } else {
                  console.log('✅ Mensaje en chat abierto - marcando como leído');
                  markMessagesAsRead(data.conversation_id);
                }
              } else {
                console.log('📤 Mensaje enviado por mí - ignorando notificación');
              }

            } else if (data.type === "user_typing") {
              handleTypingEvent(data);
            }
          } catch (err) {
            console.error("Error procesando mensaje:", err);
          }
        };

        const handleTypingEvent = (data: any): void => {
          if (data.is_typing) {
            if (!typingUsers.value.some(user => user.id === data.user_id)) {
              typingUsers.value.push({
                id: data.user_id,
                username: data.username
              });
            }
          } else {
            typingUsers.value = typingUsers.value.filter(user => user.id !== data.user_id);
          }
        };

        socket.value.onerror = (err: Event): void => {
          console.error("Error en WebSocket:", err);
          reject(err);
        };

        socket.value.onclose = (): void => {
          console.log("Conexión de chat cerrada");
          currentChatParticipantId.value = null;
          typingUsers.value = [];
          isChatDialogOpen.value = false;
          currentOpenConversationId.value = null;
        };
      } catch (err) {
        console.error("Error al conectar:", err);
        reject(err);
      }
    });
  };

  const sendMessage = (content: string): void => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          type: "chat_message",
          message: content,
        })
      );
    } else {
      throw new Error("Conexión de chat no disponible");
    }
  };

  const sendTyping = (isTyping: boolean): void => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          type: "typing",
          is_typing: isTyping,
        })
      );
    }
  };

  const disconnect = (): void => {
    if (socket.value) socket.value.close();
    socket.value = null;
    currentConversationId.value = null;
    currentChatParticipantId.value = null;
    messages.value = [];
    typingUsers.value = [];
    isChatDialogOpen.value = false;
    currentOpenConversationId.value = null;
  };

  const markMessagesAsRead = async (conversationId: number): Promise<void> => {
    try {
      await api.post(
        `componentes/conversations/${conversationId}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      
      if (currentChatParticipantId.value) {
        resetUnreadCount(currentChatParticipantId.value);
      }
      
      await loadUnreadCounts();
      
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  return {
    socket,
    currentConversationId,
    messages,
    unreadCounts,
    typingUsers,
    sortedMessages,
    isChatDialogOpen,
    currentOpenConversationId,
    loadMessages,
    getOrCreateConversation,
    loadUnreadCounts,
    connectToChat,
    sendMessage,
    sendTyping,
    disconnect,
    updateUnreadCounts,
    markMessagesAsRead,
    setChatDialogOpen,
    incrementUnreadCount,
    resetUnreadCount,
    playNotificationSound,
  };
});

// Exportar tipos para uso externo
export type { Message, TypingUser, UnreadCounts };