
export type QuestionType = 'text' | 'number' | 'date' | 'select' | 'radio' | 'textarea' | 'checkbox';

export interface Option {
    label: string;
    value: string;
}

export interface Condition {
    field: string;
    operator: 'equals' | 'not_equals';
    value: any;
}

export interface Question {
    id: string;
    label: string;
    type: QuestionType;
    placeholder?: string;
    options?: Option[]; // For select, radio
    required?: boolean;
    showIf?: Condition; // Conditional logic
    description?: string;
}

export type FormSchema = Question[];
