import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { createSvgIcon } from '@mui/material/utils';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
  CardMedia,
  TableFooter,
  Link,
  Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import LightIcon from '@mui/icons-material/LightMode';
import BuzzerIcon from '@mui/icons-material/NotificationsActive';
import ShareIcon from '@mui/icons-material/ShareLocation';
import StreetViewIcon from '@mui/icons-material/Streetview';

import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly, useAdministrator, useRestriction } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';

import {
  formatPercentage, getStatusColor,
} from '../util/formatter';

const useStyles = makeStyles()((theme ) => ({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: ({
          p: 0,
        }),
        disabled: ({ 
          p: 0,
        }),
      },
    }, 
  },
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  mediaButton: {
    color: theme.palette.primary,
    mixBlendMode: 'normal',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 0, 2),
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
    paddingLeft: '14px',
    paddingRight: '14px',
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiTableCell-sizeSmall:first-of-type': {
      paddingRight: theme.spacing(1),
    },
  },
  cell: {
    borderBottom: 'none',
    lineHeight: 1.2,
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '10px',
    width: '50%',
  },
  actions: {
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    margin: '2px',
  },
  lightbutton: {
    width: '48%',
    margin: '2px',
  },
  soundbutton: {
    width: '48%',
    margin: '2px',
  },
  lmbutton: {
    width: '98%',
    margin: '2px',
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem',
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
  center: {
    textAlign: 'center',
    fontSize: '1.01em',
  },
  device: {
    position: 'relative;',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    fontSize: '1.01em',
    float: 'left',
  },
  close: {
    textAlign: 'right',
    width: '20px',
    float: 'right',
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50%)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
  },
}));

const RouteIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      stroke="none"
      fillRule="none"
      fill="currentcolor"
      fillOpacity="1"
      d="M 17.84375 0.445312 C 14.453125 1.085938 12.628906 4.6875 14.109375 7.804688 C 14.386719 8.386719 14.6875 8.757812 15.738281 9.808594 L 16.710938 10.78125 L 16.195312 10.78125 C 15.523438 10.78125 14.910156 10.851562 14.53125 10.972656 C 11.46875 11.949219 11.089844 16.101562 13.929688 17.578125 C 14.644531 17.953125 14.75 17.964844 17.132812 17.996094 C 19.507812 18.03125 19.503906 18.027344 19.976562 18.410156 C 21.242188 19.429688 20.941406 21.277344 19.410156 21.859375 L 19.148438 21.960938 L 13.195312 21.972656 L 7.242188 21.988281 L 7.992188 21.230469 C 8.40625 20.8125 8.824219 20.394531 8.925781 20.300781 C 11.324219 18.101562 10.699219 13.769531 7.75 12.160156 C 3.015625 9.570312 -2.097656 14.980469 0.820312 19.484375 C 1.117188 19.941406 4.320312 23.222656 4.730469 23.488281 L 4.941406 23.625 L 11.832031 23.625 C 16.011719 23.625 18.898438 23.605469 19.164062 23.578125 C 22.644531 23.210938 23.628906 18.648438 20.617188 16.859375 C 19.886719 16.425781 19.339844 16.351562 17.015625 16.363281 C 14.886719 16.371094 14.71875 16.335938 14.171875 15.738281 C 13.09375 14.570312 13.796875 12.648438 15.382812 12.417969 C 15.828125 12.355469 18.359375 12.363281 18.480469 12.429688 C 18.625 12.503906 19.03125 12.5 19.179688 12.417969 C 19.46875 12.265625 22.84375 8.851562 23.121094 8.433594 C 24.707031 6.050781 24.097656 2.84375 21.761719 1.269531 C 20.660156 0.53125 19.117188 0.207031 17.84375 0.445312 M 19.667969 2.109375 C 21.828125 2.65625 22.96875 5.023438 22.03125 7.019531 C 21.757812 7.609375 21.476562 7.925781 19.808594 9.535156 L 18.796875 10.507812 L 17.53125 9.273438 C 15.566406 7.363281 15.308594 6.953125 15.246094 5.695312 C 15.136719 3.335938 17.367188 1.527344 19.667969 2.109375 M 18.496094 3.617188 C 16.894531 3.832031 16.234375 5.859375 17.386719 7.023438 C 18.644531 8.289062 20.8125 7.390625 20.8125 5.601562 C 20.8125 4.359375 19.753906 3.449219 18.496094 3.617188 M 5.824219 13.191406 C 8.191406 13.644531 9.425781 16.074219 8.382812 18.234375 L 8.144531 18.726562 L 6.675781 20.203125 L 5.203125 21.679688 L 3.757812 20.226562 C 2.183594 18.648438 2.046875 18.472656 1.800781 17.742188 C 0.96875 15.265625 3.238281 12.695312 5.824219 13.191406 M 4.757812 14.835938 C 3.753906 15.058594 3.074219 16.066406 3.234375 17.097656 C 3.535156 19.046875 6.207031 19.429688 7.042969 17.636719 C 7.75 16.125 6.40625 14.472656 4.757812 14.835938 "
    />
  </svg>,
  'route',
);

const GeofenceIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      stroke="none"
      fillRule="none"
      fill="currentcolor"
      fillOpacity="1"
      d="M 11.558594 3.015625 C 9.222656 3.253906 7.441406 5.265625 7.503906 7.578125 C 7.527344 8.371094 7.816406 9.234375 8.558594 10.714844 C 8.703125 11.003906 8.820312 11.242188 8.820312 11.246094 C 8.820312 11.246094 7.886719 11.25 6.746094 11.25 L 4.671875 11.25 L 2.015625 20.992188 L 7.007812 20.996094 C 9.753906 21 14.246094 21 16.992188 20.996094 L 21.984375 20.992188 L 19.328125 11.25 L 17.253906 11.25 C 16.113281 11.25 15.179688 11.246094 15.179688 11.238281 C 15.179688 11.234375 15.25 11.09375 15.335938 10.925781 C 16.191406 9.273438 16.515625 8.273438 16.496094 7.371094 C 16.433594 4.78125 14.132812 2.753906 11.558594 3.015625 M 12.226562 4.515625 C 13.710938 4.628906 14.867188 5.785156 14.984375 7.273438 C 15.050781 8.101562 14.371094 9.726562 12.992188 12.039062 C 12.65625 12.597656 12.027344 13.574219 12 13.574219 C 11.960938 13.574219 11.15625 12.304688 10.78125 11.65625 C 9.515625 9.464844 8.953125 8.0625 9.015625 7.277344 C 9.140625 5.710938 10.363281 4.558594 11.960938 4.503906 C 11.996094 4.5 12.113281 4.507812 12.226562 4.515625 M 11.734375 6.402344 C 10.710938 6.65625 10.566406 8.054688 11.511719 8.511719 C 12.257812 8.871094 13.125 8.328125 13.125 7.5 C 13.125 6.773438 12.4375 6.230469 11.734375 6.402344 M 9.757812 12.886719 C 10.144531 13.515625 10.246094 13.6875 10.4375 13.988281 C 10.800781 14.566406 11.175781 15.132812 11.554688 15.683594 C 11.753906 15.972656 11.933594 16.234375 11.953125 16.261719 C 11.976562 16.292969 11.996094 16.320312 12 16.320312 C 12.003906 16.320312 12.023438 16.292969 12.046875 16.261719 C 12.066406 16.234375 12.246094 15.972656 12.445312 15.683594 C 12.824219 15.132812 13.199219 14.566406 13.5625 13.988281 C 13.753906 13.6875 13.855469 13.515625 14.242188 12.886719 L 14.316406 12.757812 L 16.246094 12.753906 L 18.171875 12.75 L 19.085938 16.097656 C 19.589844 17.941406 20.003906 19.460938 20.007812 19.472656 C 20.011719 19.5 19.625 19.5 12 19.5 C 4.375 19.5 3.988281 19.5 3.992188 19.472656 C 3.996094 19.460938 4.410156 17.941406 4.914062 16.097656 L 5.828125 12.75 L 7.753906 12.753906 L 9.683594 12.757812 L 9.757812 12.886719 "
    />
  </svg>,
  'geofence',
);

const AppleMapsIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      stroke="none"
      fillRule="none"
      fill="currentcolor"
      fillOpacity="1"
      d="M 5.28125 1.511719 C 3.511719 1.871094 2.042969 3.253906 1.574219 4.992188 L 1.464844 5.398438 L 1.464844 18.601562 L 1.574219 19.007812 C 2.046875 20.765625 3.53125 22.148438 5.320312 22.492188 C 5.765625 22.578125 18.125 22.59375 18.601562 22.507812 C 20.558594 22.164062 22.117188 20.625 22.492188 18.679688 C 22.59375 18.15625 22.59375 5.84375 22.492188 5.320312 C 22.152344 3.542969 20.796875 2.078125 19.03125 1.574219 L 18.648438 1.464844 L 12.121094 1.457031 C 6.878906 1.449219 5.53125 1.460938 5.28125 1.511719 M 9.601562 6.605469 C 9.601562 10.589844 9.59375 10.808594 9.515625 10.777344 C 8.785156 10.488281 7.535156 10.488281 6.804688 10.777344 C 6.722656 10.808594 6.71875 10.589844 6.71875 6.605469 L 6.71875 2.398438 L 9.601562 2.398438 L 9.601562 6.605469 M 12.960938 2.542969 C 12.960938 2.707031 12.96875 2.710938 13.601562 2.65625 C 13.945312 2.628906 13.96875 2.617188 13.96875 2.511719 L 13.96875 2.398438 L 16.320312 2.398438 L 16.320312 2.703125 L 16.6875 2.671875 C 16.890625 2.652344 17.117188 2.640625 17.191406 2.640625 C 17.308594 2.640625 17.328125 2.621094 17.328125 2.515625 L 17.328125 2.386719 L 17.796875 2.421875 C 20.019531 2.582031 21.417969 3.980469 21.574219 6.203125 L 21.609375 6.671875 L 21.484375 6.671875 C 21.378906 6.671875 21.359375 6.695312 21.359375 6.808594 C 21.359375 6.882812 21.347656 7.109375 21.328125 7.3125 L 21.296875 7.679688 L 21.601562 7.679688 L 21.601562 10.03125 L 21.488281 10.03125 C 21.382812 10.03125 21.371094 10.054688 21.34375 10.398438 C 21.289062 11.03125 21.292969 11.039062 21.457031 11.039062 L 21.601562 11.039062 L 21.601562 17.210938 L 21.429688 17.273438 C 20.996094 17.429688 20.96875 18.046875 21.386719 18.199219 C 21.570312 18.265625 21.570312 18.253906 21.398438 18.839844 C 21.105469 19.855469 20.417969 20.679688 19.460938 21.160156 C 19.0625 21.359375 18.960938 21.386719 18.960938 21.289062 C 18.960938 21.132812 18.804688 20.917969 18.648438 20.851562 C 18.289062 20.703125 17.929688 20.957031 17.960938 21.339844 C 17.980469 21.617188 18.230469 21.601562 14.128906 21.601562 L 10.558594 21.601562 L 10.558594 17.445312 L 10.851562 17.160156 C 11.628906 16.398438 12 15.503906 12 14.398438 C 12 13.296875 11.628906 12.402344 10.851562 11.640625 L 10.558594 11.355469 L 10.558594 10.566406 L 10.722656 10.515625 C 11.226562 10.347656 11.175781 9.550781 10.660156 9.550781 L 10.558594 9.550781 L 10.558594 2.398438 L 12.960938 2.398438 L 12.960938 2.542969 M 5.761719 4.339844 C 5.761719 6.183594 5.757812 6.234375 5.664062 6.261719 C 5.300781 6.378906 5.269531 6.996094 5.617188 7.175781 L 5.761719 7.25 L 5.761719 11.355469 L 5.46875 11.640625 C 3.917969 13.164062 3.917969 15.636719 5.46875 17.160156 L 5.761719 17.445312 L 5.761719 21.554688 L 5.628906 21.523438 C 3.796875 21.128906 2.621094 19.847656 2.449219 18.058594 C 2.347656 17.042969 2.386719 10.695312 2.492188 10.75 C 2.902344 10.96875 3.359375 10.492188 3.160156 10.054688 C 3.058594 9.832031 2.714844 9.722656 2.488281 9.84375 L 2.390625 9.898438 L 2.414062 7.816406 C 2.4375 5.363281 2.472656 5.09375 2.785156 5.035156 C 3.136719 4.960938 3.308594 4.589844 3.140625 4.265625 C 2.898438 3.800781 4.714844 2.523438 5.722656 2.449219 C 5.742188 2.449219 5.761719 3.300781 5.761719 4.339844 M 13.621094 3.949219 C 13.34375 4.011719 13.199219 4.070312 13.199219 4.113281 C 13.199219 4.1875 13.511719 5.144531 13.597656 5.335938 L 13.65625 5.46875 L 14.113281 5.273438 L 14.574219 5.082031 L 14.371094 4.472656 C 14.140625 3.785156 14.1875 3.816406 13.621094 3.949219 M 17.027344 4 C 16.796875 4.082031 16.609375 4.179688 16.609375 4.210938 C 16.609375 4.296875 17.121094 5.285156 17.25 5.445312 L 17.363281 5.585938 L 17.75 5.300781 C 18.210938 4.964844 18.191406 5.03125 17.933594 4.613281 C 17.820312 4.429688 17.6875 4.179688 17.644531 4.058594 C 17.546875 3.804688 17.570312 3.804688 17.027344 4 M 4.050781 5.183594 C 3.695312 5.324219 3.714844 5.945312 4.078125 6.09375 C 4.601562 6.3125 5.039062 5.648438 4.621094 5.277344 C 4.457031 5.132812 4.257812 5.097656 4.050781 5.183594 M 18.699219 6.25 L 18.414062 6.636719 L 18.554688 6.753906 C 18.710938 6.878906 19.703125 7.390625 19.792969 7.390625 C 19.84375 7.390625 20.191406 6.492188 20.152344 6.457031 C 20.144531 6.449219 20.015625 6.386719 19.867188 6.320312 C 19.71875 6.257812 19.472656 6.125 19.324219 6.027344 C 18.984375 5.808594 19.03125 5.792969 18.699219 6.25 M 14.726562 6.398438 C 14.238281 6.703125 14.246094 6.664062 14.554688 7.117188 C 14.703125 7.332031 14.898438 7.597656 14.988281 7.703125 L 15.152344 7.890625 L 15.515625 7.582031 C 15.957031 7.207031 15.949219 7.277344 15.609375 6.828125 C 15.457031 6.621094 15.292969 6.398438 15.25 6.324219 C 15.140625 6.15625 15.113281 6.160156 14.726562 6.398438 M 16.417969 8.484375 L 16.109375 8.847656 L 16.296875 9.011719 C 16.402344 9.101562 16.667969 9.296875 16.886719 9.445312 C 17.339844 9.753906 17.289062 9.765625 17.609375 9.253906 C 17.84375 8.871094 17.847656 8.859375 17.675781 8.75 C 17.601562 8.707031 17.378906 8.542969 17.171875 8.390625 C 16.722656 8.050781 16.792969 8.042969 16.417969 8.484375 M 18.722656 9.882812 C 18.496094 10.417969 18.441406 10.34375 19.261719 10.617188 C 19.96875 10.847656 19.921875 10.867188 20.058594 10.300781 C 20.183594 9.792969 20.246094 9.871094 19.515625 9.625 L 18.914062 9.425781 L 18.722656 9.882812 M 11.804688 10.796875 C 11.53125 11.070312 11.664062 11.558594 12.035156 11.628906 C 12.535156 11.726562 12.851562 11.136719 12.492188 10.777344 C 12.3125 10.597656 11.996094 10.605469 11.804688 10.796875 M 4.050781 10.945312 C 3.695312 11.085938 3.714844 11.703125 4.078125 11.855469 C 4.601562 12.070312 5.039062 11.410156 4.621094 11.035156 C 4.457031 10.890625 4.257812 10.859375 4.050781 10.945312 M 13.375 11.886719 C 13.117188 12.144531 13.21875 12.621094 13.554688 12.710938 C 13.921875 12.8125 14.207031 12.613281 14.207031 12.253906 C 14.207031 11.8125 13.683594 11.578125 13.375 11.886719 M 8.84375 14.386719 C 9.207031 15.359375 9.503906 16.167969 9.503906 16.1875 C 9.503906 16.210938 9.214844 16.03125 8.855469 15.792969 C 8.5 15.554688 8.1875 15.359375 8.160156 15.359375 C 8.132812 15.359375 7.820312 15.554688 7.460938 15.792969 C 7.105469 16.03125 6.816406 16.210938 6.816406 16.1875 C 6.8125 16.125 8.132812 12.625 8.160156 12.625 C 8.171875 12.625 8.480469 13.417969 8.84375 14.386719 M 14.953125 12.980469 C 14.816406 13.117188 14.761719 13.296875 14.804688 13.46875 C 14.941406 14.019531 15.792969 13.914062 15.792969 13.34375 C 15.792969 12.921875 15.246094 12.683594 14.953125 12.980469 M 16.71875 13.976562 C 16.496094 14.035156 16.359375 14.234375 16.375 14.46875 L 16.390625 14.664062 L 16.078125 14.777344 C 15.304688 15.0625 14.210938 14.921875 13.738281 14.480469 C 13.609375 14.363281 13.617188 14.351562 13.371094 14.832031 C 12.679688 16.179688 12.84375 17.933594 13.78125 19.167969 C 15.273438 21.136719 18.324219 21.136719 19.816406 19.167969 C 20.753906 17.9375 20.917969 16.175781 20.226562 14.832031 C 19.980469 14.351562 19.992188 14.363281 19.863281 14.480469 C 19.414062 14.898438 18.363281 15.054688 17.613281 14.8125 L 17.347656 14.722656 L 17.347656 14.46875 C 17.351562 14.085938 17.085938 13.878906 16.71875 13.976562 M 11.804688 16.554688 C 11.53125 16.832031 11.664062 17.320312 12.035156 17.390625 C 12.535156 17.484375 12.851562 16.894531 12.492188 16.535156 C 12.3125 16.355469 11.996094 16.367188 11.804688 16.554688 M 7.242188 18.148438 C 7.882812 18.3125 8.929688 18.253906 9.515625 18.023438 C 9.59375 17.992188 9.601562 18.09375 9.601562 19.792969 L 9.601562 21.601562 L 6.71875 21.601562 L 6.71875 19.792969 C 6.71875 18.09375 6.726562 17.992188 6.804688 18.023438 C 6.851562 18.042969 7.046875 18.097656 7.242188 18.148438 "
    />
  </svg>,
  'applemaps',
);

const GoogleMapsIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      stroke="none"
      fillRule="none"
      fill="currentcolor"
      fillOpacity="1"
      d="M 15.601562 3.023438 C 14.535156 3.140625 13.523438 3.609375 12.765625 4.34375 L 12.605469 4.5 L 8.765625 4.503906 C 4.476562 4.507812 4.894531 4.496094 4.546875 4.613281 C 3.777344 4.871094 3.207031 5.515625 3.035156 6.328125 C 2.992188 6.527344 2.992188 18.972656 3.035156 19.171875 C 3.230469 20.085938 3.914062 20.769531 4.828125 20.964844 C 5.027344 21.007812 17.472656 21.007812 17.671875 20.964844 C 18.484375 20.792969 19.128906 20.222656 19.386719 19.453125 C 19.5 19.105469 19.492188 19.503906 19.5 15.367188 L 19.507812 11.664062 L 19.640625 11.46875 C 20.734375 9.890625 21.117188 8.710938 20.980469 7.378906 C 20.695312 4.695312 18.273438 2.734375 15.601562 3.023438 M 16.636719 4.546875 C 18.640625 4.839844 19.925781 6.855469 19.359375 8.816406 C 19.191406 9.386719 18.882812 9.945312 18.15625 10.988281 C 17.285156 12.238281 16.636719 13.417969 16.183594 14.582031 C 16.15625 14.65625 16.128906 14.714844 16.125 14.714844 C 16.121094 14.714844 16.078125 14.613281 16.03125 14.492188 C 15.570312 13.34375 14.941406 12.207031 14.09375 10.988281 C 13.050781 9.496094 12.757812 8.8125 12.761719 7.875 C 12.761719 5.796875 14.570312 4.242188 16.636719 4.546875 M 11.609375 6.007812 C 11.609375 6.011719 11.578125 6.101562 11.542969 6.203125 C 11.019531 7.644531 11.183594 9.089844 12.039062 10.570312 C 12.101562 10.679688 12.148438 10.777344 12.148438 10.785156 C 12.144531 10.796875 7.855469 15.074219 5 17.914062 L 4.5 18.414062 L 4.507812 6.609375 L 4.539062 6.515625 C 4.632812 6.238281 4.867188 6.046875 5.152344 6.011719 C 5.222656 6 11.609375 6 11.609375 6.007812 M 7.109375 6.78125 C 5.640625 7.039062 4.820312 8.648438 5.472656 9.984375 C 6.128906 11.316406 7.855469 11.671875 8.976562 10.699219 C 9.425781 10.3125 9.710938 9.738281 9.746094 9.160156 L 9.753906 9 L 7.5 9 L 7.5 9.75 L 8.136719 9.75 C 8.488281 9.75 8.773438 9.753906 8.773438 9.757812 C 8.773438 9.785156 8.632812 9.96875 8.542969 10.058594 C 7.746094 10.855469 6.363281 10.492188 6.0625 9.40625 C 5.675781 8.007812 7.308594 6.933594 8.433594 7.84375 L 8.5625 7.945312 L 9.097656 7.410156 L 9.050781 7.363281 C 8.621094 6.90625 7.792969 6.660156 7.109375 6.78125 M 15.859375 6.777344 C 14.835938 7.03125 14.691406 8.429688 15.636719 8.886719 C 16.382812 9.246094 17.25 8.703125 17.25 7.875 C 17.25 7.148438 16.5625 6.605469 15.859375 6.777344 M 13.148438 12.253906 C 14.222656 13.796875 14.730469 14.8125 15.097656 16.160156 C 15.125 16.269531 15.148438 16.363281 15.148438 16.371094 C 15.148438 16.378906 14.421875 15.660156 13.53125 14.765625 L 11.910156 13.148438 L 12.453125 12.605469 C 12.753906 12.304688 13.003906 12.0625 13.007812 12.0625 C 13.011719 12.066406 13.078125 12.152344 13.148438 12.253906 M 17.996094 16.828125 C 17.992188 18.785156 17.992188 18.898438 17.964844 18.976562 C 17.921875 19.101562 17.859375 19.203125 17.765625 19.292969 C 17.613281 19.4375 17.597656 19.417969 17.746094 19.269531 L 17.886719 19.125 L 16.945312 18.183594 L 16.003906 17.238281 L 16.121094 17.246094 C 16.636719 17.277344 16.949219 16.976562 17.125 16.277344 C 17.304688 15.5625 17.523438 14.976562 17.871094 14.28125 L 17.992188 14.035156 L 17.996094 14.402344 C 18 14.601562 18 15.695312 17.996094 16.828125 M 13.484375 16.867188 L 16.117188 19.5 L 5.585938 19.5 L 8.21875 16.867188 C 9.667969 15.417969 10.851562 14.234375 10.851562 14.234375 C 10.851562 14.234375 12.039062 15.417969 13.484375 16.867188 "
    />
  </svg>,
  'googlemaps',
);

const LiveModeIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      stroke="none"
      fillRule="none"
      fill="currentcolor"
      fillOpacity="1"
      d="M 19.492188 0.015625 C 18.625 0.0976562 17.851562 0.414062 17.167969 0.960938 C 16.898438 1.175781 16.921875 1.175781 16.507812 1.019531 C 14.480469 0.261719 12.796875 -0.00390625 11.007812 0.148438 C 2.550781 0.867188 -2.496094 9.773438 1.261719 17.351562 C 4.609375 24.101562 13.207031 26.085938 19.226562 21.5 C 23.460938 18.273438 25.0625 12.28125 22.972656 7.488281 C 22.820312 7.140625 22.820312 7.183594 22.988281 6.976562 C 23.871094 5.867188 24.183594 4.601562 23.902344 3.292969 C 23.46875 1.320312 21.46875 -0.171875 19.492188 0.015625 M 20.296875 0.992188 C 22.652344 1.34375 23.875 4.160156 22.492188 6.054688 C 22.375 6.21875 22.390625 6.234375 21.949219 5.5625 L 21.550781 4.953125 L 21.601562 4.738281 C 21.675781 4.4375 21.660156 3.933594 21.570312 3.632812 C 21.308594 2.753906 20.261719 2.175781 19.371094 2.414062 C 19.113281 2.480469 19.066406 2.46875 18.769531 2.265625 C 18.621094 2.164062 18.351562 1.984375 18.164062 1.871094 C 17.980469 1.753906 17.824219 1.652344 17.816406 1.640625 C 17.808594 1.628906 17.914062 1.554688 18.046875 1.46875 C 18.75 1.035156 19.507812 0.875 20.296875 0.992188 M 13.140625 1.589844 C 13.699219 1.648438 14.367188 1.785156 14.949219 1.960938 C 15.164062 2.027344 16.015625 2.324219 16.035156 2.339844 C 16.039062 2.339844 16.003906 2.425781 15.957031 2.527344 C 15.378906 3.800781 15.519531 5.347656 16.332031 6.5625 L 16.503906 6.820312 L 16.292969 7.035156 C 16.175781 7.152344 16.066406 7.246094 16.054688 7.238281 C 16.039062 7.234375 15.917969 7.144531 15.78125 7.042969 C 15.113281 6.542969 14.210938 6.109375 13.410156 5.902344 C 12.554688 5.683594 10.949219 5.730469 10.132812 6 C 8.046875 6.695312 6.636719 8.078125 5.933594 10.125 C 5.539062 11.28125 5.546875 12.929688 5.953125 14.035156 C 6.703125 16.070312 8.003906 17.359375 10.015625 18.058594 C 11.191406 18.46875 12.8125 18.453125 13.996094 18.019531 C 15.988281 17.289062 17.308594 15.914062 17.988281 13.875 C 18.273438 13.015625 18.320312 11.457031 18.085938 10.5625 C 17.863281 9.714844 17.488281 8.949219 16.890625 8.121094 C 16.714844 7.882812 16.714844 7.902344 16.949219 7.671875 L 17.148438 7.472656 L 17.363281 7.628906 C 18.203125 8.234375 18.878906 8.425781 20.058594 8.390625 C 20.628906 8.375 20.726562 8.359375 21.144531 8.203125 C 21.320312 8.140625 21.507812 8.078125 21.554688 8.070312 L 21.644531 8.050781 L 21.71875 8.199219 C 21.820312 8.398438 22.066406 9.144531 22.171875 9.574219 C 23.632812 15.480469 19.695312 21.429688 13.652344 22.445312 C 8.042969 23.386719 2.605469 19.5625 1.582031 13.960938 C 0.515625 8.097656 4.546875 2.484375 10.449219 1.617188 C 10.636719 1.589844 10.820312 1.5625 10.859375 1.558594 C 11 1.539062 12.871094 1.566406 13.140625 1.589844 M 17.117188 2.894531 C 17.355469 3.023438 17.789062 3.296875 17.90625 3.386719 C 18.027344 3.476562 18.035156 3.515625 17.984375 3.753906 C 17.90625 4.125 17.925781 4.414062 18.046875 4.820312 L 18.15625 5.171875 L 17.171875 6.15625 L 17.035156 5.945312 C 16.496094 5.117188 16.386719 4.039062 16.75 3.085938 C 16.871094 2.765625 16.875 2.761719 17.117188 2.894531 M 20.167969 3.382812 C 20.546875 3.566406 20.703125 3.816406 20.703125 4.238281 C 20.699219 5.066406 19.734375 5.449219 19.140625 4.859375 C 18.441406 4.15625 19.28125 2.945312 20.167969 3.382812 M 19.152344 5.964844 C 19.441406 6.074219 19.828125 6.09375 20.285156 6.027344 C 20.570312 5.984375 20.585938 6 21.03125 6.757812 C 21.269531 7.167969 21.269531 7.171875 20.929688 7.289062 C 20.078125 7.578125 19.136719 7.523438 18.351562 7.140625 C 17.769531 6.855469 17.769531 6.855469 18.386719 6.238281 C 18.828125 5.796875 18.753906 5.820312 19.152344 5.964844 M 12.28125 7.175781 C 13.238281 7.238281 13.84375 7.453125 14.753906 8.050781 L 15.070312 8.257812 L 14.320312 9.003906 L 13.574219 9.75 L 13.34375 9.636719 C 12.105469 9.011719 10.898438 9.171875 9.980469 10.082031 C 8.417969 11.632812 9.195312 14.324219 11.34375 14.792969 C 13.738281 15.316406 15.570312 12.773438 14.347656 10.625 C 14.28125 10.507812 14.230469 10.410156 14.230469 10.402344 C 14.230469 10.359375 15.664062 8.964844 15.707031 8.964844 C 15.839844 8.964844 16.441406 10.027344 16.628906 10.597656 C 17.515625 13.304688 15.761719 16.273438 12.925781 16.859375 C 11.671875 17.117188 10.375 16.882812 9.355469 16.210938 C 6.488281 14.328125 6.21875 10.53125 8.796875 8.316406 C 9.828125 7.429688 10.875 7.085938 12.28125 7.175781 M 12.261719 10.707031 C 12.890625 10.824219 13.398438 11.523438 13.335938 12.179688 C 13.210938 13.550781 11.328125 13.933594 10.71875 12.714844 C 10.179688 11.632812 11.066406 10.476562 12.261719 10.707031 "
    />
  </svg>,
  'livemode',
);

