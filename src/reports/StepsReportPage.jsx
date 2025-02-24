import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import {
  CartesianGrid, BarChart, ResponsiveContainer, XAxis, YAxis, Bar,
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

  function generateKey(groupBySecondsa, timestampa, offseta) {
    const keyDiff = (timestampa % groupBySecondsa);
    return [(timestampa - keyDiff) + offseta, keyDiff];
  }

  function generateSlots(dateStart, dateEnd, groupBya) {
    const startKeyGen = generateKey(groupBya, dateStart, 0);
    const startHeadKey = startKeyGen[0];
    // const keyStep = startKeyGen[1];

    const endKeyGen = generateKey(groupBya, dateEnd, 0);
    const endTailKey = endKeyGen[0];

    let endKey = startHeadKey;

    const shift = dateStart - startHeadKey;

    const grida = { ts: 0, steps: 0 };
    while (endKey <= endTailKey) {
      grida[endKey + shift] = 0;
      endKey += groupBya;
    }

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
    startTime = from;
    endTime = to;

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
      setSteps(groupBy(formattedPositions, dayjs(from).unix(), dayjs(to).unix(), 3600));
      setRouteItems(formattedPositions);
    } else {
      throw Error(await routeResponse.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly>
        { /*
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t('reportChartType')}</InputLabel>
            <Select
              label={t('reportChartType')}
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              disabled={!routeItems.length}
            >
              <MenuItem key={routeType} value={routeType}>{positionAttributes[routeType]?.name || routeType}</MenuItem>
            </Select>
          </FormControl>
        </div>
        */ }
      </ReportFilter>
      {(routeItems.length > 0 || true) && (
        <div className={classes.chart}>
          <ResponsiveContainer>
            <BarChart
              data={steps}
              margin={{
                top: 10, right: 40, left: 10, bottom: 10,
              }}
            >
              <XAxis
                dataKey="ts"
                domain={[startTime, (endTime + 3600000)]}
                scale="time"
                interval="equidistantPreserveStart"
                tickFormatter={(value) => formatTime(value, 'ts')}
              />
              <YAxis />
              <Bar
                dataKey="steps"
                fill="#6c90eb"
                radius={[10, 10, 0, 0]}
                label={{
                  dataKey: 'steps',
                  position: 'insideBottom',
                  angle: '270',
                  offset: '35',
                  fill: 'black',
                  fontSize: '+1.5em',
                }}
              />
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
};

export default StepsReportPage;
