// @ts-nocheck

const supabaseUrl = 'https://bbjmlbzcqnhhteyhverk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiam1sYnpjcW5oaHRleWh2ZXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTIwMTcsImV4cCI6MjA3NDU2ODAxN30.ljRrFkqmxI0pLKZTGWPcwsbwMnU8_ToIs2nuKegM6s4';

if (!window.supabase) {
    throw new Error("Supabase client is not available. Make sure the script is loaded in index.html.");
}

const { createClient } = window.supabase;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
