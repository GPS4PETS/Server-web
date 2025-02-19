import React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import {
  Divider, List,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import PublishIcon from '@mui/icons-material/Publish';
import HelpIcon from '@mui/icons-material/Help';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import MenuItem from '../../common/components/MenuItem';

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  const GeofenceIcon = createSvgIcon(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <path
        stroke="none"
        fillRule="none"
        fill="currentcolor"
        fillOpacity="1"
        d="M 11.558594 3.015625 C 9.222656 3.253906 7.441406 5.265625 7.503906 7.578125 C 7.527344 8.371094 7.816406 9.234375 8.558594 10.714844 C 8.703125 11.003906 8.820312 11.242188 8.820312 11.246094 C 8.820312 11.246094 7.886719 11.25 6.746094 11.25 L 4.671875 11.25 L 2.015625 20.992188 L 7.007812 20.996094 C 9.753906 21 14.246094 21 16.992188 20.996094 L 21.984375 20.992188 L 19.328125 11.25 L 17.253906 11.25 C 16.113281 11.25 15.179688 11.246094 15.179688 11.238281 C 15.179688 11.234375 15.25 11.09375 15.335938 10.925781 C 16.191406 9.273438 16.515625 8.273438 16.496094 7.371094 C 16.433594 4.78125 14.132812 2.753906 11.558594 3.015625 M 12.226562 4.515625 C 13.710938 4.628906 14.867188 5.785156 14.984375 7.273438 C 15.050781 8.101562 14.371094 9.726562 12.992188 12.039062 C 12.65625 12.597656 12.027344 13.574219 12 13.574219 C 11.960938 13.574219 11.15625 12.304688 10.78125 11.65625 C 9.515625 9.464844 8.953125 8.0625 9.015625 7.277344 C 9.140625 5.710938 10.363281 4.558594 11.960938 4.503906 C 11.996094 4.5 12.113281 4.507812 12.226562 4.515625 M 11.734375 6.402344 C 10.710938 6.65625 10.566406 8.054688 11.511719 8.511719 C 12.257812 8.871094 13.125 8.328125 13.125 7.5 C 13.125 6.773438 12.4375 6.230469 11.734375 6.402344 M 9.757812 12.886719 C 10.144531 13.515625 10.246094 13.6875 10.4375 13.988281 C 10.800781 14.566406 11.175781 15.132812 11.554688 15.683594 C 11.753906 15.972656 11.933594 16.234375 11.953125 16.261719 C 11.976562 16.292969 11.996094 16.320312 12 16.320312 C 12.003906 16.320312 12.023438 16.292969 12.046875 16.261719 C 12.066406 16.234375 12.246094 15.972656 12.445312 15.683594 C 12.824219 15.132812 13.199219 14.566406 13.5625 13.988281 C 13.753906 13.6875 13.855469 13.515625 14.242188 12.886719 L 14.316406 12.757812 L 16.246094 12.753906 L 18.171875 12.75 L 19.085938 16.097656 C 19.589844 17.941406 20.003906 19.460938 20.007812 19.472656 C 20.011719 19.5 19.625 19.5 12 19.5 C 4.375 19.5 3.988281 19.5 3.992188 19.472656 C 3.996094 19.460938 4.410156 17.941406 4.914062 16.097656 L 5.828125 12.75 L 7.753906 12.753906 L 9.683594 12.757812 L 9.757812 12.886719 "
      />
    </svg>,
    'geofence',
  );

  const DeviceIcon = createSvgIcon(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <path
        stroke="none"
        fillRule="none"
        fill="currentcolor"
        fillOpacity="1"
        d="M 7.011719 5.933594 C 6.882812 6.058594 6.832031 6.230469 6.832031 6.515625 C 6.832031 6.945312 6.3125 7.15625 6.167969 6.785156 C 6.097656 6.597656 4.359375 6.589844 4.25 6.773438 C 4.199219 6.863281 3.90625 6.910156 3.234375 6.941406 C 1.929688 6.996094 1.226562 7.40625 0.84375 8.328125 C 0.65625 8.769531 0.664062 14.34375 0.847656 14.789062 C 1.0625 15.296875 1.410156 15.6875 1.875 15.941406 L 2.316406 16.179688 L 6.832031 16.179688 L 6.832031 16.8125 C 6.832031 17.933594 7.171875 18.246094 8.386719 18.246094 L 9.050781 18.246094 L 9.824219 17.683594 L 10.601562 17.125 L 10.605469 16.652344 L 10.605469 16.179688 L 13.125 16.179688 L 13.125 17.070312 L 13.777344 17.554688 C 14.679688 18.222656 14.738281 18.246094 15.414062 18.246094 C 16.570312 18.246094 16.898438 17.945312 16.898438 16.878906 L 16.898438 16.179688 L 19.238281 16.179688 C 23.070312 16.179688 23.148438 16.09375 23.246094 11.773438 C 23.316406 8.675781 23.273438 8.367188 22.628906 7.671875 C 22.007812 6.996094 21.933594 6.980469 19.257812 6.941406 L 16.898438 6.90625 L 16.898438 6.476562 C 16.898438 5.78125 16.828125 5.753906 15.082031 5.753906 C 13.304688 5.753906 13.125 5.824219 13.125 6.523438 L 13.125 6.921875 L 10.605469 6.921875 L 10.605469 6.460938 C 10.605469 5.773438 10.566406 5.757812 8.742188 5.753906 C 7.308594 5.753906 7.175781 5.765625 7.011719 5.933594 "
      />
    </svg>,
    'device',
  );

  return (
    <>
      <List>
        <MenuItem
          title={t('sharedPreferences')}
          link="/settings/preferences"
          icon={<SettingsIcon />}
          selected={location.pathname === '/settings/preferences'}
        />
        {!readonly && (
          <>
            {admin && (
            <MenuItem
              title={t('sharedNotifications')}
              link="/settings/notifications"
              icon={<NotificationsIcon />}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            )}
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<PersonIcon />}
              selected={location.pathname === `/settings/user/${userId}`}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              icon={<DeviceIcon />}
              selected={location.pathname.startsWith('/settings/device')}
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              icon={<GeofenceIcon />}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            {!features.disableGroups && (
              <MenuItem
                title={t('settingsGroups')}
                link="/settings/groups"
                icon={<FolderIcon />}
                selected={location.pathname.startsWith('/settings/group')}
              />
            )}
            {!features.disableDrivers && (
              <MenuItem
                title={t('sharedDrivers')}
                link="/settings/drivers"
                icon={<PersonIcon />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {!features.disableCalendars && (
              <MenuItem
                title={t('sharedCalendars')}
                link="/settings/calendars"
                icon={<TodayIcon />}
                selected={location.pathname.startsWith('/settings/calendar')}
              />
            )}
            {!features.disableComputedAttributes && (
              <MenuItem
                title={t('sharedComputedAttributes')}
                link="/settings/attributes"
                icon={<StorageIcon />}
                selected={location.pathname.startsWith('/settings/attribute')}
              />
            )}
            {!features.disableMaintenance && (
              <MenuItem
                title={t('sharedMaintenance')}
                link="/settings/maintenances"
                icon={<BuildIcon />}
                selected={location.pathname.startsWith('/settings/maintenance')}
              />
            )}
            {!features.disableSavedCommands && (
              <MenuItem
                title={t('sharedSavedCommands')}
                link="/settings/commands"
                icon={<PublishIcon />}
                selected={location.pathname.startsWith('/settings/command')}
              />
            )}
            {supportLink && (
              <MenuItem
                title={t('settingsSupport')}
                link={supportLink}
                icon={<HelpIcon />}
              />
            )}
          </>
        )}
      </List>
      {manager && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('serverAnnouncement')}
              link="/settings/announcement"
              icon={<CampaignIcon />}
              selected={location.pathname === '/settings/announcement'}
            />
            {admin && (
              <MenuItem
                title={t('settingsServer')}
                link="/settings/server"
                icon={<StorageIcon />}
                selected={location.pathname === '/settings/server'}
              />
            )}
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<PeopleIcon />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;
