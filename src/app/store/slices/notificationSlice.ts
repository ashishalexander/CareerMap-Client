import { createSlice } from '@reduxjs/toolkit';

interface NotificationState {
  hasNewNotifications: boolean;
}

const initialState: NotificationState = {
  hasNewNotifications: false
};

const notificationSlice = createSlice({
  name: 'notificati',
  initialState,
  reducers: {
    setNewNotification: (state) => {
      state.hasNewNotifications = true;
    },
    clearNewNotificationIndicator: (state) => {
      state.hasNewNotifications = false;
    }
  }
});

export const { setNewNotification, clearNewNotificationIndicator } = notificationSlice.actions;
export default notificationSlice.reducer;