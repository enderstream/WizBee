import { create } from 'zustand'

interface SettingsState {
    showProfileModal: boolean
    showLogoutModal: boolean
    showDeleteModal: boolean
    isLoading: boolean
    statusMessage: string
    setShowProfileModal: (show: boolean) => void
    setShowLogoutModal: (show: boolean) => void
    setShowDeleteModal: (show: boolean) => void
    setIsLoading: (loading: boolean) => void
    setStatusMessage: (message: string) => void
    resetState: () => void
}

const initialState = {
    showProfileModal: false,
    showLogoutModal: false,
    showDeleteModal: false,
    isLoading: false,
    statusMessage: ''
}

export const useSettingsState = create<SettingsState>((set) => ({
    ...initialState,
    setShowProfileModal: (show) => set({ showProfileModal: show }),
    setShowLogoutModal: (show) => set({ showLogoutModal: show }),
    setShowDeleteModal: (show) => set({ showDeleteModal: show }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setStatusMessage: (message) => set({ statusMessage: message }),
    resetState: () => set(initialState)
}))