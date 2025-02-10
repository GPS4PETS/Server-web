import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, useTheme,
} from '@mui/material';
import {
  Brush, CartesianGrid, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import ReportFilter from './components/ReportFilter';
import { formatTime } from '../common/util/formatter';
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
import { useAdministrator } from '../common/util/permissions';

const ChartsReportPage = () => {
  const classes = useReportStyles();
  const theme = useTheme();
  const t = useTranslation();

  const admin = useAdministrator();

  const positionAttributes = usePositionAttributes(t);

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');

  const [routeItems, setRouteItems] = useState([]);
  const [routeTypes, setRouteTypes] = useState(['steps']);
  const [routeType, setRouteType] = useState('steps');
  const [timeType] = useState('deviceTime');

  const values = routeItems.map((it) => it[routeType]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  let startTime;
  let endTime;

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
        formatted.deviceTime = dayjs(position.deviceTime).valueOf();
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
      Object.keys(positionAttributes).forEach((routeKey) => {
        if (routeKeySet.has(routeKey)) {
          routeKeyList.push(routeKey);
          routeKeySet.delete(routeKey);
        }
      });
      setRouteTypes([...routeKeyList, ...routeKeySet]);
      setRouteItems(formattedPositions);
    } else {
      throw Error(await routeResponse.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly>
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t('reportChartType')}</InputLabel>
            <Select
              label={t('reportChartType')}
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              disabled={!routeItems.length}
            >
              {routeTypes.map((key) => (
                <MenuItem key={key} value={key}>{positionAttributes[key]?.name || key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </ReportFilter>
      {routeItems.length > 0 && (
        <div className={classes.chart}>
          <ResponsiveContainer>
            <AreaChart
              data={routeItems}
              margin={{
                top: 10, right: 40, left: 10, bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#07246e" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#07246e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                stroke={theme.palette.text.primary}
                dataKey={timeType}
                type="number"
                tickFormatter={(value) => formatTime(value, 'time')}
                /* domain={['dataMin', 'dataMax']} */
                domain={[startTime, endTime]}
                scale="time"
                interval="equidistantPreserveStart"
              />
              <YAxis
                stroke={theme.palette.text.primary}
                type="number"
                tickFormatter={(value) => value.toFixed(0)}
                domain={[(minValue - valueRange / 5) < 0 ? 0 : (minValue - valueRange / 5), maxValue + valueRange / 5]}
                interval="equidistantPreserveStart"
                scale="linear"
              />
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{ backgroundColor: '#07246e80', color: theme.palette.text.primary }}
                formatter={(value, key) => [value, positionAttributes[key]?.name || key]}
                labelFormatter={(value) => formatTime(value, 'seconds')}
              />
              {admin && (
              <Brush
                dataKey={timeType}
                height={30}
                stroke={theme.palette.primary.main}
                tickFormatter={() => ''}
              />
              )}
              <Line
                type="monotone"
                dataKey={routeType}
                stroke={theme.palette.primary.main}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Area type="monotone" dataKey={routeType} stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
};

export default ChartsReportPage;
