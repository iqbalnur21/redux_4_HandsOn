import { createSlice } from "@reduxjs/toolkit";

const initialStateCustomer = {
  fullName: '',
  nationalId: '',
  createdAt: '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialStateCustomer,
  reducers: {
    createCustomer(state, action) {
      const { fullName, nationalId } = action.payload;
      state.fullName = fullName;
      state.nationalId = nationalId;
      state.createdAt = new Date().toISOString();
    },
    updateName(state, action) {
      state.fullName = action.payload.fullName;
    },
  },
});

export const { createCustomer, updateName } = customerSlice.actions;

export default customerSlice.reducer;
