// File path: app/page.tsx
import Hero from "@/components/hero";
import ScrollPage from "@/components/scrollpage";
import { createClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';

const supabase = createClient();

export default async function Home() {
  const cookiesStore = cookies();
  const loggedInUserID = (await cookiesStore).get('usernameID')?.value;
  console.log(`Logged in User ID from cookies: ${loggedInUserID}`);  

  //Check if the user is logged in
  if (!loggedInUserID) {
    return (
      <>

      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        
      </main>
    </>
    );
  }
  else {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-3 md:px-6">
          <ScrollPage />
        </div>
    </>
  );
}
}