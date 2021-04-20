import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'notifications',
  initialState: {
    items: {},
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['id']] = item);
    },
  }
});

export { actions as notificationsActions };
export { reducer as notificationsReducer };
