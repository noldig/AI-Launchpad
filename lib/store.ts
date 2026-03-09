import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { StepId } from './steps'

interface StepState {
  completed: boolean
  gateCheckPassed: boolean
  fields: Record<string, string>
  checkedItems: boolean[]
}

const defaultStepState: StepState = {
  completed: false,
  gateCheckPassed: false,
  fields: {},
  checkedItems: [],
}

interface LaunchpadStore {
  projectName: string
  currentStep: StepId | null
  steps: Record<StepId, StepState>
  // Actions
  setProjectName: (name: string) => void
  setCurrentStep: (step: StepId | null) => void
  setFieldValue: (step: StepId, key: string, value: string) => void
  setGateCheckItem: (step: StepId, index: number, checked: boolean) => void
  completeStep: (step: StepId) => void
  resetAll: () => void
}

const initialSteps: Record<StepId, StepState> = {
  scan: { ...defaultStepState, checkedItems: [] },
  target: { ...defaultStepState, checkedItems: [] },
  engine: { ...defaultStepState, checkedItems: [] },
  takeoff: { ...defaultStepState, checkedItems: [] },
}

export const useLaunchpadStore = create<LaunchpadStore>()(
  persist(
    (set) => ({
      projectName: '',
      currentStep: null,
      steps: { ...initialSteps },

      setProjectName: (name) => set({ projectName: name }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setFieldValue: (step, key, value) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: {
              ...state.steps[step],
              fields: {
                ...state.steps[step].fields,
                [key]: value,
              },
            },
          },
        })),

      setGateCheckItem: (step, index, checked) =>
        set((state) => {
          const items = [...(state.steps[step].checkedItems || [])]
          items[index] = checked
          return {
            steps: {
              ...state.steps,
              [step]: {
                ...state.steps[step],
                checkedItems: items,
              },
            },
          }
        }),

      completeStep: (step) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: {
              ...state.steps[step],
              completed: true,
              gateCheckPassed: true,
            },
          },
        })),

      resetAll: () =>
        set({
          projectName: '',
          currentStep: null,
          steps: {
            scan: { ...defaultStepState, checkedItems: [] },
            target: { ...defaultStepState, checkedItems: [] },
            engine: { ...defaultStepState, checkedItems: [] },
            takeoff: { ...defaultStepState, checkedItems: [] },
          },
        }),
    }),
    {
      name: 'ai-launchpad-state',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return sessionStorage
        }
        // SSR fallback (no-op)
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)
