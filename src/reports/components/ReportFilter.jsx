import { useState, useRef, useEffect } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import { devicesActions, reportsActions } from '../../store';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useAdministrator } from '../../common/util/permissions';

const ReportFilter = ({
  children, handleSubmit, handleSchedule, showOnly, ignoreDevice, multiDevice, includeGroups, loading, noauto,
}) => {
  const { classes } = useReportStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);

  const deviceId = useSelector((state) => state.devices.selectedId);
  const deviceIds = useSelector((state) => state.devices.selectedIds);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const period = useSelector((state) => state.reports.period);
  const from = useSelector((state) => state.reports.from);
  const to = useSelector((state) => state.reports.to);
  /* const firstload = useSelector((state) => state.reports.firstload); */
  const [button, setButton] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const scheduleDisabled = button === 'schedule' && (!description || !calendarId);
  const disabled = (!ignoreDevice && !deviceId && !deviceIds.length && !groupIds.length) || scheduleDisabled || loading;

  const handleClick = (type) => {
    if (type === 'schedule') {
      handleSchedule(deviceIds, groupIds, {
        description,
        calendarId,
        attributes: {},
      });
    } else {
      let selectedFrom;
      let selectedTo;
      switch (period) {
        case 'today':
          selectedFrom = dayjs().startOf('day');
          selectedTo = dayjs().endOf('day');
          break;
        case 'yesterday':
          selectedFrom = dayjs().subtract(1, 'day').startOf('day');
          selectedTo = dayjs().subtract(1, 'day').endOf('day');
          break;
        case 'thisWeek':
          selectedFrom = dayjs().startOf('week');
          selectedTo = dayjs().endOf('week');
          break;
        case 'previousWeek':
          selectedFrom = dayjs().subtract(1, 'week').startOf('week');
          selectedTo = dayjs().subtract(1, 'week').endOf('week');
          break;
        case 'thisMonth':
          selectedFrom = dayjs().startOf('month');
          selectedTo = dayjs().endOf('month');
          break;
        case 'previousMonth':
          selectedFrom = dayjs().subtract(1, 'month').startOf('month');
          selectedTo = dayjs().subtract(1, 'month').endOf('month');
          break;
        default:
          selectedFrom = dayjs(from, 'YYYY-MM-DDTHH:mm');
          selectedTo = dayjs(to, 'YYYY-MM-DDTHH:mm');
          break;
      }

      handleSubmit({
        deviceId,
        deviceIds,
        groupIds,
        from: selectedFrom.toISOString(),
        to: selectedTo.toISOString(),
        calendarId,
        type,
      });
    }
  };

  let hide = false;
  if (Object.values(devices).length === 1) {
    hide = true;
  }

  const buttonRef = useRef(null);
  const buttonsplitRef = useRef(null);

  useEffect(() => {
    if (devices[Object.keys(devices)[0]] && (deviceId == null || !(deviceId % 1 === 0))) {
      const tempid = devices[Object.keys(devices)[0]].id;
      dispatch(devicesActions.selectId(tempid));
      dispatch(reportsActions.updatePeriod('today'));
      dispatch(reportsActions.updateFrom(dayjs().startOf('day')));
      dispatch(reportsActions.updateTo(dayjs().endOf('day')));
    }
  }, [URL]);

  /*
  useEffect(() => {
    dispatch(reportsActions.setFirstload(true));
  }, [URL]);
  */

  useEffect(() => {
    if (deviceId && buttonRef.current && (deviceId % 1 === 0) && hide && !noauto) {
      /* dispatch(reportsActions.setFirstload(false)); */
      buttonRef.current.addEventListener('click', handleClick);
      buttonRef.current.click();
    }
  }, [buttonRef, deviceId, URL, hide]);

  return (
    <div className={classes.filter}>
      {!ignoreDevice && (
        <div className={classes.filterItem} style={{ display: hide ? 'none' : 'block' }}>
          <SelectField
            label={t(multiDevice ? 'deviceTitle' : 'reportDevice')}
            data={Object.values(devices).sort((a, b) => a.name.localeCompare(b.name))}
            value={multiDevice ? deviceIds : deviceId}
            onChange={(e) => dispatch(multiDevice ? devicesActions.selectIds(e.target.value) : devicesActions.selectId(e.target.value))}
            multiple={multiDevice}
            fullWidth
          />
        </div>
      )}
      {includeGroups && (
        <div className={classes.filterItem}>
          <SelectField
            label={t('settingsGroups')}
            data={Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))}
            value={groupIds}
            onChange={(e) => dispatch(reportsActions.updateGroupIds(e.target.value))}
            multiple
            fullWidth
          />
        </div>
      )}
      {button !== 'schedule' ? (
        <>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportPeriod')}</InputLabel>
              <Select label={t('reportPeriod')} value={period} onChange={(e) => dispatch(reportsActions.updatePeriod(e.target.value))}>
                <MenuItem value="today">{t('reportToday')}</MenuItem>
                <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
                <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
                <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
                <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
                <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
                <MenuItem value="custom">{t('reportCustom')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportFrom')}
                type="datetime-local"
                value={from}
                onChange={(e) => dispatch(reportsActions.updateFrom(e.target.value))}
                fullWidth
              />
            </div>
          )}
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportTo')}
                type="datetime-local"
                value={to}
                onChange={(e) => dispatch(reportsActions.updateTo(e.target.value))}
                fullWidth
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={classes.filterItem}>
            <TextField
              value={description || ''}
              onChange={(event) => setDescription(event.target.value)}
              label={t('sharedDescription')}
              fullWidth
            />
          </div>
          <div className={classes.filterItem}>
            <SelectField
              value={calendarId}
              onChange={(event) => setCalendarId(Number(event.target.value))}
              endpoint="/api/calendars"
              label={t('sharedCalendar')}
              fullWidth
            />
          </div>
        </>
      )}
      {admin ? children : children}
      <div className={classes.filterItem}>
        {showOnly || !admin ? (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            value={t('reportShow')}
            ref={buttonRef}
            onClick={() => handleClick({ json: t('reportShow') })}
          >
            <Typography variant="button" noWrap>{t(loading ? 'sharedLoading' : 'reportShow')}</Typography>
          </Button>
        ) : (
          <SplitButton
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={handleClick}
            selected={button}
            setSelected={(value) => setButton(value)}
            ref={buttonsplitRef}
            options={!admin ? {
              json: t('reportShow'),
            } : {
              json: t('reportShow'),
              export: t('reportExport'),
              mail: t('reportEmail'),
              schedule: t('reportSchedule'),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFilter;