import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fzxtzbjunceerbxibpww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6eHR6Ymp1bmNlZXJieGlicHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDQ5MTgsImV4cCI6MjA2ODkyMDkxOH0.bM_LVoQC4gITdhr1JgiSNWcv3rwHyjChX9BL3-03Db8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);