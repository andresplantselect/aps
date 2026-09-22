import { Link, Typography } from '@mui/material';
import React from 'react';

type RedirectionLinkProps = {
  linkText: string;
  linkTitle: string;
  onLinkClick: () => void;
  icon?: React.ReactNode;
};

export default function RedirectionLink({
  linkText,
  linkTitle,
  onLinkClick,
  icon,
}: RedirectionLinkProps) {
  return (
    <Typography component="span" color="text.secondary">
      {linkText}{' '}
      <Link
        component="button"
        underline="hover"
        onClick={onLinkClick}
        sx={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.4,
          verticalAlign: 'middle',
          '& svg': { fontSize: 16 },
        }}
      >
        {linkTitle}
        {icon}
      </Link>
    </Typography>
  );
}
