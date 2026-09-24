import { ref } from 'vue';
import type { ToastNotification } from '@/types/charla';

const toasts = ref<ToastNotification[]>([]);

export function useToast() {
  const show = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 4000
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notification: ToastNotification = {
      id,
      title,
      message,
      type,
      duration,
    };

    toasts.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  };

  const success = (title: string, message: string, duration = 4000) => {
    show(title, message, 'success', duration);
  };

  const error = (title: string, message: string, duration = 5000) => {
    show(title, message, 'error', duration);
  };

  const info = (title: string, message: string, duration = 4000) => {
    show(title, message, 'info', duration);
  };

  const warning = (title: string, message: string, duration = 4500) => {
    show(title, message, 'warning', duration);
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clear = () => {
    toasts.value = [];
  };

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove,
    clear,
  };
}
