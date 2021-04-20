import {  useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { geofencesActions, groupsActions, driversActions, calendarsActions, commandsActions, computedAttributesActions, maintenancesActions, notificationsActions } from './store';
import { useEffectAsync } from './reactHelper';

const CachingController = () => {
  const authenticated = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/geofences');
      if (response.ok) {
        dispatch(geofencesActions.update(await response.json()));
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/groups');
      if (response.ok) {
        dispatch(groupsActions.update(await response.json()));
      }
    }
  }, [authenticated]); 
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/drivers');
      if (response.ok) {
        dispatch(driversActions.update(await response.json()));
      }
    }
  }, [authenticated]);
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/calendars');
      if (response.ok) {
        dispatch(calendarsActions.update(await response.json()));
      }
    }
  }, [authenticated]);
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/commands');
      if (response.ok) {
        dispatch(commandsActions.update(await response.json()));
      }
    }
  }, [authenticated]);
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/attributes/computed');
      if (response.ok) {
        dispatch(computedAttributesActions.update(await response.json()));
      }
    }
  }, [authenticated]);
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/maintenance');
      if (response.ok) {
        dispatch(maintenancesActions.update(await response.json()));
      }
    }
  }, [authenticated]); 
  
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        dispatch(notificationsActions.update(await response.json()));
      }
    }
  }, [authenticated]);   
  
  return null;
}

export default connect()(CachingController);
