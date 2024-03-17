import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export const deposit = createAsyncThunk(
  "account/deposit",
  async (payload, thunkAPI) => {
    const { amount, currency } = payload;
    const { rejectWithValue } = thunkAPI;
    if (currency === "IDR") return amount;
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=IDR`
      );
      const data = await response.json();
      const convertedAmount = data.rates.IDR;
      return convertedAmount;
    } catch (error) {
      return rejectWithValue("something went wrong");
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) {
          return;
        }

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state, action) {
      state.balance = state.balance - state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deposit.fulfilled, (state, action) => {
      state.isLoading = false
      state.balance = state.balance + action.payload
    })
    builder.addCase(deposit.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deposit.rejected, (state) => {
      state.isLoading = false
    })
  },
});

export const { withdraw, payLoan, requestLoan } = accountSlice.actions;

export default accountSlice.reducer;
