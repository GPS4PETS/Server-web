import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { formatNotificationTitle, formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { eventsActions } from '../store';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.dimensions.eventsDrawerWidth,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  footerbar: {
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    flexGrow: 1,
  },
  listclass: {
    height: '100%',
    width: theme.dimensions.eventsDrawerWidth,
  },
}));

const EventsDrawer = ({ open, onClose }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const events = useSelector((state) => state.events.items);

  const formatType = (event) => formatNotificationTitle(t, {
    type: event.type,
    attributes: {
      alarms: event.attributes.alarm,
    },
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: 'calc(100% - 75px)',
          top: 50,
        },
      }}
    >
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography variant="h6" className={classes.title}>
          {t('reportEvents')}
        </Typography>
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <List className={classes.listclass} dense>
        {events.map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => navigate(`/event/${event.id}`)}
            disabled={!event.id}
          >
            <ListItemText
              primary={`${devices[event.deviceId]?.name} • ${formatType(event)}`}
              secondary={formatTime(event.eventTime, 'seconds')}
            />
            <IconButton size="small" onClick={() => dispatch(eventsActions.delete(event))}>
              <DeleteIcon fontSize="small" className={classes.delete} />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
      <Toolbar className={classes.footerbar} disableGutters>
        <span className={classes.footerbar}>
          <IconButton size="small" color="inherit" onClick={() => dispatch(eventsActions.deleteAll())}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Toolbar>
    </Drawer>
  );
};

export default EventsDrawer;
