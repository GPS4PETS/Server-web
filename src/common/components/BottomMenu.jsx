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