const StatusRow = ({ name, content }) => {
  const { classes } = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">{content}</Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose, disableActions }) => {
  if (deviceId === null) {
    onClose();
  }

  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance,valid,batteryLevel');

  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);

  const [removing, setRemoving] = useState(false);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetch('/api/devices');
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
    setRemoving(false);
  });

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
      });
      if (!permissionResponse.ok) {
        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  const padTime = (time) => {
    let timetmp = time;
    if (String(time).length === 1) {
      timetmp = `0${time}`;
    }
    return timetmp;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${padTime(seconds)}`;
  };

  const [lmcounter, setLmcounter] = React.useState(0);
  React.useEffect(() => {
    let timer;
    if (lmcounter > 1) {
      timer = setTimeout(() => setLmcounter((c) => c - 1), 1000);
    } else if (lmcounter === 1) {
      fetch('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"attributes":{"noQueue":true},"deviceId":${deviceId},"type":"liveModeOff"}`,
      });
      setLmcounter(0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [lmcounter]);

  const [lcounter, setLcounter] = React.useState(0);
  React.useEffect(() => {
    let timer;
    if (lcounter > 1) {
      timer = setTimeout(() => setLcounter((c) => c - 1), 1000);
    } else if (lcounter === 1) {
      fetch('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id":11,"attributes":{},"deviceId":${deviceId},"type":"lightOff","textChannel":false,"description":"Licht Aus"}`,
      });
      setLcounter(0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [lcounter]);

  const [bcounter, setBcounter] = React.useState(0);
  React.useEffect(() => {
    let timer;
    if (bcounter > 1) {
      timer = setTimeout(() => setBcounter((c) => c - 1), 1000);
    } else if (bcounter === 1) {
      fetch('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id":12,"attributes":{},"deviceId":${deviceId},"type":"buzzerOff","textChannel":false,"description":"Buzzer Aus"}`,
      });
      setBcounter(0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [bcounter]);

  const [lml, setLml] = useState(true);
  const [lightl, setLightl] = useState(true);
  const [buzzerl, setBuzzerl] = useState(true);

  /*
  useEffect(() => {
    function getLightl() {
      let tmpll = true;
      if (lml) { tmpll = false; } else { tmpll = true; }
      setLightl(tmpll);
    }
    getLightl();
  });
  */

  const [fetchdev, setFetchdev] = useState('failure');
  useEffect(() => {
    async function getFetchdev() {
      const deviceurl = `/api/devices/?id=${deviceId}`;
      let fdevres = '';
      if (deviceId === Math.round(deviceId)) {
        const fdev = await fetch(deviceurl);
        if (fdev.ok) {
          fdevres = await fdev.text();
        } else {
          fdevres = 'failure';
          setFetchdev(fdevres);
          throw Error('Can not get Device Status');
        }
      }
      setFetchdev(fdevres);
    }
    getFetchdev();
  }, [deviceId, position]);

  const [fetchcmd, setFetchcmd] = useState('failure');
  useEffect(() => {
    async function getFetchcmd() {
      const deviceurl = `/api/commands/send/?deviceId=${deviceId}`;
      let fcmdres = '';
      if (deviceId === Math.round(deviceId)) {
        const fcmd = await fetch(deviceurl);
        if (fcmd.ok) {
          fcmdres = await fcmd.text();
        } else {
          fcmdres = 'failure';
          setFetchcmd(fcmdres);
          throw Error('Can not get Device Commands');
        }
        setFetchcmd(fcmdres);
      }
    }
    getFetchcmd();
  }, [deviceId, position]);

  const [fetchpos, setFetchpos] = useState('failure');
  useEffect(() => {
    async function getFetchpos() {
      const deviceurl = `/api/positions/?deviceId=${deviceId}`;
      let fposres = '';
      if (deviceId === Math.round(deviceId)) {
        const fpos = await fetch(deviceurl);
        if (fpos.ok) {
          fposres = await fpos.text();
        } else {
          fposres = 'failure';
          setFetchpos(fposres);
          throw Error('Can not get Device Position');
        }
        setFetchpos(fposres);
      }
    }
    getFetchpos();
  }, [deviceId, position]);

  const [donline, setDonline] = useState(true);
  useEffect(() => {
    async function getDonline() {
      let devonline = true;
      if (fetchdev.indexOf('"status":"online') > -1) {
        devonline = true;
      } else {
        devonline = false;
      }
      setDonline(devonline);
    }
    getDonline();
  }, [fetchdev]);

  const [donlinetext, setDonlineText] = useState(t('deviceStatusOnline'));
  useEffect(() => {
    async function getDonlinetext() {
      let devonlinetext = t('deviceStatusOnline');
      if (donline) {
        devonlinetext = t('deviceStatusOnline');
      } else {
        devonlinetext = t('deviceStatusOffline');
      }
      setDonlineText(<span className={classes[getStatusColor(donline ? 'online' : 'offline')]}>{devonlinetext}</span>);
    }
    getDonlinetext();
  }, [donline]);

  const [lmd, setLmd] = useState(false);
  useEffect(() => {
    async function getLmd() {
      let livemodedis = false;
      if (fetchdev.indexOf('"liveModetime":"2000-01-01') > -1) {
        livemodedis = false;
        setLml(false);
        setLmcounter(0);
      } else {
        livemodedis = true;
        const tmpd = fetchdev.substring((fetchdev.indexOf('"liveModetime":') + 16), (fetchdev.indexOf('"liveModetime":') + 26));
        const tmpt = fetchdev.substring((fetchdev.indexOf('"liveModetime":') + 27), (fetchdev.indexOf('"liveModetime":') + 35));
        const now = dayjs();
        let lmts = dayjs(tmpd.concat(' ').concat(tmpt));
        lmts = lmts.add(2, 'hour'); // 1 Winterzeit, 2 Sommerzeit
        let lmtime = now.diff(lmts, 'second');
        lmtime = 300 - lmtime;
        if (lmcounter === 0 && lmtime > 0 && lmtime <= 300) {
          setLml(false);
          setLmcounter(lmtime);
        }
        if (lmtime > 300) {
          setLml(false);
        }
      }
      if (!position) { livemodedis = true; }
      setLmd(livemodedis);
    }
    getLmd();
  }, [fetchdev]);

  const [lmcolor, setLmcolor] = useState('#FFFFFF80');
  useEffect(() => {
    function getLmcolor() {
      let col = '#FFFFFF80';
      if (lmd) {
        col = '#00FF0080';
      }
      setLmcolor(col);
    }
    getLmcolor();
  }, [lmd]);

  const [lightd, setLightd] = useState(true);
  useEffect(() => {
    async function getLightd() {
      let lightdis = true;
      if (fetchcmd.indexOf('"type":"lightOn"') > -1) {
        lightdis = false;
      }
      setLightl(false);
      if (!position) { lightdis = true; }
      setLightd(lightdis);
    }
    getLightd();
  }, [fetchcmd, fetchpos, lcounter]);

  const [buzzerd, setBuzzerd] = useState(true);
  useEffect(() => {
    async function getBuzzerd() {
      let buzzerdis = true;
      if (fetchcmd.indexOf('"type":"buzzerOn"') > -1) {
        buzzerdis = false;
        setBuzzerl(false);
      }
      if (!position) { buzzerdis = true; }
      setBuzzerd(buzzerdis);
    }
    getBuzzerd();
  }, [fetchcmd, fetchpos, bcounter]);

  const [lightdcolor, setLightdcolor] = useState('#FFFFFF80');
  useEffect(() => {
    async function getLightdcolor() {
      let ldcolor = '#FFFFFF80';
      if (fetchpos.indexOf('"lightswitch":1') > -1) {
        ldcolor = '#FFFF0080';
        setLightdcolor(ldcolor);
        const tmpd = fetchdev.substring((fetchdev.indexOf('"lighttime":') + 13), (fetchdev.indexOf('"lighttime":') + 23));
        const tmpt = fetchdev.substring((fetchdev.indexOf('"lighttime":') + 24), (fetchdev.indexOf('"lighttime":') + 32));
        const now = dayjs();
        let lts = dayjs(tmpd.concat(' ').concat(tmpt));
        lts = lts.add(1, 'hour');
        let ltime = now.diff(lts, 'second');
        ltime = 60 - ltime;
        if (lcounter === 0 && ltime > 0 && ltime <= 60) {
          setLcounter((ltime));
          setLightl(false);
        }
      } else if (fetchpos.indexOf('"lightswitch":0') > -1) {
        setLcounter(0);
        setLightl(false);
      } else if (lcounter > 0) {
        ldcolor = '#FFFF0080';
        setLightl(false);
      }
      setLightl(false);
      setLightdcolor(ldcolor);
    }
    getLightdcolor();
  }, [fetchpos, lcounter]);

  const [buzzerdcolor, setBuzzerdcolor] = useState('#FFFFFF80');
  useEffect(() => {
    async function getBuzzerdcolor() {
      let bdcolor = '#FFFFFF80';
      if (fetchpos.indexOf('"soundswitch":1') > -1) {
        bdcolor = '#0000FF80';
        setBuzzerdcolor(bdcolor);
        const tmpd = fetchdev.substring((fetchdev.indexOf('"soundtime":') + 13), (fetchdev.indexOf('"soundtime":') + 23));
        const tmpt = fetchdev.substring((fetchdev.indexOf('"soundtime":') + 24), (fetchdev.indexOf('"soundtime":') + 32));
        const now = dayjs();
        let sts = dayjs(tmpd.concat(' ').concat(tmpt));
        sts = sts.add(1, 'hour');
        let stime = now.diff(sts, 'second');
        stime = 60 - stime;
        if (bcounter === 0 && stime > 0 && stime <= 60) {
          setBcounter((stime));
          setBuzzerl(false);
        }
      } else if (fetchpos.indexOf('"soundswitch":0') > -1) {
        setBcounter(0);
        setBuzzerl(false);
      } else if (bcounter > 0) {
        bdcolor = '#0000FF80';
        setBuzzerl(false);
      }
      setBuzzerdcolor(bdcolor);
    }
    getBuzzerdcolor();
  }, [fetchpos, bcounter]);

  const livemodehandle = useCatch(async () => {
    // livemode
    setLmcounter(300);
    setLml(true);
    setLmcolor('#00FF0080');
    fetch('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"attributes":{"noQueue":"true"},"deviceId":${deviceId},"type":"liveModeOn"}`,
    });
  });
  const lighthandle = useCatch(async () => {
    // light
    setLcounter(60);
    setLightl(true);
    setLightdcolor('#FFFF0080');
    fetch('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"attributes":{},"deviceId":${deviceId},"type":"lightOn"}`,
    });
  });
  const buzzerhandle = useCatch(async () => {
    // buzzer
    setBcounter(60);
    setBuzzerl(true);
    setBuzzerdcolor('#0000FF80');
    fetch('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"attributes":{},"deviceId":${deviceId},"type":"buzzerOn"}`,
    });
  });

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Rnd
            default={{ x: 0, y: 0, width: 'auto', height: 'auto' }}
            enableResizing={false}
            dragHandleClassName="draggable-header"
            style={{ position: 'relative' }}
          >
            <Card elevation={3} className={classes.card}>
              {!isMobile && deviceImage && (
                <CardMedia
                  className={`${classes.media} draggable-header`}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                >
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon fontSize="small" className={classes.mediaButton} />
                  </IconButton>
                </CardMedia>
              )}
              {!isMobile && !deviceImage && (
                <CardMedia
                  className={classes.media}
                  image="/device.png"
                >
                  <IconButton
                    size="small"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon fontSize="small" className={classes.mediaButton} />
                  </IconButton>
                </CardMedia>
              )}
              {!position && (
                <CardContent className={classes.content}>
                  <div style={{ borderBottom: 'thin solid grey', height: '1.5em' }}>
                    <span className={classes.device}>
                      {device.name}
                    </span>
                    {isMobile && (
                      <span className={classes.close}>
                        <IconButton
                          size="small"
                          onClick={onClose}
                          onTouchStart={onClose}
                        >
                          <CloseIcon fontSize="small" className={classes.mediaButton} />
                        </IconButton>
                      </span>
                    )}
                  </div>
                  <Table size="small" classes={{ root: classes.table }}>
                    <TableBody>
                      <StatusRow
                        key={t('deviceStatus')}
                        name={t('deviceStatus')}
                        content={donlinetext}
                      />
                    </TableBody>
                  </Table>
                </CardContent>
              )}
              {position && (
              <CardContent className={classes.content}>
                <div style={{ borderBottom: 'thin solid grey', height: '1.8em' }}>
                  <span className={classes.device}>
                    {device.name}
                  </span>
                  {isMobile && (
                    <span className={classes.close}>
                      <IconButton
                        size="small"
                        onClick={onClose}
                        onTouchStart={onClose}
                      >
                        <CloseIcon fontSize="small" className={classes.mediaButton} />
                      </IconButton>
                    </span>
                  )}
                </div>
                <Table size="small" classes={{ root: classes.table }}>
                  <TableBody>
                    {positionItems.split(',').filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
                      <StatusRow
                        key={key}
                        name={positionAttributes[key]?.name || key}
                        content={(
                          <PositionValue
                            position={position}
                            property={position.hasOwnProperty(key) ? key : null}
                            attribute={position.hasOwnProperty(key) ? null : key}
                          />
                        )}
                      />
                    ))}
                    <StatusRow
                      key={t('deviceLastUpdate')}
                      name={t('deviceLastUpdate')}
                      content={(dayjs(position.serverTime).fromNow())}
                    />
                    <StatusRow
                      key={t('positionBatteryLevel')}
                      name={t('positionBatteryLevel')}
                      content={(
                        <>
                          <IconButton size="small" title={t('positionBatteryLevel')} disabled style={{ padding: 0, margin: 0 }}>
                            {(position.attributes.batteryLevel > 70 && (
                              position.attributes.charge
                                ? (<BatteryChargingFullIcon fontSize="small" classes={{ root: classes.success, disabled: classes.success }} />)
                                : (<BatteryFullIcon fontSize="small" classes={{ root: classes.success, disabled: classes.success }} />)
                            )) || (position.attributes.batteryLevel > 30 && (
                              position.attributes.charge
                                ? (<BatteryCharging60Icon fontSize="small" classes={{ root: classes.warning, disabled: classes.warning }} />)
                                : (<Battery60Icon fontSize="small" classes={{ root: classes.warning, disabled: classes.warning }} />)
                            )) || (
                              position.attributes.charge
                                ? (<BatteryCharging20Icon fontSize="small" classes={{ root: classes.error, disabled: classes.error }} />)
                                : (<Battery20Icon fontSize="small" classes={{ root: classes.error, disabled: classes.error }} />)
                            )}
                          </IconButton>
                          {formatPercentage(position.attributes.batteryLevel)}
                          {position.attributes.charge ? ' '.concat(t('positionCharge')) : ''}
                        </>
                      )}
                    />
                    <StatusRow
                      key={t('deviceStatus')}
                      name={t('deviceStatus')}
                      content={donlinetext}
                    />
                  </TableBody>
                  {admin && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className={classes.cell}>
                        <Typography variant="body2">
                          <Link component={RouterLink} to={`/position/${position.id}`}>{t('sharedShowDetails')}</Link>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                  )}
                </Table>
                <div>
                  <center>
                    {!lightd && (
                    <Button
                      type="button"
                      className={classes.lightbutton}
                      variant="outlined"
                      loading={lightl}
                      loadingPosition="start"
                      startIcon={<LightIcon />}
                      onClick={() => lighthandle()}
                      disabled={lightdcolor === '#FFFF0080' || !donline}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${donline ? lightdcolor : ''}`,
                        },
                      }}
                    >
                      {t('lightActivate')}
                      {lcounter > 0 && (
                        ` (${formatTime(lcounter)})`
                      )}
                    </Button>
                    )}
                    {!buzzerd && (
                    <Button
                      type="button"
                      className={classes.soundbutton}
                      variant="outlined"
                      loading={buzzerl}
                      loadingPosition="start"
                      startIcon={<BuzzerIcon />}
                      onClick={() => buzzerhandle()}
                      disabled={buzzerdcolor === '#0000FF80' || !donline}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${donline ? buzzerdcolor : ''}`,
                        },
                      }}
                    >
                      {t('buzzerActivate')}
                      {bcounter > 0 && (
                        ` (${formatTime(bcounter)})`
                      )}
                    </Button>
                    )}
                  </center>
                </div>
                <div>
                  <center>
                    <Button
                      type="button"
                      className={classes.lmbutton}
                      variant="outlined"
                      loading={lml}
                      loadingPosition="start"
                      startIcon={<LiveModeIcon />}
                      onClick={() => livemodehandle()}
                      disabled={lmd || lmcolor === '#00FF0080' || !donline}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${donline ? lmcolor : ''}`,
                        },
                      }}
                    >
                      {t('liveModeActivate')}
                      {lmcounter > 0 && (
                        ` (${formatTime(lmcounter)})`
                      )}
                    </Button>
                  </center>
                </div>
              </CardContent>
              )}
              <CardActions classes={{ root: classes.actions }} disableSpacing>
                <Tooltip title={t('sharedExtra')}>
                  <IconButton
                    color="secondary"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    disabled={!position}
                  >
                    <PendingIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('reportReplay')}>
                  <IconButton
                    onClick={() => navigate('/replay')}
                    disabled={disableActions || !position}
                  >
                    <RouteIcon />
                  </IconButton>
                </Tooltip>
                {admin && (
                <Tooltip title={t('commandTitle')}>
                  <IconButton
                    onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                    disabled={disableActions || !donline}
                  >
                    <PublishIcon />
                  </IconButton>
                </Tooltip>
                )}
                <Tooltip title={t('sharedEdit')}>
                  <IconButton
                    onClick={() => navigate(`/settings/device/${deviceId}`)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {admin && (
                <Tooltip title={t('sharedRemove')}>
                  <IconButton
                    color="error"
                    onClick={() => setRemoving(true)}
                    disabled={disableActions || deviceReadonly}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                )}
              </CardActions>
            </Card>
          </Rnd>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleGeofence}>
            <GeofenceIcon fontSize="small" />
            &nbsp;
            {t('sharedCreateGeofence')}
          </MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>
            <GoogleMapsIcon fontSize="small" />
            &nbsp;
            {t('linkGoogleMaps')}
          </MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>
            <AppleMapsIcon fontSize="small" />
            &nbsp;
            {t('linkAppleMaps')}
          </MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>
            <StreetViewIcon fontSize="small" />
            &nbsp;
            {t('linkStreetView')}
          </MenuItem>
          {navigationAppTitle && (
            <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>
              {navigationAppTitle}
            </MenuItem>
          )}
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}>
              <ShareIcon fontSize="small" />
              &nbsp;
              <Typography color="secondary">{t('deviceShare')}</Typography>
            </MenuItem>
          )}
        </Menu>
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
