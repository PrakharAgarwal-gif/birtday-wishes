"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getWebsiteConfig, updateConfig, getGuestWishes } from "@/app/actions";
import { Save, Trash2, Image as ImageIcon, Music, Type, Sparkles, User, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const configSchema = z.object({
  recipientName: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  age: z.coerce.number().min(1),
  birthdayDate: z.string(),
  
  primaryColor: z.string().min(4),
  secondaryColor: z.string().min(4),
  accentColor: z.string().min(4),
  goldColor: z.string().min(4),
  
  primaryFont: z.string(),
  secondaryFont: z.string(),
  
  personalMessage: z.string().min(10),
  giftMessage: z.string(),
  footerMessage: z.string(),
  
  photoUrl: z.string(),
  galleryUrls: z.string(), // We'll use comma separated for easy entry
  musicUrl: z.string(),
  
  enableConfetti: z.boolean(),
  enableFireworks: z.boolean(),
  enableStars: z.boolean(),
  enableBalloons: z.boolean(),
});

type ConfigForm = z.infer<typeof configSchema>;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("core");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<any[]>([]);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConfigForm>({
    // @ts-ignore
    resolver: zodResolver(configSchema)
  });

  useEffect(() => {
    async function loadData() {
      const conf = await getWebsiteConfig();
      reset({
        recipientName: conf.recipient.name,
        nickname: conf.recipient.nickname,
        age: conf.recipient.age,
        birthdayDate: conf.recipient.birthdayDate,
        
        primaryColor: conf.theme.colors.primary,
        secondaryColor: conf.theme.colors.secondary,
        accentColor: conf.theme.colors.accent,
        goldColor: conf.theme.colors.gold,
        
        primaryFont: conf.theme.fonts?.primary || "Outfit",
        secondaryFont: conf.theme.fonts?.secondary || "Inter",
        
        personalMessage: conf.messages.personalMessage,
        giftMessage: conf.messages.giftMessage,
        footerMessage: conf.messages.footerMessage,
        
        photoUrl: conf.media.profilePhoto || "",
        galleryUrls: conf.gallery?.join(", ") || "",
        musicUrl: conf.media.music || "",
        
        enableConfetti: conf.animations?.confetti !== false,
        enableFireworks: conf.animations?.fireworks !== false,
        enableStars: conf.animations?.stars !== false,
        enableBalloons: conf.animations?.balloons !== false,
      });

      const w = await getGuestWishes();
      setWishes(w);
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setMessage("");
    const result = await updateConfig(data);
    setIsSaving(false);
    if (result.success) {
      setMessage("Configuration saved successfully!");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    } else {
      setMessage("Failed to save changes.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <TabButton id="core" active={activeTab} setActive={setActiveTab} icon={<User size={18} />} label="Core Info" />
        <TabButton id="media" active={activeTab} setActive={setActiveTab} icon={<ImageIcon size={18} />} label="Media & Theme" />
        <TabButton id="typography" active={activeTab} setActive={setActiveTab} icon={<Sparkles size={18} />} label="Typography & FX" />
        <TabButton id="messages" active={activeTab} setActive={setActiveTab} icon={<MessageSquare size={18} />} label="Messages" />
        <TabButton id="wishes" active={activeTab} setActive={setActiveTab} icon={<Trash2 size={18} />} label="Guest Wishes" />
      </div>

      <div className="p-8">
        {activeTab !== "wishes" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {activeTab === "core" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2">Recipient Information</h3>
                <Input label="Recipient Name" name="recipientName" register={register} error={errors.recipientName?.message} />
                <Input label="Nickname" name="nickname" register={register} />
                <Input label="Age Turning" name="age" type="number" register={register} />
                <Input label="Birthday Date (YYYY-MM-DD)" name="birthdayDate" type="date" register={register} />
              </div>
            )}

            {activeTab === "media" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2">Media URLs</h3>
                <Input label="Profile Photo URL" name="photoUrl" register={register} />
                <Input label="Background Music URL" name="musicUrl" register={register} />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Image URLs (Comma Separated)</label>
                  <textarea {...register("galleryUrls")} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" />
                </div>
                
                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2 mt-4">Theme Colors (Hex)</h3>
                <Input label="Primary Color" name="primaryColor" type="color" register={register} />
                <Input label="Secondary Color" name="secondaryColor" type="color" register={register} />
                <Input label="Accent Color" name="accentColor" type="color" register={register} />
                <Input label="Gold/Highlight Color" name="goldColor" type="color" register={register} />
              </div>
            )}

            {activeTab === "typography" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2">Fonts</h3>
                <Input label="Primary Font (Headers)" name="primaryFont" register={register} />
                <Input label="Secondary Font (Body)" name="secondaryFont" register={register} />

                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 border-b pb-2 mt-4">Animations & Effects</h3>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" {...register("enableConfetti")} className="w-5 h-5 text-pink-600 rounded" />
                    <span className="text-gray-700">Enable Confetti Explosions</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" {...register("enableFireworks")} className="w-5 h-5 text-pink-600 rounded" />
                    <span className="text-gray-700">Enable Fireworks Background</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" {...register("enableStars")} className="w-5 h-5 text-pink-600 rounded" />
                    <span className="text-gray-700">Enable Floating Stars</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" {...register("enableBalloons")} className="w-5 h-5 text-pink-600 rounded" />
                    <span className="text-gray-700">Enable Floating Balloons</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Written Messages</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Letter Content</label>
                  <textarea {...register("personalMessage")} rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gift Section Message</label>
                  <input {...register("giftMessage")} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Footer Message</label>
                  <input {...register("footerMessage")} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t flex items-center justify-between">
              <p className="text-sm text-green-600 font-medium">{message}</p>
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                {isSaving ? "Saving to Configuration..." : "Save All Changes"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "wishes" && (
          <div className="animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-6">Manage Guest Wishes</h3>
            {wishes.length === 0 ? (
              <p className="text-gray-500">No wishes submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {wishes.map((wish: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-900">{wish.name} <span className="font-normal text-xl">{wish.emoji}</span></h4>
                      <p className="text-gray-600 mt-1">{wish.message}</p>
                    </div>
                    <button className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ id, active, setActive, icon, label }: { id: string, active: string, setActive: (v: string) => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
        active === id 
        ? "bg-white text-pink-600 border-b-2 border-pink-500" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Input({ label, name, type = "text", register, error }: { label: string, name: string, type?: string, register: any, error?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type={type} 
        {...register(name)} 
        className={`w-full border rounded-lg px-4 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all ${
          type === 'color' ? 'h-12 py-1' : 'py-2'
        } ${error ? 'border-red-500' : 'border-gray-300'}`} 
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
