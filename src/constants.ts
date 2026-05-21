import { ChipProps } from '@mui/material';

import {
  DisponibilityType,
  OrderStatusType,
  VisibilityType,
} from '@/src/types/types';

export const orderStatusesDict: Record<OrderStatusType, string> = {
  pending: 'pendiente',
  approved: 'aprobado',
  cancelled: 'rechazado',
};

export const deliveryStatusesDict = {
  not_applicable: 'Sin entrega',
  waiting: 'Pendiente',
  delivered: 'Entregado',
  failed: 'Cancelado',
};

export const availabilityStatusesDict: Record<DisponibilityType, string> = {
  available: 'Disponibles',
  outOfStock: 'Fuera de stock',
};
export const visibilityStatusesDict: Record<VisibilityType, string> = {
  visible: 'Visible en catálogo',
  hidden: 'Oculto para clientes',
};

export const statusColorsDict: Record<OrderStatusType, ChipProps['color']> = {
  approved: 'success',
  cancelled: 'error',
  pending: 'warning',
};

export const AuthTitlesDict = {
  signIn: {
    title: 'Iniciar sesión',
    submitButton: 'Iniciar sesión',
    linkText: 'Aún no estás registrado?',
    linkTitle: 'Registrarse',
  },
  forgotPassword: {
    title: 'Recuperar contraseña',
    submitButton: 'Enviar enlace',
    linkText: 'Recordaste los datos?',
    linkTitle: 'Ir al registro',
  },
};

export const RESET_PASSWORD_URL =
  'https://andresplantselect.netlify.app/reset-password';

export const ALERT_MESSAGES_DICT = {
  success: {
    cart:
      'Pedido enviado con éxito.\n' +
      'Tu pedido está en estado pendiente.\n' +
      'Los artículos han sido reservados hasta que el administrador lo apruebe o lo cancele.\n' +
      'Puedes consultar el estado y los detalles en la tabla de pedidos.',
    passwordUpdated: 'Contraseña actualizada.',
    nameUpdated: 'Nombre actualizado.',
    accountCreated: 'Tu cuenta ha sido creada correctamente.',
    resetPasswordEmail:
      'Si el correo está registrado, recibirás un email con instrucciones para restablecer tu contraseña.',
    productCreated: (title: string) => `Artículo ${title} agregado.`,
    productUpdated: (title: string) => `Artículo ${title} actualizado.`,
    productDeleted: (title: string) => `Artículo ${title} eliminado.`,
    orderApproved: 'Pedido aprobado.',
    orderCancelled: 'Pedido rechazado.',
    deliveryStatusUpdated: 'Pedido entregado.',
  },

  error: {
    unknown: 'Error desconocido.',
    notAuthenticated: 'Usuario no autenticado.',
    cartEmpty: 'La preorden está vacía.',
    inviteInvalid: 'El enlace de invitación no es válido o ha expirado.',
    network: 'Error de conexión.',
    server: 'Error del servidor.',
  },
} as const;

export const TITLES = {
  buttons: {
    cart: {
      submit: 'Reservar',
      clear: 'Vaciar pedido',
    },
  },
  titles: {
    cart: 'Tu pedido',
  },
} as const;
