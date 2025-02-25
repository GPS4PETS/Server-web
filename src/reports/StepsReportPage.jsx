import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import {
  CartesianGrid, ResponsiveContainer, XAxis, Bar, ReferenceLine, YAxis, ComposedChart, Tooltip, Label,
} from 'recharts';
import { formatTime } from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import { useAttributePreference } from '../common/util/preferences';
import {
  altitudeFromMeters, distanceFromMeters, speedFromKnots,
} from '../common/util/converter';
import useReportStyles from './common/useReportStyles';

let startTime;
let endTime;
let rangeFormat = 'timeshort';
let rangeFormatTt = 'timeshort';
let groupInterval = 3600;
let marginval = 20;

const StepsReportPage = () => {
  const classes = useReportStyles();
  const theme = useTheme();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');

  const [routeItems, setRouteItems] = useState([]);

  const [steps, setSteps] = useState([]);

  const [showWanted, setShowWawnted] = useState(false);

  /*
  const [wantedActivityTime, setWantedActivityTime] = useState(0);
  const [wantedSleepTime, setWantedSleepTime] = useState(0);
  */
  const [wantedSteps, setWantedSteps] = useState(0);

  function generateKey(groupBySecondsa, timestampa, offseta) {
    const keyDiff = (timestampa % groupBySecondsa);
    return [(timestampa - keyDiff) + offseta, keyDiff];
  }

  function generateSlots(dateStart, dateEnd, groupBya) {
    const startKeyGen = generateKey(groupBya, dateStart, 0);
    const startHeadKey = startKeyGen[0];

    const endKeyGen = generateKey(groupBya, dateEnd, 0);
    const endTailKey = endKeyGen[0];

    let endKey = startHeadKey;

    const shift = dateStart - startHeadKey;

    const grida = { ts: 0, steps: 0 };
    while (endKey <= endTailKey) {
      grida[endKey + shift] = { ts: (endKey + shift), steps: 0 };
      endKey += groupBya;
    }
    grida[endKey + shift] = { ts: (endKey + shift), steps: 0 };

    return { grid: grida, offset: shift };
  }

  function groupBy(data, startDate, endDate, groupDurationSec) {
    const slotsAndOffsets = generateSlots(startDate, endDate, groupDurationSec);
    const slots = slotsAndOffsets.grid;
    const offsets = slotsAndOffsets.offset;
    const arr = [];

    let min = 999999;
    let max = 0;
    let oldkey = 0;
    let idx = -1;

    data.forEach((item) => {
      const key = generateKey(groupDurationSec, (item.serverTime / 1000) - offsets, offsets)[0];
      if (oldkey === 0) { oldkey = key; }
      if (slots[key] !== undefined) {
        if (item.steps > max) {
          max = item.steps;
        }
        if (item.steps < min) {
          min = item.steps;
        }
        if (oldkey !== key) {
          const val = max - min;
          slots[key] = { ts: (key * 1000), steps: val };
          arr[idx += 1] = { ts: (key * 1000), steps: val };
          min = 9999999;
          max = 0;
          oldkey = key;
        }
      }
    });

    return (arr);
  }

  const handleSubmit = useCatch(async ({ deviceId, from, to }) => {
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
      /*
      const activityTimeWantedServer = wantedServerJson.activityTimeWanted * 60 * 1000;
      setWantedActivityTime(activityTimeWantedServer);
      const sleepTimeWantedServer = wantedServerJson.sleepTimeWanted * 60 * 1000;
      /setWantedSleepTime(sleepTimeWantedServer);
      */
      const stepsWantedServer = wantedServerJson.stepsWanted;
      setWantedSteps(stepsWantedServer);
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
      /*
      let activityTimeWantedDevice = 0;
      wantedDeviceJson.forEach((e) => activityTimeWantedDevice += e.activityTimeWanted);
      activityTimeWantedDevice = activityTimeWantedDevice * 60 * 1000;
      if (activityTimeWantedDevice > 0) {
        setWantedActivityTime(activityTimeWantedDevice);
      }
      let sleepTimeWantedDevice = 0;
      wantedDeviceJson.forEach((e) => sleepTimeWantedDevice += e.sleepTimeWanted);
      sleepTimeWantedDevice = sleepTimeWantedDevice * 60 * 1000;
      if (sleepTimeWantedDevice > 0) {
        setWantedSleepTime(sleepTimeWantedDevice);
      }
      */
      let stepsWantedDevice = 0;
      wantedDeviceJson.forEach((e) => stepsWantedDevice += e.stepsWanted);
      if (stepsWantedDevice > 0) {
        setWantedSteps(stepsWantedDevice);
      }
    }

    startTime = from;
    endTime = to;

    if ((dayjs(endTime).unix() - dayjs(startTime).unix()) > 86400) {
      rangeFormat = 'dateshort';
      rangeFormatTt = 'date';
      groupInterval = 86400;
      setShowWawnted(true);
    } else {
      rangeFormat = 'timeshort';
      rangeFormatTt = 'timeshort';
      groupInterval = 3600;
      setShowWawnted(false);
    }

    if (isMobile) {
      marginval = 5;
    } else {
      marginval = 10;
    }

    const routeQuery = new URLSearchParams({ deviceId, from, to });
    const routeResponse = await fetch(`/api/reports/route?${routeQuery.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (routeResponse.ok) {
      const positions = await routeResponse.json();
      const routeKeySet = new Set();
      const routeKeyList = [];
      const formattedPositions = positions.map((position) => {
        const data = { ...position, ...position.attributes };
        const formatted = {};
        formatted.fixTime = dayjs(position.fixTime).valueOf();
        formatted.deviceTime = dayjs(position.deviceTime).valueOf();
        formatted.serverTime = dayjs(position.serverTime).valueOf();
        Object.keys(data).filter((key) => !['id', 'deviceId'].includes(key)).forEach((key) => {
          const value = data[key];
          if (typeof value === 'number' && (key === 'speed' || key === 'altitude' || key === 'steps' || key === 'course' || key === 'batteryLevel' || key === 'totalDistance')) {
            routeKeySet.add(key);
            const definition = positionAttributes[key] || {};
            switch (definition.dataType) {
              case 'speed':
                formatted[key] = speedFromKnots(value, speedUnit).toFixed(2);
                break;
              case 'altitude':
                formatted[key] = altitudeFromMeters(value, altitudeUnit).toFixed(2);
                break;
              case 'distance':
                formatted[key] = distanceFromMeters(value, distanceUnit).toFixed(2);
                break;
              case 'hours':
                formatted[key] = (value / 1000).toFixed(2);
                break;
              default:
                formatted[key] = value;
                break;
            }
          }
        });
        return formatted;
      });
      routeKeySet.add('steps');
      Object.keys(positionAttributes).forEach((routeKey) => {
        if (routeKeySet.has(routeKey)) {
          routeKeyList.push(routeKey);
          routeKeySet.delete(routeKey);
        }
      });

      let steptmp = [];
      steptmp = groupBy(formattedPositions, dayjs(from).unix(), dayjs(to).unix(), groupInterval);

      if (steptmp.length > 0) {
        if ((dayjs(endTime).unix() - dayjs(startTime).unix()) > 86400) {
          steptmp[0] = { wanted: wantedSteps, ts: steptmp[0].ts, steps: steptmp[0].steps };
          steptmp[steptmp.length - 1] = { wanted: wantedSteps, ts: steptmp[steptmp.length - 1].ts, steps: steptmp[steptmp.length - 1].steps };
        } else {
          steptmp[0] = { wanted: 0, ts: steptmp[0].ts, steps: steptmp[0].steps };
          steptmp[steptmp.length - 1] = { wanted: wantedSteps, ts: steptmp[steptmp.length - 1].ts, steps: steptmp[steptmp.length - 1].steps };
        }
      }

      setSteps(steptmp);
      setRouteItems(formattedPositions);
    } else {
      throw Error(await routeResponse.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportSteps']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly>
      </ReportFilter>
      {(routeItems.length > 0 || true) && (
        <div className={classes.chart}>
          <ResponsiveContainer>
            <ComposedChart
              data={steps}
              margin={{
                top: 10, right: 40, left: 10, bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#07246e" stopOpacity={1} />
                  <stop offset="95%" stopColor="#07246e" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="ts"
                domain={[(startTime - (groupInterval * 1000)), (endTime + (groupInterval * 1000))]}
                interval="PreserveStartEnd"
                tickFormatter={(value) => formatTime(value - 3600000, rangeFormat)}
                scale="number"
                padding={{ left: marginval, right: marginval }}
                allowDataOverflow="true"
              />
              <YAxis />
              <Bar
                dataKey="steps"
                fill="url(#colorGrad)"
                radius={[10, 10, 0, 0]}
                minPointSize={5}
              />
              {showWanted && (
              <ReferenceLine
                y={wantedSteps}
                stroke="#82ca9d"
              >
                <Label
                  value={t('reportWanted')}
                  position="top"
                />
              </ReferenceLine>
              )}
              <Tooltip
                contentStyle={{ backgroundColor: '#07246e80', color: theme.palette.text.primary }}
                formatter={(value, key) => [value, positionAttributes[key]?.name || key]}
                labelFormatter={(value) => (rangeFormatTt === 'timeshort' ? formatTime(value - 3600000, rangeFormatTt).concat('-').concat(formatTime(value, rangeFormatTt)) : formatTime(value - 3600000, rangeFormatTt))}
              />
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
};

export default StepsReportPage;
