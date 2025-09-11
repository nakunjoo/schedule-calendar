import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Default values for development - replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mleenaivuhqyrylmqrme.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZWVuYWl2dWhxeXJ5bG1xcm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NTI5NzcsImV4cCI6MjA3MzEyODk3N30.pOQS8e_pFXEp2YoMbiJF6PTp4pPUsuAfSygwjjr_CGg'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type { Database }