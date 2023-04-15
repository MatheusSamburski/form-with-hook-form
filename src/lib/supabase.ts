import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    "https://tztpataljtjcltkdfppp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dHBhdGFsanRqY2x0a2RmcHBwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTU4NDM4OCwiZXhwIjoxOTk3MTYwMzg4fQ.UsvqgAr_B0J28iF0w14B9wRwxJWUnt_brVeJtU_3EEY"
)