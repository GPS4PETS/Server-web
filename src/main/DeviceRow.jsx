import { useDispatch, useSelector } from 'react-redux';
import { createSvgIcon } from '@mui/material/utils';
import { makeStyles } from 'tss-react/mui';
import {
  IconButton, Tooltip, Avatar, ListItemAvatar, ListItemText, ListItemButton,
  Typography,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import LightIcon from '@mui/icons-material/LightMode';
import BuzzerIcon from '@mui/icons-material/NotificationsActive';
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

const useStyles = makeStyles()((theme) => ({
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
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const deviceImage = item?.attributes?.deviceImage;

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
        selected={selectedDeviceId === item.id}
        className={selectedDeviceId === item.id ? classes.selected : null}
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
          secondary={secondaryText()}
          slots={{
            primary: Typography,
            secondary: Typography,
          }}
          slotProps={{
            primary: { noWrap: true },
            secondary: { noWrap: true },
          }}
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
