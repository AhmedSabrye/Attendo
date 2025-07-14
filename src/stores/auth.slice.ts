// authSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import type { AppDispatch } from "./store";

/* ---------- RTK Query API ---------- */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // not used; we're calling Supabase
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // GET /me  (initial session)
    getMe: builder.query<Session | null, void>({
      queryFn: async () => {
        const { data } = await supabase.auth.getSession();
        return { data: data.session };
      },
      providesTags: ["Auth"],
    }),

    // POST /signup
    signUp: builder.mutation<Session | null, { email: string; password: string; username: string }>({
      queryFn: async ({ email, password, username }) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: dbError } = await supabase.from("Users").insert([{ auth_user_id: data.user.id, username, email }]);
          if (dbError) throw dbError;
        }
        return { data: data.session };
      },
      invalidatesTags: ["Auth"],
    }),

    // POST /login
    signIn: builder.mutation<Session | null, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { data: data.session };
      },
      invalidatesTags: ["Auth"],
    }),

    // POST /logout
    signOut: builder.mutation<void, void>({
      queryFn: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { data: undefined };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

/* ---------- Slice to hold current session in Redux ---------- */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

/* ---------- Function to setup auth state change listener ---------- */
export const authStateChange = (dispatch: AppDispatch) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_, session) => {
    dispatch(authSlice.actions.setSession(session));
  });

  // Return cleanup function
  return () => subscription.unsubscribe();
};

/* ---------- Exports ---------- */
export const { useGetMeQuery, useSignUpMutation, useSignInMutation, useSignOutMutation } = authApi;
export const { setSession, setLoading } = authSlice.actions;
export const authReducer = authSlice.reducer;
