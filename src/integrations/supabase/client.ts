// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xuntyhftuvkmjhyhphou.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bnR5aGZ0dXZrbWpoeWhwaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MzA5NzMsImV4cCI6MjA2NDAwNjk3M30.eNnhjzGtSlXCC0JX6tUxEWpTyMnUj32Bsp2BBhnu5nY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);