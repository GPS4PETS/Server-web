import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import MapRouteCoordinates from '../map/MapRouteCoordinates';
import MapMarkers from '../map/MapMarkers';

const columnsArray = [
  ['startTime', 'reportStartTime'],
  ['endTime', 'reportEndTime'],
  ['steps', 'positionSteps'],
  ['distance', 'sharedDistance'],
  ['duration', 'reportDuration'],
];
/* const columnsMap = new Map(columnsArray); */

const activityColumnsArray = [
  ['startTime', 'reportStartTime'],
  ['endTime', 'reportEndTime'],
  ['averageSpeed', 'reportAverageSpeed'],
  ['maxSpeed', 'reportMaximumSpeed'],
  ['steps', 'positionSteps'],
  ['distance', 'sharedDistance'],
  ['duration', 'reportDuration'],
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
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('tripColumns', ['startTime', 'endTime', 'steps', 'distance', 'duration']);

  const [activityColumns] = usePersistedState('tripColumns', ['startTime', 'endTime', 'steps', 'distance', 'duration']);
  const [activityTime, setActivityTime] = useState(null);
  const [activitySteps, setActivitySteps] = useState(null);
  const [activityItems, setActivityItems] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activitySelectedItem, setActivitySelectedItem] = useState(null);
  const [route, setRoute] = useState(null);

  const [sleepColumns] = usePersistedState('stopColumns', ['startTime', 'endTime', 'duration']);
  const [sleepTime, setSleepTime] = useState(null);
  const [sleepItems, setSleepItems] = useState([]);
  const [sleepLoading, setSleepLoading] = useState(false);
  const [sleepSelectedItem, setSleepSelectedItem] = useState(null);

  const createActivityMarkers = () => ([
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

  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = useSelector((state) => state.devices.items);
  const [mapItems, setMapItems] = useState([]);
  const mapItemsCoordinates = useMemo(() => mapItems.flatMap((mapItem) => mapItem.route), [mapItems]);

  const createMapMarkers = () => mapItems.flatMap((mapItem) => mapItem.events
    .map((event) => mapItem.positions.find((p) => event.positionId === p.id))
    .filter((position) => position != null)
    .map((position) => ({
      latitude: position.latitude,
      longitude: position.longitude,
    })));

  const handleSubmit = useCatch(async ({ deviceId, from, to }) => {
    setActivityLoading(true);
    setSleepLoading(true);
    setActivityTime(null);
    setSleepTime(null);

    const mapQuery = new URLSearchParams({ from, to });
    mapQuery.append('deviceId', deviceId);
    try {
      const mapResponse = await fetch(`/api/reports/combined?${mapQuery.toString()}`);
      if (mapResponse.ok) {
        setMapItems(await mapResponse.json());
      } else {
        throw Error(await mapResponse.text());
      }
    } finally {
      setSelectedDevice(deviceId);
    }

    const activityQuery = new URLSearchParams({ deviceId, from, to });
    let activityJson;
    try {
      const activityResponse = await fetch(`/api/reports/trips?${activityQuery.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (activityResponse.ok) {
        activityJson = await activityResponse.json();
        setActivityItems(activityJson);
      } else {
        throw Error(await activityResponse.text());
      }
    } finally {
      let activityDuration = 0;
      let activitySteps = 0;
      activityJson.forEach((e) => activityDuration += e.duration);
      activityJson.forEach((e) => activitySteps += e.steps);
      setActivityTime(formatNumericHours(activityDuration, t));
      setActivitySteps(activitySteps);
      setActivityLoading(false);
    }

    const sleepQuery = new URLSearchParams({ deviceId, from, to });
    let sleepJson;
    try {
      const sleepResponse = await fetch(`/api/reports/stops?${sleepQuery.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (sleepResponse.ok) {
        sleepJson = await sleepResponse.json();
        setSleepItems(sleepJson);
      } else {
        throw Error(await sleepResponse.text());
      }
    } finally {
      let sleepDuration = 0;
      sleepJson.forEach((e) => sleepDuration += e.duration);
      setSleepTime(formatNumericHours(sleepDuration, t));
      setSleepLoading(false);
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
        <div className={classes.containerFilter}>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} loading={activityLoading}>
              <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
            </ReportFilter>
          </div>
        </div>
        {!sleepSelectedItem && !activitySelectedItem && selectedDevice != null && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {mapItems.map((item) => (
                <MapRouteCoordinates
                  key={item.deviceId}
                  name={devices[item.deviceId].name}
                  coordinates={item.route}
                  deviceId={item.deviceId}
                />
              ))}
              <MapMarkers markers={createMapMarkers()} />
            </MapView>
            <MapScale />
            <MapCamera coordinates={mapItemsCoordinates} />
          </div>
        )}
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
                  <MapMarkers markers={createActivityMarkers()} />
                  <MapCamera positions={route} />
                </>
              )}
            </MapView>
            <MapScale />
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            &nbsp;
          </div>
          <div className={classes.header2}>
            {t('reportActivityTime')}
            &nbsp;
            {activityTime !== null && (
              ` ${activityTime} `
            )}
            &nbsp;
            {activitySteps !== null && (
              ` ${activitySteps} ${t('positionSteps')}`
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {activityColumns.map((activityKey) => (<TableCell key={activityKey}>{t(activityColumnsMap.get(activityKey))}</TableCell>))}
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
            &nbsp;
            {sleepTime !== null && (
              `${sleepTime}`
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {sleepColumns.map((sleepKey) => (<TableCell key={sleepKey}>{t(SleepColumnsMap.get(sleepKey))}</TableCell>))}
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
