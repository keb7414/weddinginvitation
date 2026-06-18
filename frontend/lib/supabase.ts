import { createClient } from "@supabase/supabase-js";

// 정적 빌드 시 env 가 없어도 import 단계에서 throw 하지 않도록 placeholder 사용.
// 실제 값은 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 로 주입.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(url, anonKey);
