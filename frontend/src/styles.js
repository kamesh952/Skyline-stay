import { createTheme } from '@mui/material/styles';
import { mt } from 'date-fns/locale';

export const theme = createTheme({
  typography: {
    fontFamily: 'Outfit',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#4361ee',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3f37c9',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export const pageStyle = {
  padding: '104px',
  mt:0, pt: 0,
  maxWidth: '1200px',
  margin: '0 auto',
};

export const headerStyle = {
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const cardStyle = {
  padding: '24px',
  marginBottom: '24px',
};

export const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

export const gridStyle = {
  marginTop: '24px',
};
export const paperStyle = {
  padding: '24px',
  marginBottom: '24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
};