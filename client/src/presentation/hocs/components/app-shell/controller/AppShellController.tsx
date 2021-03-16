import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import HomeIconOutlined from '@material-ui/icons/HomeOutlined';
import BookOutlined from '@material-ui/icons/BookOutlined';
import PeopleOutlined from '@material-ui/icons/PeopleOutlined';
import ImportContactsOutlined from '@material-ui/icons/ImportContactsOutlined';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AppShellProps } from '..';
import ToolbarRightSection from '../views/ToolbarRightSection';
import { presentationEnums } from '../../../../core/enums';
import { RootState } from '../../../../store/rootReducer';

type TabTypes =
  | 'Home'
  | 'Forms'
  | 'Form Responses'
  | 'Patients'
  | 'Form Fillers';

type TabIcon = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
type TabMapping = Record<
  TabTypes,
  { Icon: TabIcon; path?: string; isHidden?: boolean }
>;

const { routeNames } = presentationEnums;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: theme.palette.common.white,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbarOptions: {
    padding: 0,
  },
  appTitle: {
    width: drawerWidth,
    paddingLeft: '20px',
  },
  toolbarRightSide: {
    flex: 1,
    display: 'flex',
  },
}));

export default (props: AppShellProps): JSX.Element => {
  const { children } = props;
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();

  const { userType } = useSelector((state: RootState) => ({
    userType: state.user.userType,
  }));

  const TAB_MAPPING: TabMapping = {
    Home: {
      Icon: HomeIconOutlined,
      path: routeNames.home,
    },
    Forms: {
      Icon: BookOutlined,
      path: routeNames.forms.base,
    },
    'Form Responses': {
      Icon: ReceiptOutlinedIcon,
      path: routeNames.formResponses.base,
      isHidden: userType === 'formManager',
    },
    Patients: {
      Icon: PeopleOutlined,
      path: routeNames.patients.base,
      isHidden: userType === 'formFiller',
    },
    'Form Fillers': {
      Icon: ImportContactsOutlined,
      path: routeNames.formFillers.base,
      isHidden: userType === 'formFiller',
    },
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbarOptions}>
          <Typography
            className={classes.appTitle}
            color="textSecondary"
            variant="h6"
            noWrap
          >
            6ix Health
          </Typography>
          <div className={classes.toolbarRightSide}>
            <ToolbarRightSection />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {(Object.keys(TAB_MAPPING) as TabTypes[])
            .filter((tabName) => !TAB_MAPPING[tabName].isHidden)
            .map((tabName) => {
              const { Icon, path } = TAB_MAPPING[tabName];
              return (
                <ListItem
                  onClick={() => path && history.replace(path)}
                  button
                  key={tabName}
                  selected={path !== undefined && location.pathname === path}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={tabName} />
                </ListItem>
              );
            })}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};
