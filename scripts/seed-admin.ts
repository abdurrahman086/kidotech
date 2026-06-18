import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function seedAdmin() {
  console.log("🚀 Creating admin user...");

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Create user via Admin API (password ter-hash otomatis, email langsung confirmed)
  const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
    email: "abdurrahmanbantaniy@gmail.com",
    password: "admin123",
    email_confirm: true,
    user_metadata: { full_name: "Abdurrahman" },
  });
  if (userErr) {
    if (userErr.message?.includes("already exists")) {
      console.log("⚠️  User already exists, skipping creation.");
    } else {
      throw userErr;
    }
  } else {
    console.log("✅ User created:", userData.user.email);
  }

  // 2. Dapatkan user ID (dari hasil create atau cari yang sudah ada)
  const userId =
    userData?.user?.id ??
    (await supabase
      .from("profiles")
      .select("id")
      .eq("email", "abdurrahmanbantaniy@gmail.com")
      .single()
      .then((r) => r.data?.id));

  if (!userId) {
    const { data: authUser } = await supabase.auth.admin.listUsers();
    const found = authUser?.users.find((u) => u.email === "abdurrahmanbantaniy@gmail.com");
    if (!found) throw new Error("User tidak ditemukan di auth.users");
    await assignRole(supabase, found.id);
    return;
  }

  await assignRole(supabase, userId);
}

async function assignRole(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  // Cek apakah role sudah ada
  const { data: existing } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (existing) {
    console.log("ℹ️  Admin role already assigned.");
    return;
  }

  const { error: roleErr } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (roleErr) throw roleErr;

  console.log("✅ Admin role assigned to user:", userId);
  console.log("🎉 Seed complete! Login di /auth dengan:");
  console.log("   Email: abdurrahmanbantaniy@gmail.com");
  console.log("   Pass:  admin123");
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
