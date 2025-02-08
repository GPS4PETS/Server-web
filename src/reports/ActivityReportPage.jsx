import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import {
  formatDistance, formatSpeed, formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch, useEffectAsync } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import MapPositions from '../map/MapPositions';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import AddressValue from '../common/components/AddressValue';
import TableShimmer from '../common/components/TableShimmer';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import MapRoutePath from '../map/MapRoutePath';
import MapMarkers from '../map/MapMarkers';

const columnsArray = [
  ['startTime', 'reportStartTime'],
  ['endTime', 'reportEndTime'],
  ['distance', 'sharedDistance'],
  ['averageSpeed', 'reportAverageSpeed'],
  ['duration', 'reportDuration'],
  ['maxSpeed', 'reportMaximumSpeed'],
];
/* const columnsMap = new Map(columnsArray); */

const activityColumnsArray = [
  ['startTime', 'reportStartTime'],
  ['endTime', 'reportEndTime'],
  ['distance', 'sharedDistance'],
  ['averageSpeed', 'reportAverageSpeed'],
  ['duration', 'reportDuration'],
  ['maxSpeed', 'reportMaximumSpeed'],
];
const activityColumnsMap = new Map(activityColumnsArray);

const SleepColumnsArray = [
  ['startTime', 'reportStartTime'],
  ['endTime', 'reportEndTime'],
  ['duration', 'reportDuration'],
];
const SleepColumnsMap = new Map(SleepColumnsArray);

const ActivityReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit')
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('tripColumns', ['startTime', 'endTime', 'distance', 'averageSpeed', 'duration']);

  const [activityColumns, setActivityColumns] = usePersistedState('tripColumns', ['startTime', 'endTime', 'distance', 'averageSpeed', 'duration']);
  const [activityItems, setActivityItems] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activitySelectedItem, setActivitySelectedItem] = useState(null);
  const [route, setRoute] = useState(null);


  const [sleepColumns, setSleepColumns] = usePersistedState('stopColumns', ['startTime', 'endTime', 'duration']);
  const [sleepItems, setSleepItems] = useState([]);
  const [sleepLoading, setSleepLoading] = useState(false);
  const [sleepSelectedItem, setSleepSelectedItem] = useState(null);

  const createMarkers = () => ([
    {
      latitude: activitySelectedItem.startLat,
      longitude: activitySelectedItem.startLon,
      image: 'start-success',
    },
    {
      latitude: activitySelectedItem.endLat,
      longitude: activitySelectedItem.endLon,
      image: 'finish-error',
    },
  ]);

  useEffectAsync(async () => {
    if (activitySelectedItem) {
      const query = new URLSearchParams({
        deviceId: activitySelectedItem.deviceId,
        from: activitySelectedItem.startTime,
        to: activitySelectedItem.endTime,
      });
      const response = await fetch(`/api/reports/route?${query.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        setRoute(await response.json());
      } else {
        throw Error(await response.text());
      }
    } else {
      setRoute(null);
    }
  }, [activitySelectedItem]);

  const handleSubmit = useCatch(async ({ deviceId, from, to, type }) => {
    let query = new URLSearchParams({ deviceId, from, to });
    if (type === 'export') {
      window.location.assign(`/api/reports/stops/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/stops/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setSleepLoading(true);
      try {
        const response = await fetch(`/api/reports/stops?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setSleepItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setSleepLoading(false);
      }
    }
    query = new URLSearchParams({ deviceId, from, to });
    if (type === 'export') {
      window.location.assign(`/api/reports/trips/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/trips/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setActivityLoading(true);
      try {
        const response = await fetch(`/api/reports/trips?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setActivityItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setActivityLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'stops';
    let error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
    report.type = 'trips';
    error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
        return formatTime(value, 'minutes');
      case 'startOdometer':
        return formatDistance(value, distanceUnit, t);
      case 'duration':
        return formatNumericHours(value, t);
      case 'engineHours':
        return value > 0 ? formatNumericHours(value, t) : null;
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
      case 'address':
        return (<AddressValue latitude={item.latitude} longitude={item.longitude} originalAddress={value} />);
      case 'distance':
        return formatDistance(value, distanceUnit, t);
      case 'averageSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : null;
      case 'startAddress':
        return (<AddressValue latitude={item.startLat} longitude={item.startLon} originalAddress={value} />);
      case 'endAddress':
        return (<AddressValue latitude={item.endLat} longitude={item.endLon} originalAddress={value} />);
      default:
        return value;
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportActivity']}>
      <div className={classes.container}>
        {sleepSelectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              <MapPositions
                positions={[{
                  deviceId: sleepSelectedItem.deviceId,
                  fixTime: sleepSelectedItem.startTime,
                  latitude: sleepSelectedItem.latitude,
                  longitude: sleepSelectedItem.longitude,
                }]}
                titleField="fixTime"
              />
            </MapView>
            <MapScale />
            <MapCamera latitude={sleepSelectedItem.latitude} longitude={sleepSelectedItem.longitude} />
          </div>
        )}
        {activitySelectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {route && (
                <>
                  <MapRoutePath positions={route} />
                  <MapMarkers markers={createMarkers()} />
                  <MapCamera positions={route} />
                </>
              )}
            </MapView>
            <MapScale />
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} loading={activityLoading}>
              <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
            </ReportFilter>
          </div>
          <div className={classes.header2}>
            {t('reportActivityTime')}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {activityColumns.map((key) => (<TableCell key={key}>{t(activityColumnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!activityLoading ? activityItems.map((activityItem) => (
                <TableRow key={activityItem.startPositionId}>
                  <TableCell className={classes.columnAction} padding="none">
                    {activitySelectedItem === activityItem ? (
                      <IconButton size="small" onClick={() => setActivitySelectedItem(null)}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => { setActivitySelectedItem(activityItem); setSleepSelectedItem(null); }}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  {activityColumns.map((activityKey) => (
                    <TableCell key={activityKey}>
                      {formatValue(activityItem, activityKey)}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={activityColumns.length + 1} startAction />)}
            </TableBody>
          </Table>
          <div className={classes.header}>
            &nbsp;
          </div>
          <div className={classes.header2}>
            {t('reportSleepTime')}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {sleepColumns.map((key) => (<TableCell key={key}>{t(SleepColumnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!sleepLoading ? sleepItems.map((sleepItem) => (
                <TableRow key={sleepItem.positionId}>
                  <TableCell className={classes.columnAction} padding="none">
                    {sleepSelectedItem === sleepItem ? (
                      <IconButton size="small" onClick={() => setSleepSelectedItem(null)}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => { setSleepSelectedItem(sleepItem); setActivitySelectedItem(null); }}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  {sleepColumns.map((sleepKey) => (
                    <TableCell key={sleepKey}>
                      {formatValue(sleepItem, sleepKey)}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={sleepColumns.length + 1} startAction />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default ActivityReportPage;
