import { create } from 'zustand'

type MachineStore = {
    isRegistering: boolean
    serialNumber: string
    isLoading: boolean
    errorMessage: string | null

    setIsRegistering: (isRegistering: boolean) => void
    setSerialNumber: (serialNumber: string) => void
    setIsLoading: (isLoading: boolean) => void
    setErrorMessage: (errorMessage: string | null) => void
    resetMachineState: () => void
}

export const useMachineStore = create<MachineStore>((set) => ({
    isRegistering: false,
    serialNumber: '',
    isLoading: false,
    errorMessage: null,

    setIsRegistering: (isRegistering) => set({ isRegistering }),
    setSerialNumber: (serialNumber) => set({ serialNumber }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setErrorMessage: (errorMessage) => set({ errorMessage }),
    resetMachineState: () => set({
        serialNumber: '',
        isLoading: false,
        errorMessage: null
    })
}))

// 선택자 함수들
export const selectIsRegistering = (state: MachineStore) => state.isRegistering
export const selectSerialNumber = (state: MachineStore) => state.serialNumber
export const selectIsLoading = (state: MachineStore) => state.isLoading
export const selectErrorMessage = (state: MachineStore) => state.errorMessage