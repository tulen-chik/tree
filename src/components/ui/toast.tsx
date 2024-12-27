import React from 'react';

export type ToastActionElement = React.ReactNode;

// Define the properties for a toast notification
export interface ToastProps {
    title?: string;                // Title of the toast
    description?: string;          // Description of the toast
    duration?: number;             // Duration the toast is visible
    action?: ToastActionElement;    // Optional action element (e.g., button)
    open?: boolean;                // Whether the toast is open
    onOpenChange?: (open: boolean) => void; // Callback for open state changes
}
