import { Theme } from '@mui/material/styles';
import { MuiMenuOverrides } from './MuiMenu';
import { MuiLayoutOverrides } from './MuiLayout';
import { MuiTableOverrides } from './MuiTable';

const getComponentOverrides = (theme: Theme) => {
  return {
    ...MuiMenuOverrides(theme),
    ...MuiLayoutOverrides(theme),
    ...MuiTableOverrides(theme),
  };
};

export default getComponentOverrides;
