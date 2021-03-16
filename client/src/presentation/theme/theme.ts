import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  overrides: {
    MuiCardContent: {
      root: {
        '&:last-child': {
          // was 24px, see https://github.com/mui-org/material-ui/blob/v4.11.0/packages/material-ui/src/CardContent/CardContent.js#L11
          paddingBottom: '16px',
        },
      },
    },
  },
});
