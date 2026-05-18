import { AlertColor } from '@mui/material';
import { Session, User } from '@supabase/auth-js';

import { supabase } from '@/lib/supabase';
import { ALERT_MESSAGES_DICT, RESET_PASSWORD_URL } from '@/src/constants';
import { useRequest } from '@/src/hooks/useRequest';
import { ProductForm } from '@/src/types/propsTypes';
import {
  OrderItem,
  OrderStatusType,
  SignInFormType,
  SignUpFormType,
  ProductType,
  DeliveryStatusType,
} from '@/src/types/types';

export const useSignIn = () => {
  const { request } = useRequest();

  const signIn = (body: SignInFormType) =>
    request<{
      user: User | null;
      session: Session | null;
    }>(async () => supabase.auth.signInWithPassword(body));

  return { signIn };
};

export const useSignUp = () => {
  const { request } = useRequest();

  const signUp = ({ email, password, name }: SignUpFormType) =>
    request(() =>
      supabase.auth.signUp({ email, password, options: { data: { name } } }),
    );

  return { signUp };
};

export const useResetPassword = () => {
  const { request } = useRequest();

  const resetPassword = (email: string) =>
    request(
      async () =>
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: RESET_PASSWORD_URL,
        }),
      ALERT_MESSAGES_DICT.success.resetPasswordEmail,
    );

  return { resetPassword };
};

export const useUpdatePassword = () => {
  const { request } = useRequest();

  const updatePassword = (password: string) =>
    request<{ user: User | null }>(
      async () =>
        supabase.auth.updateUser({
          password,
        }),
      ALERT_MESSAGES_DICT.success.passwordUpdated,
    );

  return { updatePassword };
};

export const useUpdateUserName = () => {
  const { request } = useRequest();

  const updateUserName = (name: string, userId: string) =>
    request(
      async () => supabase.from('profiles').update({ name }).eq('id', userId),
      ALERT_MESSAGES_DICT.success.nameUpdated,
    );

  return { updateUserName };
};

export const useInviteToken = () => {
  const { request } = useRequest();

  const checkInviteToken = (token: string) =>
    request<string>(async () => {
      const res = await supabase.functions.invoke('check-invite', {
        body: { invite: token },
      });

      return {
        data: res.data,
        error: res.error,
      };
    });

  return { checkInviteToken };
};

export const useConsumeInvite = () => {
  const { request } = useRequest();

  const consumeInvite = (body: { inviteId: string; userId: string }) =>
    request<{ inviteId: string }>(async () => {
      const res = await supabase.functions.invoke('consume-invite', { body });

      return {
        data: res.data as { inviteId: string },
        error: res.error,
      };
    });

  return { consumeInvite };
};

export const useCreateProduct = () => {
  const { request } = useRequest();

  const createProduct = (form: ProductForm) =>
    request(
      async () => supabase.from('products').insert([form]).select().single(),
      ALERT_MESSAGES_DICT.success.productCreated(form.title),
    );

  return { createProduct };
};

export const useUpdateProduct = () => {
  const { request } = useRequest();

  const updateProduct = (form: ProductForm, productId: string) =>
    request(
      async () =>
        supabase
          .from('products')
          .update(form)
          .eq('id', productId)
          .select()
          .single(),
      ALERT_MESSAGES_DICT.success.productUpdated(form.title),
    );

  return { updateProduct };
};

export const useDeleteProduct = () => {
  const { request } = useRequest();

  const deleteProduct = async (selectedProduct: ProductType) => {
    const successMessage = ALERT_MESSAGES_DICT.success.productDeleted(
      selectedProduct.title,
    );

    const { error } = await request(async () =>
      supabase.from('products').delete().eq('id', selectedProduct.id),
    );

    if (error) return { success: null, error };

    if (selectedProduct.images?.length) {
      const filePaths = selectedProduct.images
        .map((url: string) => url.split('product-images/')[1])
        .filter(Boolean);

      if (filePaths.length) {
        const result = await request(async () =>
          supabase.storage.from('product-images').remove(filePaths),
        );

        if (result.error) return result;
      }
    }

    return {
      success: {
        message: successMessage,
        severity: 'success' as AlertColor,
      },
      error: null,
    };
  };

  return { deleteProduct };
};

export const useUpdateOrderStatus = () => {
  const { request } = useRequest();

  const updateOrderStatus = async (
    orderId: number,
    nextStatus: OrderStatusType,
    adminComment?: string,
  ) => {
    if (nextStatus === 'approved') {
      return request(
        async () =>
          supabase.rpc('approve_order', {
            p_order_id: orderId,
            p_admin_comment: adminComment || null,
          }),
        ALERT_MESSAGES_DICT.success.orderApproved,
      );
    }

    return request(
      async () =>
        supabase
          .from('orders')
          .update({
            status: 'cancelled',
            admin_comment: adminComment || null,
          })
          .eq('id', orderId),
      ALERT_MESSAGES_DICT.success.orderCancelled,
    );
  };

  return { updateOrderStatus };
};

export const useUpdateDeliveryStatus = () => {
  const { request } = useRequest();

  const updateDeliveryStatus = async (
    orderId: number,
    nextDeliveryStatus: DeliveryStatusType,
  ) => {
    return request(
      async () =>
        supabase
          .from('orders')
          .update({
            delivery_status: nextDeliveryStatus,
          })
          .eq('id', orderId),
      ALERT_MESSAGES_DICT.success.deliveryStatusUpdated,
    );
  };

  return { updateDeliveryStatus };
};

export const useCreateOrder = () => {
  const { request } = useRequest();

  const createOrder = async (
    items: OrderItem[],
    total: number,
    comment?: string,
  ) => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
      return {
        success: null,
        error: {
          message: ALERT_MESSAGES_DICT.error.notAuthenticated,
          severity: 'error' as AlertColor,
        },
      };
    }

    return request(
      async () =>
        supabase.from('orders').insert([
          {
            user_id: userId,
            items,
            total: Number(total.toFixed(2)),
            comment: comment || null,
            status: 'pending',
          },
        ]),
      ALERT_MESSAGES_DICT.success.cart,
    );
  };

  return { createOrder };
};
