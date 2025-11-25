<template>
  <div class="connection-manager">
    <slot
      :isOnline="isOnline"
      :isApiConnected="isApiConnected"
      :isCheckingApi="isCheckingApi"
      :isCheckingNetwork="isCheckingNetwork"
      :lastApiCheck="lastApiCheck"
      :lastNetworkChange="lastNetworkChange"
      :checkApiConnection="checkApiConnection"
      :checkNetworkConnection="checkRealNetworkStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { useConnection } from './useConnection'

const {
  isOnline,
  isApiConnected,
  isCheckingApi,
  isCheckingNetwork,
  lastApiCheck,
  lastNetworkChange,
  checkApiConnection,
  checkRealNetworkStatus
} = useConnection()
</script>