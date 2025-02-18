import React, { useState, useRef } from 'react';
import { createSvgIcon } from '@mui/material/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar, IconButton, OutlinedInput, InputAdornment, Popover, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Badge, ListItemButton, ListItemText, Tooltip,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import { sessionActions } from '../store';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator, useDeviceReadonly } from '../common/util/permissions';
import DeviceRow from './DeviceRow';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
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

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <IconButton edge="start" onClick={handleClick}>
        {devicesOpen ? <MapIcon /> : <ViewListIcon />}
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
