import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { createSvgIcon } from '@mui/material/utils';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Draggable from 'react-draggable';
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
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import LiveModeIcon from '@mui/icons-material/Streetview';
import LightIcon from '@mui/icons-material/Flare';
import BuzzerIcon from '@mui/icons-material/VolumeUp';
import ShareIcon from '@mui/icons-material/Share';

import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly, useAdministrator } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';

import {
  formatPercentage, getStatusColor,
} from '../util/formatter';

const useStyles = makeStyles((theme) => ({
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
    '&.MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '&.MuiTableCell-sizeSmall:first-child': {
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
    width: '48%',
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
  root: ({ desktopPadding }) => ({
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
  }),
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

const StatusRow = ({ name, content }) => {
  const classes = useStyles();

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

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  if (deviceId === null) {
    onClose();
  }

  const classes = useStyles({ desktopPadding });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
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
    if (lmcounter > 0) {
      timer = setTimeout(() => setLmcounter((c) => c - 1), 1000);
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
    if (lcounter > 0) {
      timer = setTimeout(() => setLcounter((c) => c - 1), 1000);
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
    if (bcounter > 0) {
      timer = setTimeout(() => setBcounter((c) => c - 1), 1000);
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

  useEffect(() => {
    function getLightl() {
      let tmpll = true;
      if (lml) { tmpll = false; } else { tmpll = true; }
      setLightl(tmpll);
    }
    getLightl();
  });

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
        setLmcounter(0);
      } else {
        livemodedis = true;
        const tmpd = fetchdev.substring((fetchdev.indexOf('"liveModetime":') + 16), (fetchdev.indexOf('"liveModetime":') + 26));
        const tmpt = fetchdev.substring((fetchdev.indexOf('"liveModetime":') + 27), (fetchdev.indexOf('"liveModetime":') + 35));
        const now = dayjs();
        let lmts = dayjs(tmpd.concat(' ').concat(tmpt));
        lmts = lmts.add(1, 'hour');
        let lmtime = now.diff(lmts, 'second');
        lmtime = 300 - lmtime;
        if (lmcounter === 0 && lmtime > 0 && lmtime <= 300) {
          setLml(false);
          setLmcounter((lmtime));
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
      } else if (lcounter > 0) {
        ldcolor = '#FFFF0080';
      }
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
      } else if (bcounter > 0) {
        bdcolor = '#0000FF80';
      }
      setBuzzerdcolor(bdcolor);
    }
    getBuzzerdcolor();
  }, [fetchpos, bcounter]);

  const livemodehandle = useCatch(async () => {
    // livemode
    // setLmcounter(300);
    setLml(true);
    setLmcolor('#00FF0080');
    fetch('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"id":22,"attributes":{},"deviceId":${deviceId},"type":"liveModeOn","textChannel":false,"description":"LiveMode"}`,
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
      body: `{"id":9,"attributes":{},"deviceId":${deviceId},"type":"lightOn","textChannel":false,"description":"Licht An"}`,
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
      body: `{"id":7,"attributes":{},"deviceId":${deviceId},"type":"buzzerOn","textChannel":false,"description":"Buzzer An"}`,
    });
  });

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Draggable
            handle={`.${classes.media}, .${classes.header}`}
          >
            <Card elevation={3} className={classes.card}>
              {!isMobile && deviceImage && (
                <CardMedia
                  className={classes.media}
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
                      disabled={lightdcolor === '#FFFF0080'}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${lightdcolor}`,
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
                      disabled={buzzerdcolor === '#0000FF80'}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${buzzerdcolor}`,
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
                      disabled={lmd || lmcolor === '#00FF0080'}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: `${lmcolor}`,
                        },
                      }}
                    >
                      {t('liveModeActivate')}
                      {lmcounter > 0 && (
                        ` (${formatTime(lmcounter)})`
                      )}
                    </Button>
                    <Button
                      type="button"
                      className={classes.button}
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => navigate(`/settings/device/${deviceId}/share`)}
                      sx={{
                        '.MuiButton-startIcon': {
                          marginLeft: '-10px',
                          marginRight: '4px',
                        },
                      }}
                    >
                      {t('deviceShare')}
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
          </Draggable>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}><Typography color="secondary">{t('deviceShare')}</Typography></MenuItem>
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
