import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { projectReducer, type ProjectAction } from './projectReducer'; // Assuming same directory
import type { ResonanceProject } from '../types/phase2';

// Initial State (matching reducer's initial state)
const initialState: ResonanceProject = {
    meta: {
        version: '2.0.0',
        createdAt: new Date().toISOString(),
    },
    layers: {
        blueprint: null,
        execution: null,
        validation: null,
    },
};

interface ProjectContextType {
    state: ResonanceProject;
    dispatch: React.Dispatch<ProjectAction>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(projectReducer, initialState);

    return (
        <ProjectContext.Provider value={{ state, dispatch }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
