import { getWebsiteConfig, getGuestWishes } from "./actions";
import ClientPage from "./ClientPage";

// This tells Next.js to revalidate the page if data changes (every 60s)
export const revalidate = 60;

export default async function Home() {
  const config = await getWebsiteConfig();
  const initialWishes = await getGuestWishes();

  return <ClientPage config={config} initialWishes={initialWishes} />;
}
