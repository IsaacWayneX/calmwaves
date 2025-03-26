import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fdpyjzjleezlcebhyapq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcHlqempsZWV6bGNlYmh5YXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDk5NzgsImV4cCI6MjA1ODUyNTk3OH0.uJFd0_82OgbMNa22YLfVF_u61BhSnvQQFInn4Is0m5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
