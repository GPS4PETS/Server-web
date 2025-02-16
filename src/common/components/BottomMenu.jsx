import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography, Badge,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Build';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
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

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return 'account';
    } if (location.pathname.startsWith('/settings')) {
      return 'settings';
    } if (location.pathname.startsWith('/reports')) {
      return 'reports';
    } if (location.pathname === '/') {
      return 'map';
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
          dispatch(sessionActions.setDevicesOpen(!devicesOpen));
        } else {
          navigate('/');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Paper square elevation={3}>
      <BottomNavigation value={currentSelection()} onChange={handleSelection} showLabels>
        {!isMobile && (
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={(
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <MapIcon />
            </Badge>
          )}
          value="map"
          sx={{
            fontSize: '1.4em',
          }}
        />
        )}
        {isMobile && (
          <BottomNavigationAction
            label={devicesOpen || location.pathname !== '/' ? t('mapTitle') : t('deviceTitle')}
            icon={(
              <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
                {devicesOpen || location.pathname !== '/' ? <MapIcon /> : <ViewListIcon />}
              </Badge>
            )}
            value="devices"
            sx={{
              fontSize: '1.4em',
            }}
          />
        )}
        {!disableReports && (
          <BottomNavigationAction
            label={t('reportTitle')}
            icon={<DescriptionIcon />}
            value="reports"
            sx={{
              fontSize: '1.4em',
            }}
          />
        )}
        { /*
        <BottomNavigationAction label={t('settingsTitle')} icon={<SettingsIcon />} value="settings" />
        */ }
        {readonly ? (
          <BottomNavigationAction
            label={t('loginLogout')}
            icon={<ExitToAppIcon />}
            value="logout"
            sx={{
              fontSize: '1.4em',
            }}
          />
        ) : (
          <BottomNavigationAction
            label={t('settingsTitle')}
            icon={<SettingsIcon />}
            value="account"
            sx={{
              fontSize: '1.4em',
            }}
          />
        )}
      </BottomNavigation>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" />
          &nbsp;
          <Typography color="textPrimary">{t('settingsTitle')}</Typography>
        </MenuItem>
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
