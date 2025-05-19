import React, { useState, useRef } from 'react';
import { createSvgIcon } from '@mui/material/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar, IconButton, OutlinedInput, InputAdornment, Popover, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Badge, ListItemButton, ListItemText, Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import { sessionActions } from '../store';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator, useDeviceReadonly } from '../common/util/permissions';
import DeviceRow from './DeviceRow';

const useStyles = makeStyles()((theme) => ({
  toolbar: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
}));

const MainToolbar = ({
  filteredDevices,
  keyword,
  setKeyword,
  filter,
  setFilter,
  filterSort,
  setFilterSort,
  filterMap,
  setFilterMap,
}) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const t = useTranslation();
  const dispatch = useDispatch();

  const admin = useAdministrator();
  const deviceReadonly = useDeviceReadonly();

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const devicesOpen = useSelector((state) => state.session.devicesOpen);

  const toolbarRef = useRef();
  const inputRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [devicesAnchorEl, setDevicesAnchorEl] = useState(null);

  const deviceStatusCount = (status) => Object.values(devices).filter((d) => d.status === status).length;

  const handleClick = () => {
    dispatch(sessionActions.setDevicesOpen(!devicesOpen));
  };

  const handleListClick = () => {
    dispatch(sessionActions.setDevicesOpen(true));
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
      <g id="surface1">
        <path
          stroke="none"
          fillRule="none"
          fill="currentcolor"
          fillOpacity="1"
          d="M11.54 1.219a4.07 4.07 0 0 0-2.794 1.59c-.105.136-.11.14-.203.156-3.113.394-5.559 1.23-7.082 2.414a6.6 6.6 0 0 0-.75.71c-.27.321-.488.712-.598 1.056-.117.37-.113.351-.11 2.593l.009 2.032.047.195c.058.226.117.387.218.594.75 1.496 3 2.746 6.149 3.418.625.132 1.75.324 1.914.324.031 0 .058.008.058.015 0 .004-.035.07-.078.149a4.18 4.18 0 0 0-.5 2.781c.313 1.824 1.79 3.242 3.598 3.461.094.012.21.027.27.04.058.007.144.01.195.007l.523-.04c.133-.007.215-.019.426-.062a4.21 4.21 0 0 0 3.2-3.148c.14-.594.14-1.305 0-1.902a4.4 4.4 0 0 0-.458-1.153c-.035-.058-.066-.11-.066-.117 0-.004.082-.016.18-.031.289-.035.968-.145 1.289-.203 2.222-.422 4.003-1.078 5.242-1.93.3-.211.488-.363.742-.605.523-.504.832-1.008.98-1.598l.047-.195.008-2.032C24 7.93 24 7.684 23.97 7.516c-.14-.934-.836-1.805-2.02-2.555C20.484 4.039 18.25 3.332 15.73 3c-.199-.027-.39-.05-.421-.059-.047-.007-.075-.03-.137-.113a4.7 4.7 0 0 0-.727-.75 4.3 4.3 0 0 0-1.238-.672 4.1 4.1 0 0 0-1.668-.187m.913.933a3.03 3.03 0 0 1 1.727.91c.449.47.718 1.012.832 1.672.05.29.039.805-.02 1.086a3.05 3.05 0 0 1-.863 1.586c-.316.301-.555.547-1.152 1.16-.317.332-.68.704-.801.829l-.223.226-.664-.68c-1.039-1.066-1.285-1.316-1.45-1.464a3.14 3.14 0 0 1-.847-1.34 3.04 3.04 0 0 1 .203-2.332 3 3 0 0 1 .715-.926 3.2 3.2 0 0 1 1.777-.762c.153-.015.598.004.766.035m3.711 1.828a24 24 0 0 1 1.816.368c2.84.71 4.723 1.875 5.063 3.132.059.215.059.551 0 .762-.055.203-.2.488-.336.676-.227.309-.66.703-1.09.992-.617.41-1.48.817-2.398 1.121-1.657.555-3.532.883-5.79 1.008a41 41 0 0 1-3.015-.008c-1.922-.117-3.437-.36-4.922-.777q-2.131-.603-3.426-1.57a5 5 0 0 1-.773-.766 2.3 2.3 0 0 1-.332-.664c-.215-.777.227-1.594 1.258-2.32 1.226-.868 3.246-1.575 5.562-1.946.192-.031.352-.05.356-.047s-.02.094-.051.204a4.05 4.05 0 0 0-.035 1.992c.035.164.242.797.285.875a.2.2 0 0 1 .027.062c0 .008.043.074.098.149.36.504.41.562.832.984.238.23.863.871 1.395 1.422.53.547 1 1.016 1.039 1.039a.4.4 0 0 0 .187.05c.227.02.176.067 1.43-1.226.617-.633 1.152-1.18 1.183-1.21.286-.243.649-.66.786-.9a.5.5 0 0 1 .097-.132c.043-.027.266-.5.266-.57a.4.4 0 0 1 .035-.106c.055-.101.14-.414.191-.676.036-.191.04-.285.04-.691 0-.371-.008-.508-.032-.648a10 10 0 0 0-.156-.618c-.012-.027-.004-.03.043-.02zM1.293 10.215c1.664 1.406 4.848 2.41 8.539 2.687l.184.012v1.918l-.149.086c-.203.117-.394.25-.601.422-.145.12-.184.14-.23.137-1.384-.165-2.52-.383-3.552-.68-2.293-.664-3.859-1.606-4.39-2.64-.184-.36-.176-.31-.184-1.376l-.008-.933.137.132c.074.07.188.176.254.235m21.797.668c0 .594-.008.86-.024.887-.011.02-.043.097-.066.175-.02.075-.047.14-.05.149a1 1 0 0 0-.083.136c-.273.5-.84 1.012-1.617 1.457-1.457.84-3.684 1.485-6.09 1.766-.332.04-.344.04-.383.004-.023-.02-.117-.094-.214-.172a4 4 0 0 0-.594-.406l-.086-.047v-1.906l.078-.012.246-.02c1.258-.082 2.996-.359 4.098-.656a15.428 15.428 0 0 0 2.691-.953c.781-.375 1.469-.828 1.93-1.273l.16-.149.004.086c.004.047.004.465 0 .934m-10.113 2.844v.761l-.149-.035a4.3 4.3 0 0 0-1.695-.008l-.203.04v-1.516h2.047Zm-.704 1.558a3.28 3.28 0 0 1 2.063 1.024 3.33 3.33 0 0 1 .844 1.636c.035.184.043.266.043.61 0 .445-.028.629-.149 1.008a4 4 0 0 1-.445.894c-.309.426-.75.805-1.223 1.04a3.32 3.32 0 0 1-2.57.144 3.29 3.29 0 0 1-2.106-3.739c.336-1.64 1.887-2.789 3.543-2.617m0 0"
        />
        <path
          stroke="none"
          fillRule="none"
          fill="currentcolor"
          fillOpacity="1"
          d="M11.594 3.46a1.81 1.81 0 0 0-1.371 1.294c-.051.2-.059.695-.008.871.117.422.34.766.66 1.008.164.125.453.262.652.312.227.055.633.055.844 0 .656-.172 1.129-.644 1.313-1.312.062-.219.058-.633-.008-.871a2.1 2.1 0 0 0-.258-.567 2 2 0 0 0-.672-.582 2.3 2.3 0 0 0-.453-.152 2.5 2.5 0 0 0-.7 0m.582.903a.89.89 0 0 1 .64.98.89.89 0 0 1-.472.645.83.83 0 0 1-.778.004c-.718-.363-.629-1.379.149-1.629.098-.031.348-.031.46 0M11.625 16.3a2.3 2.3 0 0 0-1.867 1.665 2.28 2.28 0 0 0 .297 1.84c.129.199.449.52.633.64.21.137.457.246.699.313.207.05.234.055.566.055.32 0 .367-.004.531-.047.848-.23 1.438-.813 1.672-1.649.047-.172.047-.207.047-.562s0-.39-.047-.563c-.234-.836-.836-1.43-1.672-1.644a1.6 1.6 0 0 0-.464-.055c-.157-.004-.336 0-.395.008m.582.915c.434.082.8.367.98.765.09.2.126.352.126.575s-.036.375-.126.57a1.364 1.364 0 0 1-2.421.105 1.2 1.2 0 0 1-.176-.668c0-.257.027-.386.137-.609.265-.55.875-.855 1.48-.738m0 0"
        />
      </g>
    </svg>,
    'device',
  );

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <IconButton edge="start" onClick={handleClick}>
        {devicesOpen ? <MapIcon /> : <DeviceIcon />}
      </IconButton>
      <OutlinedInput
        ref={inputRef}
        placeholder={t('sharedSearchDevices')}
        id={t('sharedSearchDevices')}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setDevicesAnchorEl(toolbarRef.current)}
        onBlur={() => setDevicesAnchorEl(null)}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={() => setFilterAnchorEl(inputRef.current)}>
              <Badge color="info" variant="dot" invisible={!filter.statuses.length && !filter.groups.length}>
                <TuneIcon fontSize="small" />
              </Badge>
            </IconButton>
          </InputAdornment>
        )}
        size="small"
        fullWidth
      />
      <Popover
        open={!!devicesAnchorEl && !devicesOpen}
        anchorEl={devicesAnchorEl}
        onClose={() => setDevicesAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: Number(theme.spacing(2).slice(0, -2)),
        }}
        marginThreshold={0}
        slotProps={{
          paper: {
            style: { width: `calc(${toolbarRef.current?.clientWidth}px - ${theme.spacing(4)})` },
          },
        }}
        elevation={1}
        disableAutoFocus
        disableEnforceFocus
      >
        {filteredDevices.slice(0, 3).map((_, index) => (
          <DeviceRow key={filteredDevices[index].id} data={filteredDevices} index={index} />
        ))}
        {filteredDevices.length > 3 && (
          <ListItemButton alignItems="center" onClick={handleListClick}>
            <ListItemText
              primary={t('notificationAlways')}
              style={{ textAlign: 'center' }}
            />
          </ListItemButton>
        )}
      </Popover>
      <Popover
        open={!!filterAnchorEl}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.filterPanel}>
          <FormControl>
            <InputLabel>{t('deviceStatus')}</InputLabel>
            <Select
              label={t('deviceStatus')}
              value={filter.statuses}
              onChange={(e) => setFilter({ ...filter, statuses: e.target.value })}
              multiple
            >
              <MenuItem value="online">{`${t('deviceStatusOnline')} (${deviceStatusCount('online')})`}</MenuItem>
              <MenuItem value="offline">{`${t('deviceStatusOffline')} (${deviceStatusCount('offline')})`}</MenuItem>
              <MenuItem value="unknown">{`${t('deviceStatusUnknown')} (${deviceStatusCount('unknown')})`}</MenuItem>
            </Select>
          </FormControl>
          {admin && (
            <FormControl>
              <InputLabel>{t('settingsGroups')}</InputLabel>
              <Select
                label={t('settingsGroups')}
                value={filter.groups}
                onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
                multiple
              >
                {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl>
            <InputLabel>{t('sharedSortBy')}</InputLabel>
            <Select
              label={t('sharedSortBy')}
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">{'\u00a0'}</MenuItem>
              <MenuItem value="name">{t('sharedName')}</MenuItem>
              <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
            </Select>
          </FormControl>
          {admin && (
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={filterMap} onChange={(e) => setFilterMap(e.target.checked)} />}
                label={t('sharedFilterMap')}
              />
            </FormGroup>
          )}
        </div>
      </Popover>
      {admin && (
      <IconButton edge="end" onClick={() => navigate('/settings/device')} disabled={deviceReadonly}>
        <Tooltip open={admin && Object.keys(devices).length === 0} title={t('deviceRegisterFirst')} arrow>
          <AddIcon />
        </Tooltip>
      </IconButton>
      )}
    </Toolbar>
  );
};

export default MainToolbar;
