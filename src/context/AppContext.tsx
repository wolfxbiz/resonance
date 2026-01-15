/**
 * App Context
 * Global state management using React Context API + useReducer.
 */

import {
    createContext,
    useContext,
    useReducer,
    type ReactNode,
    type Dispatch,
} from 'react';

import {
    EngineState,
    type AppState,
    type AppAction,
    type ResonanceResult,
} from '../types';

// ============================================================================
// Initial State
// ============================================================================

const initialState: AppState = {
    currentStructure: null,
    activeCutSpeed: null,
    engineState: 'IDLE',
    results: [],
    error: null,
    isLoading: false,
};

// ============================================================================
// Reducer
// ============================================================================

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'LOAD_STRUCTURE':
            return {
                ...state,
                currentStructure: action.payload,
                activeCutSpeed: action.payload.defaultCutSpeed,
                error: null,
                isLoading: false,
            };

        case 'UPDATE_SEGMENT': {
            if (!state.currentStructure) return state;

            const updatedSegments = state.currentStructure.segments.map((seg) =>
                seg.id === action.payload.id
                    ? { ...seg, ...action.payload.segment }
                    : seg
            );

            return {
                ...state,
                currentStructure: {
                    ...state.currentStructure,
                    segments: updatedSegments,
                    updatedAt: new Date().toISOString(),
                },
            };
        }

        case 'ADD_SEGMENT': {
            if (!state.currentStructure) return state;

            return {
                ...state,
                currentStructure: {
                    ...state.currentStructure,
                    segments: [...state.currentStructure.segments, action.payload],
                    updatedAt: new Date().toISOString(),
                },
            };
        }

        case 'REMOVE_SEGMENT': {
            if (!state.currentStructure) return state;

            return {
                ...state,
                currentStructure: {
                    ...state.currentStructure,
                    segments: state.currentStructure.segments.filter(
                        (seg) => seg.id !== action.payload
                    ),
                    updatedAt: new Date().toISOString(),
                },
            };
        }

        case 'SET_CUT_SPEED':
            return {
                ...state,
                activeCutSpeed: action.payload,
            };

        case 'SET_ENGINE_STATE':
            return {
                ...state,
                engineState: action.payload,
                isLoading: action.payload === 'LOADING' || action.payload === 'PROCESSING',
            };

        case 'SET_RESULTS':
            return {
                ...state,
                results: action.payload,
                engineState: 'COMPLETE',
                isLoading: false,
            };

        case 'CLEAR_RESULTS':
            return {
                ...state,
                results: [],
                engineState: 'IDLE',
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                engineState: 'ERROR',
                isLoading: false,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
                engineState: 'IDLE',
            };

        default:
            return state;
    }
}

// ============================================================================
// Context
// ============================================================================

interface AppContextValue {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * Hook to access the application state and dispatch function.
 * Must be used within an AppProvider.
 */
export function useAppContext(): AppContextValue {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }

    return context;
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook to access just the current structure.
 */
export function useCurrentStructure() {
    const { state } = useAppContext();
    return state.currentStructure;
}

/**
 * Hook to access the engine state.
 */
export function useEngineState(): EngineState {
    const { state } = useAppContext();
    return state.engineState;
}

/**
 * Hook to access resonance results.
 */
export function useResults(): ResonanceResult[] {
    const { state } = useAppContext();
    return state.results;
}

/**
 * Hook to check loading state.
 */
export function useIsLoading(): boolean {
    const { state } = useAppContext();
    return state.isLoading;
}

/**
 * Hook to access error state.
 */
export function useError(): string | null {
    const { state } = useAppContext();
    return state.error;
}
