"use server";

import { supabase } from "@/lib/supabase";
import { config as staticConfig } from "@/config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function loginAdmin(password: string) {
  if (password === "birthday2026") {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

// --- FETCH ACTIONS ---

export async function getWebsiteConfig() {
  // Always use local staticConfig as the single source of truth
  // to ensure local changes appear on the live site immediately.
  return staticConfig;
}

export async function getGuestWishes() {
  try {
    const { data, error } = await supabase
      .from("guest_wishes")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return staticConfig.wishes;
    }
    return data.map(d => ({ name: d.guest_name, message: d.message, emoji: d.emoji }));
  } catch (e) {
    return staticConfig.wishes;
  }
}

// --- MUTATION ACTIONS ---

export async function submitGuestWish(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const emoji = (formData.get("emoji") as string) || "🎉";

  if (!name || !message) {
    return { success: false, error: "Name and message are required" };
  }

  try {
    const { error } = await supabase.from("guest_wishes").insert([
      { guest_name: name, message, emoji, is_approved: true }
    ]);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error("Failed to submit wish", e);
    return { success: false, error: e.message };
  }
}

export async function updateConfig(data: any) {
  // Check auth
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const galleryArray = data.galleryUrls ? data.galleryUrls.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
    
    // Try updating Supabase first
    try {
      const { error } = await supabase.from("website_config").upsert({
        id: 1,
        recipient_name: data.recipientName,
        nickname: data.nickname || "",
        age: data.age,
        birthday_date: data.birthdayDate,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        accent_color: data.accentColor,
        gold_color: data.goldColor,
        personal_message: data.personalMessage,
        gift_message: data.giftMessage,
        footer_message: data.footerMessage,
        background_image_url: "",
        background_music_url: data.musicUrl,
        video_url: "",
      });
      if (error) console.error("Supabase upsert error:", error);
    } catch (dbError) {
      console.error("Failed to connect to Supabase:", dbError);
    }

    // Generate the new config.ts content
    const newConfigContent = `export const config = {
  recipient: {
    name: ${JSON.stringify(data.recipientName)},
    nickname: ${JSON.stringify(data.nickname || "")},
    birthdayDate: ${JSON.stringify(data.birthdayDate)},
    age: ${data.age},
    relationship: "Best Friend",
  },
  theme: {
    colors: {
      primary: ${JSON.stringify(data.primaryColor)},
      secondary: ${JSON.stringify(data.secondaryColor)},
      accent: ${JSON.stringify(data.accentColor)},
      gold: ${JSON.stringify(data.goldColor)},
      background: "#0a0a0a",
      text: "#ffffff",
    },
    fonts: {
      primary: ${JSON.stringify(data.primaryFont)},
      secondary: ${JSON.stringify(data.secondaryFont)},
    }
  },
  messages: {
    landingTitle: "Someone has prepared something special just for you...",
    buttonText: "Open My Birthday Surprise",
    personalMessage: ${JSON.stringify(data.personalMessage)},
    giftMessage: ${JSON.stringify(data.giftMessage)},
    footerMessage: ${JSON.stringify(data.footerMessage)},
  },
  media: {
    profilePhoto: ${JSON.stringify(data.photoUrl)},
    background: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=2070&auto=format&fit=crop",
    music: ${JSON.stringify(data.musicUrl)},
    video: "",
  },
  animations: {
    confetti: ${data.enableConfetti},
    fireworks: ${data.enableFireworks},
    stars: ${data.enableStars},
    balloons: ${data.enableBalloons},
  },
  timeline: ${JSON.stringify(staticConfig.timeline, null, 4)},
  gallery: ${JSON.stringify(galleryArray.length > 0 ? galleryArray : staticConfig.gallery, null, 4)},
  quotes: ${JSON.stringify(staticConfig.quotes, null, 4)},
  wishes: ${JSON.stringify(staticConfig.wishes, null, 4)},
};
`;

    const configPath = path.join(process.cwd(), "src/config.ts");
    try {
      fs.writeFileSync(configPath, newConfigContent, "utf8");
    } catch (fsError) {
      console.log("Could not write config.ts (Expected behavior in Vercel production)");
    }

    // Force Next.js to revalidate everything
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (e: any) {
    console.error("Failed to update config locally:", e);
    return { success: false, error: e.message };
  }
}
