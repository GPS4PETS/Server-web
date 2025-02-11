/* eslint-disable react/no-array-index-key */
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material';
import ReportFilter from './components/ReportFilter';
import { formatNumericHours } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import MapRouteCoordinates from '../map/MapRouteCoordinates';
import MapMarkers from '../map/MapMarkers';

const OverviewReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const theme = useTheme();
  const t = useTranslation();

  const [activityTime, setActivityTime] = useState(null);
  const [activitySteps, setActivitySteps] = useState(null);
  const [sleepTime, setSleepTime] = useState(null);

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
    setActivityTime(null);
    setSleepTime(null);
    setActivitySteps(null);

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
      } else {
        throw Error(await activityResponse.text());
      }
    } finally {
      let activityDuration = 0;
      let activitySteps = 0;
      activityJson.forEach((e) => activityDuration += e.duration);
      activityJson.forEach((e) => activitySteps += e.steps);
      setActivityTime(activityDuration);
      setActivitySteps(activitySteps);
    }

    const sleepQuery = new URLSearchParams({ deviceId, from, to });
    let sleepJson;
    try {
      const sleepResponse = await fetch(`/api/reports/stops?${sleepQuery.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (sleepResponse.ok) {
        sleepJson = await sleepResponse.json();
      } else {
        throw Error(await sleepResponse.text());
      }
    } finally {
      let sleepDuration = 0;
      sleepJson.forEach((e) => sleepDuration += e.duration);
      setSleepTime(sleepDuration);
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

  const activityPieData = [
    { name: t('reportActivityTime'), value: activityTime },
    { name: t('reportActivityTimeWanted'), value: ((7200000 - (activityTime != null ? activityTime : 0)) < 0) ? 0 : (7200000 - (activityTime != null ? activityTime : 0)) },
  ];

  const sleepPieData = [
    { name: t('reportSleepTime'), value: sleepTime },
    { name: t('reportSleepTimeWanted'), value: ((36000000 - (sleepTime != null ? sleepTime : 0)) < 0) ? 0 : (36000000 - (sleepTime != null ? sleepTime : 0)) },
  ];

  const stepsPieData = [
    { name: t('positionSteps'), value: activitySteps },
    { name: t('reportStepsWanted'), value: ((15000 - (activitySteps != null ? activitySteps : 0)) < 0) ? 0 : (15000 - (activitySteps != null ? activitySteps : 0)) },
  ];

  const activityColors = ['#82ca9d', '#333333'];
  const sleepColors = ['#8884D8', '#333333'];
  const stepsColors = ['#8884D8', '#333333'];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportActivity']}>
      <div className={classes.container}>
        <div className={classes.containerFilter}>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule}>
            </ReportFilter>
          </div>
        </div>
        {selectedDevice != null && (
          <>
            <div className={classes.containerActivity}>
              <div className={classes.containerActivityHead}>
                {t('reportActivityTime')}
              </div>
              <div className={classes.containerActivityHead}>
                {t('positionSteps')}
              </div>
              <div className={classes.containerActivityHead}>
                {t('reportSleepTime')}
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart width={400} height={600}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={activityPieData}
                    cx="25%"
                    cy="25%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#82ca9d"
                    label={(data) => formatNumericHours(data.payload.value, t)}
                  >

                    {activityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={activityColors[index % activityColors.length]} />
                    ))}
                  </Pie>
                  <Pie
                    dataKey="value"
                    data={sleepPieData}
                    cx="75%"
                    cy="25%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#82ca9d"
                    label={(data) => formatNumericHours(data.payload.value, t)}
                  >
                    {sleepPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sleepColors[index % sleepColors.length]} />
                    ))}
                  </Pie>
                  <Pie
                    dataKey="value"
                    data={stepsPieData}
                    cx="50%"
                    cy="75%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#82ca9d"
                  >
                    {stepsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stepsColors[index % stepsColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07246e80', color: theme.palette.text.primary }}
                    formatter={(value, key) => [key === 'steps' ? value : formatNumericHours(value, t), key || key]}
                    labelFormatter={(value, key) => [key === 'steps' ? value : formatNumericHours(value, t), key || key]}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={classes.containerActivity}>
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
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default OverviewReportPage;
