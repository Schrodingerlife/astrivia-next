export interface AnalyzedField {
    label: string;
    value: string;
}

export interface EditableField {
    id: number;
    label: string;
    value: string;
    originalValue: string;
}

export enum AppState {
    INITIAL,
    IMAGE_UPLOADED,
    ANALYZING,
    EDITING,
    GENERATING,
    RESULT,
    ERROR,
}
