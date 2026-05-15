import { Link, Typography } from '@mui/material';
import React from 'react';

type RedirectionLinkProps = {
  linkText: string;
  linkTitle: string;
  onLinkClick: () => void;
};

export default function RedirectionLink({
  linkText,
  linkTitle,
  onLinkClick,
}: RedirectionLinkProps) {
  return (
    <Typography component="span" color="text.secondary">
      {linkText}{' '}
      <Link
        component="button"
        underline="hover"
        onClick={onLinkClick}
        sx={{ cursor: 'pointer' }}
      >
        {linkTitle}
      </Link>
    </Typography>
  );
}
