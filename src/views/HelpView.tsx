'use client';

import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import EuroIcon from '@mui/icons-material/Euro';
import GrassIcon from '@mui/icons-material/Grass';
import HeightIcon from '@mui/icons-material/Height';
import ImageIcon from '@mui/icons-material/Image';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingIcon from '@mui/icons-material/Pending';
import PersonIcon from '@mui/icons-material/Person';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import { Stack, Typography } from '@mui/material';
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
      <Stack sx={{ width: '100%' }} alignItems="center" spacing={3}>
        <Typography variant="body1" color="text.secondary">
          Esta aplicación te permite consultar el catálogo de plantas, reservar
          productos y seguir el estado de tus pedidos.
        </Typography>

        {/* ACCESO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon fontSize="small" />
            <Typography variant="h6">Acceso a la aplicación</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Para utilizar la aplicación es necesario disponer de un enlace de
            invitación.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            El administrador genera este enlace y lo comparte contigo.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            El enlace de invitación es personal, solo puede utilizarse una vez y
            caduca automáticamente después de un tiempo limitado.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Al acceder al enlace podrás crear tu cuenta introduciendo tus datos.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Estos datos serán los que utilizarás posteriormente para iniciar
            sesión en la aplicación.
          </Typography>
        </Stack>

        {/* PRODUCTOS */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2Icon fontSize="small" />
            <Typography variant="h6">Lista de artículos</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la página principal encontrarás la lista de plantas disponibles.
            Cada artículo muestra:
          </Typography>

          <Stack pl={2} spacing={0.5}>
            <Stack direction="row" spacing={1}>
              <EuroIcon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">precio por unidad</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Inventory2Icon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                cantidad de unidades disponible
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <BlockIcon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">diámetro de la maceta</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <HeightIcon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">altura aproximada</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <GrassIcon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                número de unidades por caja
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <ImageIcon fontSize="small" sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                fotografías del producto (al hacer clic en la imagen puedes
                verla en tamaño grande)
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Algunos artículos también permiten comprar unidades individuales
            además de cajas completas.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            En estos casos puedes seleccionar tanto cajas como unidades por
            separado.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Si el número de unidades supera la cantidad de unidades por caja, el
            sistema las convertirá automáticamente en cajas completas.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <ViewModuleIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Los artículos pueden visualizarse tanto en formato de cuadrícula
              como en formato de tabla.
            </Typography>
          </Stack>
        </Stack>

        {/* GALERÍA */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon fontSize="small" />
            <Typography variant="h6">Galería de imágenes</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la pestaña de imágenes puedes consultar fotografías recientes de
            las plantas actualmente disponibles.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            El administrador actualiza esta sección periódicamente con nuevas
            imágenes.
          </Typography>
        </Stack>

        {/* CARRITO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShoppingCartIcon fontSize="small" />
            <Typography variant="h6">Añadir productos al carrito</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Introduce el número de cajas o unidades que deseas reservar en los
            artículos que te interesen y después abre el carrito.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            En el carrito podrás:
          </Typography>

          <Stack pl={2} spacing={0.5}>
            <Typography variant="body2">• revisar los productos</Typography>

            <Typography variant="body2">• modificar cantidades</Typography>

            <Typography variant="body2">
              • añadir un comentario para el vendedor
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Cuando confirmes el pedido, los productos quedarán reservados.
          </Typography>
        </Stack>

        {/* ESTADO PEDIDO */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PendingIcon fontSize="small" />
            <Typography variant="h6">Estado del pedido</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Cuando realizas un pedido su estado inicial será:
          </Typography>

          <StyledChip
            label={orderStatusesDict.pending}
            color={statusColorsDict.pending}
            variant="outlined"
            sx={{ width: 100 }}
          />

          <Typography variant="body2" color="text.secondary">
            Esto significa que el pedido ha sido recibido y los productos quedan
            reservados temporalmente mientras el administrador revisa el pedido.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Después el administrador podrá aprobar o rechazar el pedido.
          </Typography>

          <Stack direction="row" spacing={3}>
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
            Además, cada pedido tiene un estado de entrega independiente.
          </Typography>

          <Stack spacing={1} pl={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ScheduleOutlinedIcon color="warning" sx={{ fontSize: 20 }} />

              <Typography variant="body2">
                El pedido está siendo preparado o pendiente de entrega.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <WhereToVoteOutlinedIcon color="success" sx={{ fontSize: 20 }} />

              <Typography variant="body2">
                El pedido ha sido entregado y pagado correctamente.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <RemoveCircleOutlineOutlinedIcon
                color="error"
                sx={{ fontSize: 20 }}
              />

              <Typography variant="body2">
                El pedido no podrá ser entregado o fue cancelado.
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* TABLA */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TableRowsIcon fontSize="small" />
            <Typography variant="h6">Tabla de pedidos</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la tabla de pedidos puedes ver todos tus pedidos, los comentarios
            del administrador y el estado actual.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            También puedes filtrar los pedidos por estado, estado de entrega y
            fecha del pedido.
          </Typography>
        </Stack>

        {/* PERFIL */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon fontSize="small" />
            <Typography variant="h6">Configuración del perfil</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            En la sección de perfil puedes modificar tu nombre y tu contraseña.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Es importante que el nombre sea correcto para que el administrador
            pueda identificar quién ha realizado el pedido.
          </Typography>
        </Stack>
      </Stack>
    </AppDialog>
  );
}
