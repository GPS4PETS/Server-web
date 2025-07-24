//import React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import {
  Divider, List,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import PublishIcon from '@mui/icons-material/Publish';
import HelpIcon from '@mui/icons-material/Help';
import PaymentIcon from '@mui/icons-material/Payment';
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
  const billingLink = useSelector((state) => state.session.user.attributes.billingLink);

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
      <g id="surface1">
        <path
          stroke="none"
          fillRule="none"
          fill="currentcolor"
          fillOpacity="1"
          d="M11.54 1.219a4.07 4.07 0 0 0-2.794 1.59c-.105.136-.11.14-.203.156-3.113.394-5.559 1.23-7.082 2.414a6.6 6.6 0 0 0-.75.71c-.27.321-.488.712-.598 1.056-.117.37-.113.351-.11 2.593l.009 2.032.047.195c.058.226.117.387.218.594.75 1.496 3 2.746 6.149 3.418.625.132 1.75.324 1.914.324.031 0 .058.008.058.015 0 .004-.035.07-.078.149a4.18 4.18 0 0 0-.5 2.781c.313 1.824 1.79 3.242 3.598 3.461.094.012.21.027.27.04.058.007.144.01.195.007l.523-.04c.133-.007.215-.019.426-.062a4.21 4.21 0 0 0 3.2-3.148c.14-.594.14-1.305 0-1.902a4.4 4.4 0 0 0-.458-1.153c-.035-.058-.066-.11-.066-.117 0-.004.082-.016.18-.031.289-.035.968-.145 1.289-.203 2.222-.422 4.003-1.078 5.242-1.93.3-.211.488-.363.742-.605.523-.504.832-1.008.98-1.598l.047-.195.008-2.032C24 7.93 24 7.684 23.97 7.516c-.14-.934-.836-1.805-2.02-2.555C20.484 4.039 18.25 3.332 15.73 3c-.199-.027-.39-.05-.421-.059-.047-.007-.075-.03-.137-.113a4.7 4.7 0 0 0-.727-.75 4.3 4.3 0 0 0-1.238-.672 4.1 4.1 0 0 0-1.668-.187m.913.933a3.03 3.03 0 0 1 1.727.91c.449.47.718 1.012.832 1.672.05.29.039.805-.02 1.086a3.05 3.05 0 0 1-.863 1.586c-.316.301-.555.547-1.152 1.16-.317.332-.68.704-.801.829l-.223.226-.664-.68c-1.039-1.066-1.285-1.316-1.45-1.464a3.14 3.14 0 0 1-.847-1.34 3.04 3.04 0 0 1 .203-2.332 3 3 0 0 1 .715-.926 3.2 3.2 0 0 1 1.777-.762c.153-.015.598.004.766.035m3.711 1.828a24 24 0 0 1 1.816.368c2.84.71 4.723 1.875 5.063 3.132.059.215.059.551 0 .762-.055.203-.2.488-.336.676-.227.309-.66.703-1.09.992-.617.41-1.48.817-2.398 1.121-1.657.555-3.532.883-5.79 1.008a41 41 0 0 1-3.015-.008c-1.922-.117-3.437-.36-4.922-.777q-2.131-.603-3.426-1.57a5 5 0 0 1-.773-.766 2.3 2.3 0 0 1-.332-.664c-.215-.777.227-1.594 1.258-2.32 1.226-.868 3.246-1.575 5.562-1.946.192-.031.352-.05.356-.047s-.02.094-.051.204a4.05 4.05 0 0 0-.035 1.992c.035.164.242.797.285.875a.2.2 0 0 1 .027.062c0 .008.043.074.098.149.36.504.41.562.832.984.238.23.863.871 1.395 1.422.53.547 1 1.016 1.039 1.039a.4.4 0 0 0 .187.05c.227.02.176.067 1.43-1.226.617-.633 1.152-1.18 1.183-1.21.286-.243.649-.66.786-.9a.5.5 0 0 1 .097-.132c.043-.027.266-.5.266-.57a.4.4 0 0 1 .035-.106c.055-.101.14-.414.191-.676.036-.191.04-.285.04-.691 0-.371-.008-.508-.032-.648a10 10 0 0 0-.156-.618c-.012-.027-.004-.03.043-.02zM1.293 10.215c1.664 1.406 4.848 2.41 8.539 2.687l.184.012v1.918l-.149.086c-.203.117-.394.25-.601.422-.145.12-.184.14-.23.137-1.384-.165-2.52-.383-3.552-.68-2.293-.664-3.859-1.606-4.39-2.64-.184-.36-.176-.31-.184-1.376l-.008-.933.137.132c.074.07.188.176.254.235m21.797.668c0 .594-.008.86-.024.887-.011.02-.043.097-.066.175-.02.075-.047.14-.05.149a1 1 0 0 0-.083.136c-.273.5-.84 1.012-1.617 1.457-1.457.84-3.684 1.485-6.09 1.766-.332.04-.344.04-.383.004-.023-.02-.117-.094-.214-.172a4 4 0 0 0-.594-.406l-.086-.047v-1.906l.078-.012.246-.02c1.258-.082 2.996-.359 4.098-.656a15.428 15.428 0 0 0 2.691-.953c.781-.375 1.469-.828 1.93-1.273l.16-.149.004.086c.004.047.004.465 0 .934m-10.113 2.844v.761l-.149-.035a4.3 4.3 0 0 0-1.695-.008l-.203.04v-1.516h2.047Zm-.704 1.558a3.28 3.28 0 0 1 2.063 1.024 3.33 3.33 0 0 1 .844 1.636c.035.184.043.266.043.61 0 .445-.028.629-.149 1.008a4 4 0 0 1-.445.894c-.309.426-.75.805-1.223 1.04a3.32 3.32 0 0 1-2.57.144 3.29 3.29 0 0 1-2.106-3.739c.336-1.64 1.887-2.789 3.543-2.617m0 0"
        />
        <path
          stroke="none"
          fillRule="none"
          fill="currentcolor"
          fillOpacity="1"
          d="M11.594 3.46a1.81 1.81 0 0 0-1.371 1.294c-.051.2-.059.695-.008.871.117.422.34.766.66 1.008.164.125.453.262.652.312.227.055.633.055.844 0 .656-.172 1.129-.644 1.313-1.312.062-.219.058-.633-.008-.871a2.1 2.1 0 0 0-.258-.567 2 2 0 0 0-.672-.582 2.3 2.3 0 0 0-.453-.152 2.5 2.5 0 0 0-.7 0m.582.903a.89.89 0 0 1 .64.98.89.89 0 0 1-.472.645.83.83 0 0 1-.778.004c-.718-.363-.629-1.379.149-1.629.098-.031.348-.031.46 0M11.625 16.3a2.3 2.3 0 0 0-1.867 1.665 2.28 2.28 0 0 0 .297 1.84c.129.199.449.52.633.64.21.137.457.246.699.313.207.05.234.055.566.055.32 0 .367-.004.531-.047.848-.23 1.438-.813 1.672-1.649.047-.172.047-.207.047-.562s0-.39-.047-.563c-.234-.836-.836-1.43-1.672-1.644a1.6 1.6 0 0 0-.464-.055c-.157-.004-.336 0-.395.008m.582.915c.434.082.8.367.98.765.09.2.126.352.126.575s-.036.375-.126.57a1.364 1.364 0 0 1-2.421.105 1.2 1.2 0 0 1-.176-.668c0-.257.027-.386.137-.609.265-.55.875-.855 1.48-.738m0 0"
        />
      </g>
    </svg>,
    'device',
  );
  const PersonIcon = createSvgIcon(
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
        d="M 11.386719 0.0507812 C 10.625 0.144531 9.769531 0.433594 9.085938 0.835938 C 8.136719 1.390625 7.375 2.203125 6.84375 3.226562 C 6.371094 4.136719 6.171875 4.933594 6.171875 5.925781 C 6.171875 8.621094 7.699219 11.410156 9.882812 12.695312 C 10.363281 12.980469 10.71875 13.117188 11.179688 13.199219 C 11.519531 13.257812 12.46875 13.257812 12.820312 13.199219 C 13.101562 13.152344 13.492188 13.03125 13.71875 12.921875 C 15.871094 11.867188 17.453125 9.46875 17.785156 6.769531 C 17.835938 6.347656 17.820312 5.417969 17.757812 5.003906 C 17.65625 4.339844 17.488281 3.835938 17.1875 3.261719 C 16.855469 2.621094 16.503906 2.136719 16.054688 1.703125 C 15.144531 0.816406 13.902344 0.226562 12.605469 0.0585938 C 12.296875 0.0195312 11.660156 0.015625 11.386719 0.0507812 Z M 11.386719 0.0507812 "
      />
      <path
        stroke="none"
        fillRule="none"
        fill="currentcolor"
        fillOpacity="1"
        d="M 6.957031 12.703125 C 5.378906 13.289062 4.644531 13.59375 3.710938 14.054688 C 1.992188 14.898438 1.105469 15.535156 0.796875 16.148438 C 0.5625 16.621094 0.148438 17.949219 0.0351562 18.597656 C -0.015625 18.898438 -0.00390625 19.085938 0.0976562 19.355469 C 0.683594 20.921875 3.8125 22.230469 8.230469 22.75 C 10.230469 22.984375 12.503906 23.035156 14.535156 22.882812 C 18.613281 22.578125 22.015625 21.515625 23.390625 20.117188 C 23.890625 19.609375 24.0625 19.160156 23.976562 18.574219 C 23.914062 18.171875 23.578125 17.027344 23.367188 16.503906 C 23.1875 16.074219 23.050781 15.859375 22.777344 15.589844 C 22.292969 15.113281 21.605469 14.699219 20.09375 13.96875 C 18.972656 13.433594 18.390625 13.1875 17.234375 12.765625 L 16.550781 12.519531 L 16.230469 12.8125 C 15.707031 13.285156 15.285156 13.59375 14.78125 13.871094 C 14.253906 14.160156 13.558594 14.410156 13.054688 14.496094 C 12.679688 14.5625 11.976562 14.582031 11.496094 14.542969 C 10.664062 14.476562 10.203125 14.351562 9.472656 13.992188 C 8.886719 13.703125 8.382812 13.355469 7.792969 12.832031 C 7.597656 12.660156 7.441406 12.519531 7.4375 12.519531 C 7.433594 12.519531 7.21875 12.605469 6.957031 12.703125 Z M 6.957031 12.703125 "
      />
    </svg>,
    'person',
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
          </>
        )}
        {billingLink && (
          <MenuItem
            title={t('userBilling')}
            link={billingLink}
            icon={<PaymentIcon />}
          />
        )}
        {supportLink && (
          <MenuItem
            title={t('settingsSupport')}
            link={supportLink}
            icon={<HelpIcon />}
          />
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
