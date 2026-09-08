import {
  Card,
  IconButton,
  Stack,
  Box,
  Chip,
  ToggleButton,
  TableCell,
} from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  // increased vertical padding to make buttons taller and match new design
  padding: theme.spacing(0.8, 2),
  borderRadius: 999,
  border: `1px solid ${theme.palette.primary.main}`,
  transition: 'background-color 0.2s ease',
  width: 'fit-content',

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.primary.dark}`,
  },

  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[200],
    border: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.grey[400],
  },
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  // keep same vertical padding as PrimaryButton for consistency
  padding: theme.spacing(0.8, 2),
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'background-color 0.2s ease, border-color 0.2s ease',
  width: 'fit-content',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.divider,
  },

  '&.Mui-disabled': {
    borderColor: theme.palette.grey[200],
    color: theme.palette.grey[400],
  },
}));

export const LinkButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: 0,
  transition: 'color 0.2s ease',
  width: 'fit-content',

  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.light,
  },

  '&.Mui-disabled': {
    color: theme.palette.grey[400],
  },
}));

export const Row = styled(Stack)({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const PanelCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: 'none',
  padding: 16,
  width: '100%',
}));

export const RoundIconButton = styled(IconButton)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.2s ease',

  svg: {
    fontWeight: 400,
    fontSize: '20px',
  },

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },

  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[400],
  },
}));

export const SecondaryRoundIconButton = styled(IconButton)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'background-color 0.2s ease, color 0.2s ease',

  svg: {
    fontWeight: 400,
    fontSize: '20px',
  },

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },

  '&.Mui-disabled': {
    borderColor: theme.palette.grey[200],
    color: theme.palette.grey[400],
  },
}));

export const VisuallyHiddenInput = styled('input')({
  border: 0,
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

export const WelcomeBox = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  position: 'relative',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

export const FilterPillBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.2, 1.5),
  borderRadius: 999,
  border: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  overflow: 'hidden',
  maxWidth: '100%',
}));

export const StyledChip = styled(Chip)(() => ({
  borderRadius: 999,
  height: 24,
}));

export const TogglePillButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 999,
  borderColor: theme.palette.divider,
  padding: theme.spacing(0.8, 2),
  minWidth: 36,

  color: theme.palette.text.secondary,
  backgroundColor: 'transparent',

  transition:
    'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },

  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,

    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
    },
  },
}));

export const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.3,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.default,
  minHeight: 65,
  padding: '8px 14px',
  whiteSpace: 'wrap',
  verticalAlign: 'middle',
  boxSizing: 'border-box',

  '& .MuiTableSortLabel-root': {
    fontWeight: 600,
    fontSize: '1rem',
  },

  '& .MuiTableSortLabel-icon': {
    opacity: 0.6,
  },
}));

export const CartCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 1.5),
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
}));

export const CustomAccordionText = styled(Card)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  backgroundColor: theme.palette.divider,
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 1),
  borderRadius: 5,
}));

export const FiltersBox = styled(Stack)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '12px',
  backgroundColor: 'transparent',
  padding: theme.spacing(1.5, 2),
  width: '100%',

  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));
