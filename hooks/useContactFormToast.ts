import { useState } from 'react';

export type ToastVariant = "success" | "error";

export interface ToastState {
  title: string;
  description: string;
  variant: ToastVariant;
  open: boolean;
}

export function useContactFormToast() {
  /**
   * Custom hook for managing toast notifications in the contact form.
   * 
   * This hook provides state management and functions for displaying toast notifications
   * in the contact form component. It handles different variants of toasts (success/error)
   * and manages their visibility state.
   * 
   * @returns {Object} An object containing:
   * - toastState: The current state of the toast (title, description, variant, visibility)
   * - setToastOpen: Function to manually control toast visibility
   * - showToast: Function to display a new toast with specified title, description and variant
   * - dismissToast: Function to dismiss the current toast
   * 
   * @example
   * ```tsx
   * const { toastState, showToast } = useContactFormToast();
   * 
   * // Show a success toast
   * showToast("Success", "Your message has been sent!", "success");
   * 
   * // Show an error toast
   * showToast("Error", "Please complete the verification", "error");
   * ```
   */
  const [toastState, setToastState] = useState<ToastState>({
    title: "",
    description: "",
    variant: "success",
    open: false,
  });

  const showToast = (title: string, description: string, variant: ToastVariant) => {
    setToastState({ title, description, variant, open: true });
  };

  const dismissToast = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  return { 
    toastState, 
    setToastOpen: (open: boolean) => setToastState((prev) => ({ ...prev, open })), 
    showToast, 
    dismissToast 
  };
} 