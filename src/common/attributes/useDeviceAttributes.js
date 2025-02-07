import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'web.reportColor': {
    name: t('attributeWebReportColor'),
    type: 'string',
    subtype: 'color',
  },
  devicePassword: {
    name: t('attributeDevicePassword'),
    type: 'string',
  },
  deviceImage: {
    name: t('attributeDeviceImage'),
    type: 'string',
  },
  'processing.copyAttributes': {
    name: t('attributeProcessingCopyAttributes'),
    type: 'string',
  },
  'decoder.timezone': {
    name: t('sharedTimezone'),
    type: 'string',
  },
  'forward.url': {
    name: t('attributeForwardUrl'),
    type: 'string',
  },
  deviceOnline: {
    name: t('deviceStatus'),
    type: 'string',
  },
  liveModeTime: {
    name: t('attributeLiveModeTime'),
    type: 'string',
  },
  lightTime: {
    name: t('attributeLightTime'),
    type: 'string',
  },
  soundTime: {
    name: t('attributeSoundTime'),
    type: 'string',
  },
}), [t]);
