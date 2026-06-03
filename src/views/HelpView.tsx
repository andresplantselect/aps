'use client';

import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import EuroIcon from '@mui/icons-material/Euro';
import HeightIcon from '@mui/icons-material/Height';
import ImageIcon from '@mui/icons-material/Image';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LockResetIcon from '@mui/icons-material/LockReset';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MenuIcon from '@mui/icons-material/Menu';
import PendingIcon from '@mui/icons-material/Pending';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import { Stack, Typography, Divider, Box, Paper } from '@mui/material';
import React from 'react';

import { AppDialog } from '@/src/components/common/AppDialog';
import { orderStatusesDict, statusColorsDict } from '@/src/constants';
import { StyledChip } from '@/src/styledComponents';

export default function HelpView({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AppDialog open={open} onClose={onClose} title="Cómo usar la aplicación">
      <Stack sx={{ width: '100%' }} spacing={3}>
        <Typography variant="body2" color="text.secondary">
          Esta aplicación te permite consultar el catálogo de plantas
          disponibles, hacer un preorden y seguir el estado de tu pedido. El
          pago y la recogida se realizan en persona.
        </Typography>

        <Divider />

        {/* ACCESO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Acceso</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Para acceder a la aplicación necesitas un enlace de invitación que
            te envía el administrador. El enlace es personal, solo puede usarse
            una vez y caduca automáticamente.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Al abrirlo, podrás crear tu cuenta con nombre, correo y contraseña.
            Esos datos los usarás para iniciar sesión en el futuro.
          </Typography>
        </Stack>

        <Divider />

        {/* CATÁLOGO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2Icon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Catálogo de artículos</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la pestaña <strong>Catálogo</strong> encontrarás todos los
            artículos disponibles. Cada artículo muestra:
          </Typography>

          <Stack pl={2} spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EuroIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">precio por unidad</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Inventory2Icon sx={{ fontSize: 18 }} />
              <Typography variant="body2">unidades disponibles</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <BlockIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">diámetro de la maceta</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <HeightIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">altura aproximada</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <YardOutlinedIcon fontSize="small" />
              <Typography variant="body2">unidades por caja</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ImageIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                fotos del artículo — haz clic para verlas en grande
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Los artículos se venden por cajas. Si un artículo permite comprar
            unidades sueltas, verás la opción de añadir unidades individuales
            además de cajas.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            La disponibilidad se muestra en unidades. Si el artículo solo
            permite comprar cajas completas y quedan menos unidades que una
            caja, no podrás añadirlo al carrito.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <ViewModuleIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              En escritorio puedes cambiar entre vista de tarjetas y vista de
              tabla.
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* NAVEGACIÓN MÓVIL */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Navegación en móvil</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En el móvil encontrarás una barra de navegación en la parte inferior
            de la pantalla para moverte entre las secciones:
          </Typography>

          <Paper
            elevation={0}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden',
              mt: 1,
            })}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              })}
            >
              {[
                {
                  icon: <StorefrontOutlinedIcon sx={{ fontSize: 22 }} />,
                  label: 'Catálogo',
                  active: true,
                },
                {
                  icon: <ImageIcon sx={{ fontSize: 22 }} />,
                  label: 'Imágenes',
                  active: false,
                },
                {
                  icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 22 }} />,
                  label: 'Preordenes',
                  active: false,
                },
              ].map((tab) => (
                <Box
                  key={tab.label}
                  sx={(theme) => ({
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 1,
                    color: tab.active
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    borderBottom: tab.active
                      ? `2px solid ${theme.palette.primary.main}`
                      : 'none',
                  })}
                >
                  {tab.icon}
                  <Typography variant="caption" sx={{ fontSize: 10, mt: 0.3 }}>
                    {tab.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            El botón <strong>☰</strong> en la esquina superior derecha abre el
            menú con opciones de perfil y sesión.
          </Typography>

          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
              width: 'fit-content',
            })}
          >
            <MenuIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
        </Stack>

        <Divider />

        {/* GALERÍA */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Galería de imágenes</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la pestaña <strong>Imágenes</strong> puedes ver las fotografías
            actuales de los artículos disponibles. El administrador la actualiza
            con cada nueva llegada.
          </Typography>
        </Stack>

        <Divider />

        {/* CARRITO Y PEDIDO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShoppingCartIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Hacer un preorden</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Añade los artículos que quieras al carrito usando los botones + y −
            en cada artículo. Puedes añadir varios artículos distintos antes de
            confirmar.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Abre el carrito con el botón de la esquina inferior derecha. Desde
            ahí puedes revisar los artículos, modificar cantidades, eliminar
            artículos y dejar un comentario para el vendedor antes de enviar.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Al confirmar el preorden recibirás un correo con los detalles del
            pedido y el administrador también será notificado.
          </Typography>
        </Stack>

        <Divider />

        {/* ESTADO PEDIDO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PendingIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Estado del pedido</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Cuando envías un preorden su estado inicial es:
          </Typography>

          <StyledChip
            label={orderStatusesDict.pending}
            color={statusColorsDict.pending}
            variant="outlined"
            sx={{ width: 'fit-content' }}
          />

          <Typography variant="body2" color="text.secondary">
            El administrador revisará el pedido y lo aprobará o cancelará.
            Recibirás un correo con la decisión y cualquier comentario del
            vendedor.
          </Typography>

          <Stack direction="row" spacing={2}>
            <StyledChip
              label={orderStatusesDict.approved}
              color={statusColorsDict.approved}
              variant="outlined"
            />
            <StyledChip
              label={orderStatusesDict.cancelled}
              color={statusColorsDict.cancelled}
              variant="outlined"
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Una vez aprobado el pedido, el administrador actualizará el{' '}
            <strong>Estado de entrega</strong>:
          </Typography>

          <Stack spacing={1} pl={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ScheduleOutlinedIcon color="warning" sx={{ fontSize: 20 }} />
              <Typography variant="body2">
                Pedido en preparación, pendiente de recogida.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <WhereToVoteOutlinedIcon color="success" sx={{ fontSize: 20 }} />
              <Typography variant="body2">
                Pedido recogido y pagado en persona.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <RemoveCircleOutlineOutlinedIcon
                color="error"
                sx={{ fontSize: 20 }}
              />
              <Typography variant="body2">
                El pedido no pudo ser entregado o fue cancelado.
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Recibirás un correo cuando el administrador actualice el estado de
            entrega.
          </Typography>
        </Stack>

        <Divider />

        {/* TABLA PEDIDOS */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TableRowsIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Historial de pedidos</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la pestaña <strong>Preordenes</strong> puedes ver todos tus
            pedidos con sus estados, fechas, totales y comentarios del
            administrador. Usa los filtros para encontrar pedidos concretos por
            estado, estado de recogida o fecha.
          </Typography>
        </Stack>

        <Divider />

        {/* NOTIFICACIONES */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MailOutlineIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Notificaciones por correo</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Recibirás un correo automático en los siguientes momentos:
          </Typography>

          <Stack pl={2} spacing={0.5}>
            <Typography variant="body2">• Al confirmar un preorden</Typography>
            <Typography variant="body2">
              • Cuando el administrador aprueba o cancela tu pedido
            </Typography>
            <Typography variant="body2">
              • Cuando tu pedido está listo para recoger
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* PERFIL */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">Tu perfil</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Desde el menú puedes editar tu nombre y contraseña. Es importante
            que tu nombre sea correcto para que el administrador pueda
            identificarte en los pedidos.
          </Typography>
        </Stack>

        <Divider />

        {/* RECUPERAR CONTRASEÑA */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LockResetIcon sx={{ fontSize: 18 }} />
            <Typography variant="h6">¿Olvidaste tu contraseña?</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la pantalla de inicio de sesión encontrarás el enlace
            <strong> &ldquo;Recuperar&rdquo;</strong>. Introduce tu correo y
            recibirás un enlace para crear una nueva contraseña.
          </Typography>
        </Stack>
      </Stack>
    </AppDialog>
  );
}
