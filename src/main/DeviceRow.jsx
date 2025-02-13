import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  IconButton, Tooltip, Avatar, ListItemAvatar, ListItemText, ListItemButton,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import LiveModeIcon from '@mui/icons-material/Streetview';
import LightIcon from '@mui/icons-material/Flare';
import BuzzerIcon from '@mui/icons-material/VolumeUp';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm, formatPercentage, formatStatus, getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import { useAttributePreference } from '../common/util/preferences';

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  avataricon: {
    width: '25px',
    height: '18px',
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
  light: {
    color: '#FFFF0080',
  },
  sound: {
    color: '#0000FF80',
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const deviceImage = item?.attributes?.deviceImage;

  const secondaryText = () => {
    let status;
    if (item.status === 'online' || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }

    return (
      <>
        {deviceSecondary && item[deviceSecondary] && `${item[deviceSecondary]} • `}
        <span className={classes[getStatusColor(item.status)]}>
          {status}
        </span>
        {position && (
          <>
            <br />
            <span>
              {t('deviceLastUpdateShort')}
              : &nbsp;
              {dayjs(position.serverTime).fromNow()}
            </span>
          </>
        )}
      </>
    );
  };

  return (
    <div style={style}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
      >
        {deviceImage ? (
          <ListItemAvatar>
            <Avatar>
              <img className={classes.avataricon} src={`/api/media/${item.uniqueId}/${deviceImage}`} alt="" />
            </Avatar>
          </ListItemAvatar>
        ) : (
          <ListItemAvatar>
            <Avatar>
              <img className={classes.avataricon} src="/device.png" alt="" />
            </Avatar>
          </ListItemAvatar>
        )}
        <ListItemText
          primary={item[devicePrimary]}
          primaryTypographyProps={{ noWrap: true }}
          secondary={secondaryText()}
          secondaryTypographyProps={{ noWrap: true }}
        />
        {position && (
          <>
            {item.liveModetime.indexOf('2000-01') === -1 && (
              <Tooltip title={t('liveModeActivate')}>
                <IconButton size="small">
                  <LiveModeIcon fontSize="small" className={classes.success} />
                </IconButton>
              </Tooltip>
            )}
            {(position.attributes.hasOwnProperty('lightswitch') && position.attributes.lightswitch === 1) && (
              <Tooltip title={t('lightActivate')}>
                <IconButton size="small">
                  <LightIcon fontSize="small" className={classes.light} />
                </IconButton>
              </Tooltip>
            )}
            {(position.attributes.hasOwnProperty('soundswitch') && position.attributes.soundswitch === 1) && (
              <Tooltip title={t('buzzerActivate')}>
                <IconButton size="small">
                  <BuzzerIcon fontSize="small" className={classes.sound} />
                </IconButton>
              </Tooltip>
            )}
            {position.attributes.hasOwnProperty('alarm') && (
              <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                <IconButton size="small">
                  <ErrorIcon fontSize="small" className={classes.error} />
                </IconButton>
              </Tooltip>
            )}
            {position.attributes.hasOwnProperty('batteryLevel') && (
              <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)} ${position.attributes.charge ? t('positionCharge') : ''}`}>
                <IconButton size="small">
                  {(position.attributes.batteryLevel > 70 && (
                    position.attributes.charge
                      ? (<BatteryChargingFullIcon fontSize="small" className={classes.success} />)
                      : (<BatteryFullIcon fontSize="small" className={classes.success} />)
                  )) || (position.attributes.batteryLevel > 30 && (
                    position.attributes.charge
                      ? (<BatteryCharging60Icon fontSize="small" className={classes.warning} />)
                      : (<Battery60Icon fontSize="small" className={classes.warning} />)
                  )) || (
                    position.attributes.charge
                      ? (<BatteryCharging20Icon fontSize="small" className={classes.error} />)
                      : (<Battery20Icon fontSize="small" className={classes.error} />)
                  )}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
