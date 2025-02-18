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
import ViewListIcon from '@mui/icons-material/ViewList';
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
                {devicesOpen || location.pathname !== '/' ? <MapIcon fontSize="medium" /> : <ViewListIcon fontSize="medium" />}
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
            icon={isMobile ? <SettingsIcon fontSize="medium" /> : <PersonIcon fontSize="medium" />}
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
