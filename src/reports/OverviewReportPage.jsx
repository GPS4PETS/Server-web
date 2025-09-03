import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
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
  const t = useTranslation();

  const [activityTime, setActivityTime] = useState(null);
  const [activitySteps, setActivitySteps] = useState(null);
  const [sleepTime, setSleepTime] = useState(null);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = useSelector((state) => state.devices.items);
  const [mapItems, setMapItems] = useState([]);
  const mapItemsCoordinates = useMemo(() => mapItems.flatMap((mapItem) => mapItem.route), [mapItems]);

  const [wantedActivityTime, setWantedActivityTime] = useState(0);
  const [wantedSleepTime, setWantedSleepTime] = useState(0);
  const [wantedSteps, setWantedSteps] = useState(0);

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

    const timediff = Math.round((dayjs(to).unix() - dayjs(from).unix()) / 86400);

    let wantedServerJson;
    try {
      const WantedServerResponse = await fetch('/api/server', {
        headers: { Accept: 'application/json' },
      });
      if (WantedServerResponse.ok) {
        wantedServerJson = await WantedServerResponse.json();
      } else {
        throw Error(await WantedServerResponse.text());
      }
    } finally {
      const activityTimeWantedServer = wantedServerJson.activityTimeWanted * 60 * 1000;
      setWantedActivityTime(activityTimeWantedServer * timediff);
      const sleepTimeWantedServer = wantedServerJson.sleepTimeWanted * 60 * 1000;
      setWantedSleepTime(sleepTimeWantedServer * timediff);
      const stepsWantedServer = wantedServerJson.stepsWanted;
      setWantedSteps(stepsWantedServer * timediff);
    }

    let wantedDeviceJson;
    try {
      const WantedDeviceResponse = await fetch(`/api/devices/?id=${deviceId}`, {
        headers: { Accept: 'application/json' },
      });
      if (WantedDeviceResponse.ok) {
        wantedDeviceJson = await WantedDeviceResponse.json();
      } else {
        throw Error(await WantedDeviceResponse.text());
      }
    } finally {
      let activityTimeWantedDevice = 0;
      wantedDeviceJson.forEach((e) => activityTimeWantedDevice += e.activityTimeWanted);
      activityTimeWantedDevice = activityTimeWantedDevice * 60 * 1000;
      if (activityTimeWantedDevice > 0) {
        setWantedActivityTime(activityTimeWantedDevice * timediff);
      }
      let sleepTimeWantedDevice = 0;
      wantedDeviceJson.forEach((e) => sleepTimeWantedDevice += e.sleepTimeWanted);
      sleepTimeWantedDevice = sleepTimeWantedDevice * 60 * 1000;
      if (sleepTimeWantedDevice > 0) {
        setWantedSleepTime(sleepTimeWantedDevice * timediff);
      }
      let stepsWantedDevice = 0;
      wantedDeviceJson.forEach((e) => stepsWantedDevice += e.stepsWanted);
      if (stepsWantedDevice > 0) {
        setWantedSteps(stepsWantedDevice * timediff);
      }
    }

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
    { name: t('reportActivityTime'), duration: activityTime },
    { name: t('reportActivityTimeWanted'), duration: ((wantedActivityTime - (activityTime != null ? activityTime : 0)) < 0) ? 0 : (wantedActivityTime - (activityTime != null ? activityTime : 0)) },
  ];

  const sleepPieData = [
    { name: t('reportSleepTime'), duration: sleepTime },
    { name: t('reportSleepTimeWanted'), duration: ((wantedSleepTime - (sleepTime != null ? sleepTime : 0)) < 0) ? 0 : (wantedSleepTime - (sleepTime != null ? sleepTime : 0)) },
  ];

  const stepsPieData = [
    { name: t('positionSteps'), steps: activitySteps },
    { name: t('reportStepsWanted'), steps: ((wantedSteps - (activitySteps != null ? activitySteps : 0)) < 0) ? 0 : (wantedSteps - (activitySteps != null ? activitySteps : 0)) },
  ];

  const activityColors = ['#82ca9d', '#333333'];
  const sleepColors = ['#8884D8', '#333333'];
  const stepsColors = ['#c49102', '#333333'];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportOverview']}>
      <div className={classes.container}>
        <div className={classes.containerFilter}>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule}>
            </ReportFilter>
          </div>
        </div>
        {selectedDevice != null && (
          <>
            <div className={isMobile ? classes.containerActivityOverview : classes.containerActivity}>
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {t('reportActivityTime')}
              </div>
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {t('positionSteps')}
              </div>
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {t('reportSleepTime')}
              </div>
              <br />
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {formatNumericHours(activityTime, t)}
                <br />
                {t('reportWanted')}
                &nbsp;
                {formatNumericHours(wantedActivityTime, t)}
              </div>
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {activitySteps}
                <br />
                {t('reportWanted')}
                &nbsp;
                {wantedSteps}
              </div>
              <div className={isMobile ? classes.containerActivity3 : classes.containerActivityHead3}>
                {formatNumericHours(sleepTime, t)}
                <br />
                {t('reportWanted')}
                &nbsp;
                {formatNumericHours(wantedSleepTime, t)}
              </div>
              <ResponsiveContainer width="100%" height="95%">
                <PieChart width="100%" maxHeight="100%" margin={{ top: 40, right: 5, bottom: 20, left: 5 }}>
                  <Pie
                    dataKey="duration"
                    isAnimationActive={false}
                    data={activityPieData}
                    cx="20%"
                    cy="25%"
                    innerRadius={!isMobile ? 40 : 20}
                    outerRadius={!isMobile ? 80 : 40}
                    fill="#82ca9d"
                    startAngle={0}
                    endAngle={360}
                    paddingAngle={1}
                  >
                    {activityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={activityColors[index % activityColors.length]} />
                    ))}
                  </Pie>
                  <Pie
                    dataKey="steps"
                    isAnimationActive={false}
                    data={stepsPieData}
                    cx="50%"
                    cy="25%"
                    innerRadius={!isMobile ? 40 : 20}
                    outerRadius={!isMobile ? 80 : 40}
                    fill="#c49102"
                    startAngle={0}
                    endAngle={360}
                    paddingAngle={1}
                  >
                    {stepsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stepsColors[index % stepsColors.length]} />
                    ))}
                  </Pie>
                  <Pie
                    dataKey="duration"
                    isAnimationActive={false}
                    data={sleepPieData}
                    cx="80%"
                    cy="25%"
                    innerRadius={!isMobile ? 40 : 20}
                    outerRadius={!isMobile ? 80 : 40}
                    fill="#82ca9d"
                    startAngle={0}
                    endAngle={360}
                    paddingAngle={1}
                  >
                    {sleepPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sleepColors[index % sleepColors.length]} />
                    ))}
                  </Pie>
                  { /*
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07246e80', color: theme.palette.text.primary }}
                    formatter={(value, key) => [key === 'steps' ? value : formatNumericHours(value, t), key || key]}
                    labelFormatter={(value, key) => [key === 'steps' ? value : formatNumericHours(value, t)]}
                  />
                  */ }
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={isMobile ? classes.containerMap2 : classes.containerMap3}>
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
