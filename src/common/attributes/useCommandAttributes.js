import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  custom: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  setApn: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  positionPeriodicOrig: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
  ],
  positionPeriodic: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
  ],
  positionPeriodicStatic: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
  ],
  setTimezone: [
    {
      key: 'timezone',
      name: t('commandTimezone'),
      type: 'string',
    },
  ],
  sendSms: [
    {
      key: 'phone',
      name: t('commandPhone'),
      type: 'string',
    },
    {
      key: 'message',
      name: t('commandMessage'),
      type: 'string',
    },
  ],
  message: [
    {
      key: 'message',
      name: t('commandMessage'),
      type: 'string',
    },
  ],
  sendUssd: [
    {
      key: 'phone',
      name: t('commandPhone'),
      type: 'string',
    },
  ],
  sosNumber: [
    {
      key: 'index',
      name: t('commandIndex'),
      type: 'number',
    },
    {
      key: 'phone',
      name: t('commandPhone'),
      type: 'string',
    },
  ],
  silenceTime: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  setPhonebook: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  voiceMessage: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  outputControl: [
    {
      key: 'index',
      name: t('commandIndex'),
      type: 'number',
    },
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  voiceMonitoring: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  setAgps: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  setIndicator: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  configuration: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  setConnection: [
    {
      key: 'server',
      name: t('commandServer'),
      type: 'string',
    },
    {
      key: 'port',
      name: t('commandPort'),
      type: 'number',
    },
  ],
  setOdometer: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  modePowerSaving: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  modeDeepSleep: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  alarmGeofence: [
    {
      key: 'radius',
      name: t('commandRadius'),
      type: 'number',
    },
  ],
  alarmBattery: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  alarmSos: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  alarmRemove: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  alarmClock: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  alarmSpeed: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  alarmFall: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  alarmVibration: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
  lightDuration: [
    {
      key: 'duration',
      name: t('commandLightDuration'),
      type: 'number',
    },
  ],
  buzzerDuration: [
    {
      key: 'duration',
      name: t('commandBuzzerDuration'),
      type: 'number',
    },
  ],
  statusLed: [
    {
      key: 'enable',
      name: t('commandEnable'),
      type: 'boolean',
    },
  ],
  static: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
  ],
  heartbeat: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
  ],
  tkWorkMode: [
    {
      key: 'tkWorkMode',
      name: t('commandTkWorkModeDesc'),
      type: 'number',
    },
  ],
  transparent: [
    {
      key: 'data',
      name: t('commandSmsTransparent'),
      type: 'string',
    },
  ],
  transparentSer: [
    {
      key: 'data',
      name: t('commandSerTransparent'),
      type: 'string',
    },
  ],
  omniSetup: [
    {
      key: 'frequency',
      name: t('commandFrequency'),
      type: 'number',
    },
    {
      key: 'motionsleep',
      name: t('commandMotionSleep'),
      type: 'boolean',
    },
    {
      key: 'homewifi',
      name: t('commandHomeWifi'),
      type: 'boolean',
    },
    {
      key: 'homewifimac',
      name: t('commandHomeWifiMac'),
      type: 'string',
    },
  ],
}), [t]);
