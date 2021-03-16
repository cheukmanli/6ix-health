import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SDCForm } from '../../../../domain/sdcForm/SDCForm';
import { RootState } from '../../../store/rootReducer';
import { presentationEnums } from '../../../core/enums';

const useStyles = makeStyles({
  container: {
    margin: '8px',
  },
  title: {
    margin: 0,
  },
  uploadDate: {
    margin: 0,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadata: {
    margin: 0,
    marginLeft: 15,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type SDCFormListItemProps = {
  form: SDCForm;
  onDeleteSDCForm: (form: SDCForm) => void;
};

type DropdownOption = {
  label: string;
  onClick: () => void;
};

const SDCFormListItem = ({ onDeleteSDCForm, form }: SDCFormListItemProps) => {
  const { routeNames } = presentationEnums;
  const classes = useStyles();
  const history = useHistory();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isActionsMenuOpen = Boolean(anchorEl);

  const { userType } = useSelector((state: RootState) => ({
    userType: state.user.userType,
  }));
  const handleDeleteDialogOpen = () => setIsDeleteDialogOpen(true);
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleActionsMenuClose = () => setAnchorEl(null);

  const handleDelete = () => {
    onDeleteSDCForm(form);
    setIsDeleteDialogOpen(false);
  };

  const actionOptions: DropdownOption[] = [];

  if (userType === 'formManager') {
    actionOptions.push({
      label: 'Delete Form',
      onClick: handleDeleteDialogOpen,
    });
  } else if (userType === 'formFiller') {
    actionOptions.push({
      label: 'Create New Form Response',
      onClick: () =>
        history.push(
          `${routeNames.formResponses.createEdit}?SDCFormId=${form.SDCFormId}`
        ),
    });
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  return (
    <Card className={classes.container}>
      <CardContent className={classes.contentContainer}>
        <div className={classes.info}>
          <Typography variant="h5" gutterBottom>
            {form.title}
          </Typography>
          <Typography className={classes.metadata} gutterBottom>
            Version: {form.version}
          </Typography>
          <Typography className={classes.metadata} gutterBottom>
            SDC Form ID: {form.SDCFormId}
          </Typography>
          <Typography className={classes.metadata} gutterBottom>
            Diagnostic Procedure ID: {form.diagnosticProcedureId}
          </Typography>
        </div>
        <div>
          <IconButton onClick={handleClick}>
            <MoreVertOutlined />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={isActionsMenuOpen}
            onClose={handleActionsMenuClose}
          >
            {actionOptions.map((option) => (
              <MenuItem key={JSON.stringify(option)} onClick={option.onClick}>
                {option.label}
              </MenuItem>
            ))}
          </Menu>

          <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle>Delete Form?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This action cannot be undone. Are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>CANCEL</Button>
              <Button onClick={handleDelete}>DELETE</Button>
            </DialogActions>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDCFormListItem;
