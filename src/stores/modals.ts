import { createSlice } from "@reduxjs/toolkit";

const modals = createSlice({
  name: "modals",
  initialState: {
    sidebarOpen: true,
    createGroupModalOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleCreateGroupModal: (state) => {
      state.createGroupModalOpen = !state.createGroupModalOpen;
    },
  },
});

export const { toggleSidebar, toggleCreateGroupModal } = modals.actions;
export default modals.reducer;
