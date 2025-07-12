'use client'

import { useEffect } from 'react'
import { useOnlineStatus } from './offline-detector'

interface BackgroundSyncData {
  type: 'wallet-action' | 'mission-complete' | 'user-action'
  data: any
  timestamp: number
  id: string
}

// IndexedDB helper functions
const DB_NAME = 'blackpink-app-sync'
const DB_VERSION = 1
const STORE_NAME = 'pending-actions'

class SyncManager {
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  async addPendingAction(action: BackgroundSyncData) {
    if (!this.db) await this.init()
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(action)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getPendingActions(): Promise<BackgroundSyncData[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async removePendingAction(id: string) {
    if (!this.db) await this.init()
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clearPendingActions() {
    if (!this.db) await this.init()
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

const syncManager = new SyncManager()

export function BackgroundSync() {
  const isOnline = useOnlineStatus()

  useEffect(() => {
    syncManager.init().catch(console.error)
  }, [])

  useEffect(() => {
    if (isOnline) {
      processPendingActions()
    }
  }, [isOnline])

  const processPendingActions = async () => {
    try {
      const pendingActions = await syncManager.getPendingActions()
      
      for (const action of pendingActions) {
        try {
          await processAction(action)
          await syncManager.removePendingAction(action.id)
          console.log('Synced action:', action.type)
        } catch (error) {
          console.error('Failed to sync action:', action.type, error)
          // Keep in queue for next sync attempt
        }
      }
    } catch (error) {
      console.error('Failed to process pending actions:', error)
    }
  }

  const processAction = async (action: BackgroundSyncData) => {
    switch (action.type) {
      case 'wallet-action':
        return await syncWalletAction(action.data)
      case 'mission-complete':
        return await syncMissionComplete(action.data)
      case 'user-action':
        return await syncUserAction(action.data)
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  const syncWalletAction = async (data: any) => {
    // Sync wallet-related actions
    const response = await fetch('/api/wallet/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync wallet action')
    }
    
    return response.json()
  }

  const syncMissionComplete = async (data: any) => {
    // Sync mission completions
    const response = await fetch('/api/missions/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync mission completion')
    }
    
    return response.json()
  }

  const syncUserAction = async (data: any) => {
    // Sync general user actions
    const response = await fetch('/api/user/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync user action')
    }
    
    return response.json()
  }

  return null // This component doesn't render anything
}

// Hook to queue actions for background sync
export function useBackgroundSync() {
  const queueAction = async (type: BackgroundSyncData['type'], data: any) => {
    const action: BackgroundSyncData = {
      type,
      data,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    try {
      await syncManager.addPendingAction(action)
      
      // Register background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register(`${type}-sync`)
      }
      
      console.log('Action queued for background sync:', type)
    } catch (error) {
      console.error('Failed to queue action for sync:', error)
      throw error
    }
  }

  const forceSync = async () => {
    // Trigger immediate sync attempt
    const pendingActions = await syncManager.getPendingActions()
    console.log(`Forcing sync of ${pendingActions.length} pending actions`)
    
    // This would trigger the sync process
    window.dispatchEvent(new CustomEvent('force-sync'))
  }

  return { queueAction, forceSync }
}

// Utility function to check if background sync is supported
export function isBackgroundSyncSupported() {
  return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
}