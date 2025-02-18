import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { createSvgIcon } from '@mui/material/utils';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography, Badge,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions, devicesActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useAdministrator, useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const disableReports = useRestriction('disableReports');
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const devicesOpen = useSelector((state) => state.session.devicesOpen);

  const [anchorEl, setAnchorEl] = useState(null);

  let reportsSize = 'medium';

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      reportsSize = 'medium';
      return 'account';
    } if (location.pathname.startsWith('/settings')) {
      reportsSize = 'medium';
      let rtval = 'settings';
      if (isMobile) {
        rtval = 'account';
      }
      return rtval;
    } if (location.pathname.startsWith('/geofences')) {
      reportsSize = 'medium';
      let rtval = 'settings';
      if (isMobile) {
        rtval = 'account';
      }
      return rtval;
    } if (location.pathname.startsWith('/reports')) {
      reportsSize = 'medium';
      return 'reports';
    } if (location.pathname === '/') {
      reportsSize = (isMobile ? 'large' : 'medium');
      let rtval = 'map';
      if (isMobile) {
        rtval = 'devices';
      }
      return rtval;
    }
    if (anchorEl) {
      return 'account';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSettings = () => {
    setAnchorEl(null);
    navigate('/settings/preferences');
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'reports':
        if (admin) {
          navigate('/reports/combined');
        } else {
          navigate('/reports/overview');
        }
        break;
      case 'settings':
        navigate('/settings/preferences');
        break;
      case 'account':
        setAnchorEl(event.currentTarget);
        break;
      case 'logout':
        handleLogout();
        break;
      case 'devices':
        if (location.pathname === '/') {
          if (isMobile) {
            dispatch(devicesActions.selectId(null));
          }
          dispatch(sessionActions.setDevicesOpen(!devicesOpen));
        } else {
          navigate('/');
        }
        break;
      default:
        break;
    }
  };

  const MapIcon = createSvgIcon(
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
        d="M 14.90625 1.386719 C 11.960938 1.925781 10.402344 4.574219 11.328125 7.46875 C 11.640625 8.445312 12.140625 9.316406 13.328125 10.945312 C 15.347656 13.714844 15.789062 13.691406 17.894531 10.699219 C 18.972656 9.160156 19.277344 8.648438 19.613281 7.792969 C 20.691406 5.070312 19.429688 2.316406 16.742188 1.515625 C 16.34375 1.398438 15.257812 1.324219 14.90625 1.386719 M 16.136719 3.507812 C 17.855469 3.984375 18.417969 6.101562 17.160156 7.363281 C 15.746094 8.78125 13.335938 7.871094 13.230469 5.878906 C 13.144531 4.289062 14.617188 3.089844 16.136719 3.507812 M 2.742188 6.664062 C 2.261719 6.929688 2.289062 6.476562 2.304688 13.851562 C 2.320312 21.007812 2.296875 20.433594 2.625 20.679688 C 2.714844 20.742188 8.222656 22.640625 8.324219 22.640625 C 8.335938 22.640625 8.34375 19.417969 8.34375 15.480469 L 8.34375 8.320312 L 5.800781 7.464844 C 3.222656 6.597656 2.980469 6.53125 2.742188 6.664062 M 9.878906 8.054688 L 9.09375 8.316406 L 9.09375 22.648438 L 9.199219 22.613281 C 9.257812 22.597656 10.601562 22.144531 12.1875 21.609375 L 15.070312 20.636719 L 15.09375 13.605469 L 14.84375 13.480469 C 13.988281 13.0625 11.351562 9.484375 10.804688 8.003906 C 10.757812 7.882812 10.707031 7.78125 10.691406 7.785156 C 10.675781 7.789062 10.3125 7.90625 9.878906 8.054688 M 20.296875 7.890625 C 20.296875 8.035156 19.570312 9.398438 19.175781 10 C 18.046875 11.714844 16.503906 13.464844 16.03125 13.570312 L 15.890625 13.601562 L 15.902344 17.121094 L 15.914062 20.636719 L 18.46875 21.5 C 21.46875 22.511719 21.429688 22.503906 21.785156 21.984375 L 21.890625 21.828125 L 21.890625 15.25 C 21.890625 8.144531 21.90625 8.550781 21.648438 8.3125 C 21.429688 8.109375 20.296875 7.753906 20.296875 7.890625 "
      />
    </svg>,
    'map',
  );

  const DeviceIcon = createSvgIcon(
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
        d="M 7.011719 5.933594 C 6.882812 6.058594 6.832031 6.230469 6.832031 6.515625 C 6.832031 6.945312 6.3125 7.15625 6.167969 6.785156 C 6.097656 6.597656 4.359375 6.589844 4.25 6.773438 C 4.199219 6.863281 3.90625 6.910156 3.234375 6.941406 C 1.929688 6.996094 1.226562 7.40625 0.84375 8.328125 C 0.65625 8.769531 0.664062 14.34375 0.847656 14.789062 C 1.0625 15.296875 1.410156 15.6875 1.875 15.941406 L 2.316406 16.179688 L 6.832031 16.179688 L 6.832031 16.8125 C 6.832031 17.933594 7.171875 18.246094 8.386719 18.246094 L 9.050781 18.246094 L 9.824219 17.683594 L 10.601562 17.125 L 10.605469 16.652344 L 10.605469 16.179688 L 13.125 16.179688 L 13.125 17.070312 L 13.777344 17.554688 C 14.679688 18.222656 14.738281 18.246094 15.414062 18.246094 C 16.570312 18.246094 16.898438 17.945312 16.898438 16.878906 L 16.898438 16.179688 L 19.238281 16.179688 C 23.070312 16.179688 23.148438 16.09375 23.246094 11.773438 C 23.316406 8.675781 23.273438 8.367188 22.628906 7.671875 C 22.007812 6.996094 21.933594 6.980469 19.257812 6.941406 L 16.898438 6.90625 L 16.898438 6.476562 C 16.898438 5.78125 16.828125 5.753906 15.082031 5.753906 C 13.304688 5.753906 13.125 5.824219 13.125 6.523438 L 13.125 6.921875 L 10.605469 6.921875 L 10.605469 6.460938 C 10.605469 5.773438 10.566406 5.757812 8.742188 5.753906 C 7.308594 5.753906 7.175781 5.765625 7.011719 5.933594 "
      />
    </svg>,
    'device',
  );

  const SettingsMobileIcon = createSvgIcon(
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
        d="M 6.726562 2.230469 C 6.710938 2.25 6.695312 2.722656 6.695312 3.289062 C 6.695312 4.226562 6.691406 4.320312 6.617188 4.34375 C 6.40625 4.414062 6.203125 4.515625 6.203125 4.546875 C 6.203125 4.566406 6.152344 4.585938 6.09375 4.585938 C 6.035156 4.585938 5.976562 4.597656 5.96875 4.617188 C 5.960938 4.636719 5.859375 4.6875 5.738281 4.730469 L 5.523438 4.808594 L 4.777344 4.066406 C 4.367188 3.660156 4.023438 3.324219 4.011719 3.324219 C 3.949219 3.324219 1.84375 5.480469 1.84375 5.546875 C 1.84375 5.589844 2.15625 5.9375 2.539062 6.316406 C 3.3125 7.085938 3.285156 7.03125 3.101562 7.4375 C 3.027344 7.601562 2.964844 7.761719 2.964844 7.796875 C 2.964844 7.832031 2.945312 7.871094 2.921875 7.886719 C 2.898438 7.902344 2.875 7.960938 2.875 8.015625 C 2.871094 8.28125 2.832031 8.289062 1.683594 8.304688 L 0.628906 8.320312 L 0.628906 11.371094 L 2.765625 11.371094 L 2.828125 11.585938 C 2.863281 11.703125 2.929688 11.867188 2.96875 11.953125 C 3.128906 12.273438 3.234375 12.539062 3.234375 12.609375 C 3.234375 12.664062 2.84375 13.074219 2.328125 13.554688 C 2.085938 13.777344 1.84375 14.074219 1.84375 14.144531 C 1.84375 14.210938 3.949219 16.359375 4.015625 16.359375 C 4.03125 16.359375 4.328125 16.082031 4.667969 15.742188 C 5.609375 14.808594 5.492188 14.894531 5.71875 14.984375 C 5.824219 15.03125 5.945312 15.082031 5.988281 15.105469 C 6.03125 15.128906 6.085938 15.144531 6.113281 15.144531 C 6.136719 15.144531 6.242188 15.183594 6.347656 15.230469 C 6.453125 15.277344 6.574219 15.328125 6.617188 15.339844 C 6.6875 15.363281 6.695312 15.46875 6.707031 16.414062 L 6.71875 17.460938 L 8.292969 17.460938 L 8.304688 14.683594 C 8.316406 12.070312 8.3125 11.90625 8.234375 11.882812 C 8.191406 11.871094 8.121094 11.839844 8.078125 11.816406 C 8.035156 11.792969 7.960938 11.773438 7.910156 11.773438 C 7.859375 11.773438 7.785156 11.757812 7.742188 11.734375 C 7.699219 11.714844 7.5625 11.648438 7.4375 11.589844 C 7.183594 11.46875 7.140625 11.441406 6.972656 11.277344 C 6.726562 11.039062 6.632812 10.890625 6.46875 10.496094 C 6.363281 10.234375 6.296875 9.484375 6.378906 9.484375 C 6.40625 9.484375 6.425781 9.429688 6.425781 9.367188 C 6.425781 9.261719 6.503906 9.066406 6.65625 8.808594 C 6.742188 8.660156 7.195312 8.226562 7.265625 8.226562 C 7.296875 8.226562 7.335938 8.199219 7.355469 8.167969 C 7.410156 8.089844 7.578125 8 7.679688 8 C 7.730469 8 7.773438 7.980469 7.785156 7.953125 C 7.804688 7.886719 8.804688 7.886719 8.871094 7.953125 C 8.894531 7.980469 8.953125 8 8.996094 8 C 9.042969 8 9.078125 8.019531 9.078125 8.042969 C 9.078125 8.070312 9.117188 8.089844 9.160156 8.089844 C 9.34375 8.089844 10.066406 8.859375 10.066406 9.054688 C 10.066406 9.09375 10.097656 9.125 10.136719 9.125 C 10.179688 9.125 10.203125 9.167969 10.203125 9.257812 C 10.203125 9.332031 10.222656 9.394531 10.246094 9.394531 C 10.269531 9.394531 10.292969 9.480469 10.300781 9.585938 L 10.316406 9.773438 L 15.933594 9.773438 L 15.945312 9.046875 L 15.957031 8.316406 L 15 8.3125 C 13.925781 8.3125 13.859375 8.304688 13.824219 8.152344 C 13.808594 8.09375 13.777344 8.042969 13.75 8.042969 C 13.726562 8.042969 13.707031 7.984375 13.707031 7.910156 C 13.707031 7.835938 13.6875 7.773438 13.664062 7.773438 C 13.636719 7.773438 13.617188 7.734375 13.617188 7.6875 C 13.617188 7.640625 13.597656 7.589844 13.574219 7.574219 C 13.546875 7.558594 13.527344 7.507812 13.527344 7.457031 C 13.527344 7.410156 13.507812 7.371094 13.484375 7.371094 C 13.457031 7.371094 13.4375 7.332031 13.4375 7.28125 C 13.4375 7.230469 13.417969 7.191406 13.394531 7.191406 C 13.257812 7.191406 13.421875 6.984375 14.089844 6.320312 C 14.496094 5.914062 14.832031 5.5625 14.832031 5.542969 C 14.832031 5.503906 13.984375 4.640625 13.132812 3.808594 C 12.667969 3.355469 12.539062 3.261719 12.539062 3.375 C 12.539062 3.425781 12.429688 3.550781 12.382812 3.550781 C 12.351562 3.550781 11.414062 4.484375 11.414062 4.519531 C 11.414062 4.554688 11.292969 4.675781 11.257812 4.675781 C 11.242188 4.675781 11.203125 4.703125 11.167969 4.734375 C 11.101562 4.800781 10.875 4.785156 10.875 4.714844 C 10.875 4.691406 10.835938 4.675781 10.785156 4.675781 C 10.738281 4.675781 10.695312 4.652344 10.695312 4.628906 C 10.695312 4.605469 10.636719 4.585938 10.566406 4.585938 C 10.492188 4.585938 10.425781 4.5625 10.417969 4.539062 C 10.410156 4.515625 10.292969 4.457031 10.15625 4.410156 L 9.910156 4.320312 L 9.886719 2.203125 L 8.320312 2.203125 C 7.460938 2.203125 6.742188 2.214844 6.726562 2.230469 M 8.480469 9.945312 C 8.414062 9.992188 8.402344 10.0625 8.414062 10.40625 L 8.425781 10.808594 L 23.371094 10.832031 L 23.371094 10.386719 C 23.371094 9.964844 23.367188 9.941406 23.269531 9.914062 C 23.046875 9.855469 8.558594 9.882812 8.480469 9.945312 M 8.425781 11.15625 C 8.414062 11.1875 8.410156 13.589844 8.414062 16.496094 L 8.425781 21.773438 L 23.347656 21.773438 L 23.347656 11.125 L 15.898438 11.113281 C 9.960938 11.101562 8.441406 11.113281 8.425781 11.15625 M 21.214844 12.515625 L 21.214844 12.898438 L 10.515625 12.898438 L 10.515625 12.136719 L 21.214844 12.136719 L 21.214844 12.515625 M 13.824219 13.921875 C 13.871094 13.964844 13.949219 14.046875 13.996094 14.101562 L 14.082031 14.203125 L 13.871094 14.410156 C 13.757812 14.519531 13.664062 14.621094 13.664062 14.636719 C 13.664062 14.664062 13.542969 14.785156 13.511719 14.785156 C 13.46875 14.785156 12.546875 15.734375 12.519531 15.804688 C 12.507812 15.839844 12.460938 15.878906 12.417969 15.898438 C 12.375 15.914062 12.214844 16.058594 12.058594 16.21875 L 11.777344 16.511719 L 11.679688 16.425781 C 11.621094 16.375 11.53125 16.292969 11.476562 16.238281 C 11.417969 16.183594 11.296875 16.082031 11.203125 16.015625 C 11.109375 15.945312 11.011719 15.867188 10.988281 15.839844 C 10.964844 15.8125 10.863281 15.707031 10.765625 15.605469 L 10.589844 15.417969 L 10.6875 15.3125 C 10.742188 15.253906 10.773438 15.191406 10.753906 15.167969 C 10.734375 15.148438 10.746094 15.144531 10.773438 15.164062 C 10.804688 15.183594 10.832031 15.175781 10.832031 15.148438 C 10.832031 15.074219 10.941406 15.09375 11.050781 15.1875 C 11.105469 15.234375 11.230469 15.335938 11.324219 15.414062 C 11.421875 15.492188 11.554688 15.605469 11.625 15.664062 C 11.695312 15.726562 11.765625 15.773438 11.785156 15.773438 C 11.800781 15.773438 12.246094 15.34375 12.773438 14.8125 C 13.300781 14.285156 13.730469 13.847656 13.734375 13.847656 C 13.738281 13.84375 13.777344 13.878906 13.824219 13.921875 M 21.214844 15.753906 L 21.214844 16.269531 L 14.382812 16.269531 L 14.382812 15.234375 L 21.214844 15.234375 L 21.214844 15.753906 M 13.910156 17.777344 C 13.996094 17.863281 14.066406 17.921875 14.066406 17.902344 C 14.066406 17.886719 14.082031 17.886719 14.097656 17.902344 C 14.125 17.929688 13.5625 18.519531 12.367188 19.710938 L 11.769531 20.308594 L 11.652344 20.210938 C 11.589844 20.15625 11.421875 20 11.28125 19.863281 C 11.136719 19.730469 10.929688 19.535156 10.816406 19.4375 C 10.570312 19.222656 10.566406 19.214844 10.753906 19.003906 C 10.925781 18.804688 10.925781 18.804688 11.367188 19.234375 C 11.542969 19.40625 11.722656 19.550781 11.765625 19.550781 C 11.804688 19.550781 12.265625 19.117188 12.785156 18.585938 C 13.894531 17.457031 13.714844 17.585938 13.910156 17.777344 M 21.214844 19.574219 L 21.214844 20.089844 L 14.382812 20.089844 L 14.382812 19.054688 L 21.214844 19.054688 L 21.214844 19.574219 "
      />
    </svg>,
    'settingsmobile',
  );

  return (
    <Paper square elevation={3}>
      <BottomNavigation value={currentSelection()} onChange={handleSelection} showLabels>
        {!isMobile && (
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={(
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <MapIcon fontSize="medium" />
            </Badge>
          )}
          value="map"
        />
        )}
        {isMobile && (
          <BottomNavigationAction
            label={devicesOpen || location.pathname !== '/' ? t('mapTitle') : t('deviceTitle')}
            icon={(
              <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
                {devicesOpen || location.pathname !== '/' ? <MapIcon fontSize="medium" /> : <DeviceIcon fontSize="medium" />}
              </Badge>
            )}
            value="devices"
          />
        )}
        {!disableReports && (
          <BottomNavigationAction
            label={t('reportTitle')}
            icon={(
              <DescriptionIcon fontSize={reportsSize} />
            )}
            value="reports"
          />
        )}
        {!isMobile && (
          <BottomNavigationAction label={t('settingsTitle')} icon={<SettingsIcon fontSize="medium" />} value="settings" />
        )}
        {readonly ? (
          <BottomNavigationAction
            label={t('loginLogout')}
            icon={<ExitToAppIcon fontSize="medium" />}
            value="logout"
          />
        ) : (
          <BottomNavigationAction
            label={isMobile ? t('settingsTitle') : t('settingsUser')}
            icon={isMobile ? <SettingsMobileIcon fontSize="medium" /> : <PersonIcon fontSize="medium" />}
            value="account"
          />
        )}
      </BottomNavigation>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {isMobile && (
          <MenuItem onClick={handleSettings}>
            <SettingsIcon fontSize="small" />
            &nbsp;
            <Typography color="textPrimary">{t('settingsTitle')}</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleAccount}>
          <PersonIcon fontSize="small" />
          &nbsp;
          <Typography color="textPrimary">{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon fontSize="small" />
          &nbsp;
          <Typography color="error">{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;
