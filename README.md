This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


https://supabase.com/dashboard/project/gqwotpxjrmekgberhgqf/auth/url-configuration

https://github.com/meAnirban/dytmojo/tree/main

https://vercel.com/anirban-bhowmick-s-projects/dytmojo

https://hpanel.hostinger.com/domain/dytmojo.com/dns?tab=dns_records

# Final Testing Checklist

 Public Pages

☐ https://dytmojo.com loads — hero, photo, specialisations visible
☐ Navbar links all work — About, Dytbytes, Transformations, Blog
☐ "Join Now" and "Get Consultation" buttons → land on /get-consultation
☐ /dytbytes — coming soon page loads
☐ /transformations — page loads (empty grid is fine)
☐ /blog — "Blog posts coming soon" message shows

Consultation + OTP Flow

☐ Go to /get-consultation
☐ Fill in name, phone, email → click Submit
☐ OTP email arrives in inbox within 1 minute
   (check spam folder if not in inbox)
☐ Enter OTP → success message shows
☐ Check Supabase → consultation_requests table has the new row
   with status = 'pending'

Admin Login

☐ Go to https://dytmojo.com/admin
☐ Redirects to /admin/login (not logged in)
☐ Enter ADMIN_EMAIL → OTP sent
☐ Enter OTP → lands on Admin Overview dashboard
☐ Stats cards show correct numbers
☐ Sidebar navigation works — all 4 sections open correctly
☐ Try opening /admin in a different browser (not logged in) → redirects to login

Client Approval Flow

☐ Admin → Client Requests → Pending tab shows the test submission
☐ Click Approve → name moves to Approved tab instantly
☐ Check Supabase → clients table has a new row with that email
☐ Click Decline on another test → moves to Declined tab
☐ Move to Pending button works on both tabs

Transformation Story Flow

☐ Open a private/incognito browser window
☐ Go to /get-consultation → submit form with the approved client's email
☐ Enter OTP → verified
☐ Go to /transformations → "Add My Transformation Story" button is visible
☐ Click it → modal opens
☐ Write a story, pick rating, upload before/after photos
☐ Submit → success toast appears
☐ Admin → Transformations → new story appears
☐ Toggle Hide/Show works
☐ Delete works (test with a dummy story)
☐ Go back to /transformations as public visitor → story is visible


 Blog Flow

 ☐ Admin → Blog Posts → click "+ New Post"
☐ Write a title — check the slug auto-generates correctly
☐ Write some content using the toolbar (bold, heading, list)
☐ Add tags: recipes, tips
☐ Click "Save Draft" → goes back to list, shows as Draft
☐ Click Edit → click "Publish"
☐ Go to /blog → post appears with cover image
☐ Click post → full article renders with proper formatting
☐ Tags display correctly
☐ "Get Consultation" CTA at bottom of post → links correctly

Mobile Check

☐ Admin → Blog Posts → click "+ New Post"
☐ Write a title — check the slug auto-generates correctly
☐ Write some content using the toolbar (bold, heading, list)
☐ Add tags: recipes, tips
☐ Click "Save Draft" → goes back to list, shows as Draft
☐ Click Edit → click "Publish"
☐ Go to /blog → post appears with cover image
☐ Click post → full article renders with proper formatting
☐ Tags display correctly
☐ "Get Consultation" CTA at bottom of post → links correctly


 Performance & SEO Basics

 Add metadata to each page for Google. Update app/page.tsx and each page:

 // Add to each page file, customise per page
export const metadata = {
  title: 'dytmojo — Personal Dietitian & Nutrition Coach',
  description: 'Get personalised nutrition coaching, transformation support and dietitian-approved advice from [Dietitian Name].',
  openGraph: {
    title: 'dytmojo',
    description: 'Your personal dietitian for real, lasting transformation.',
    url: 'https://dytmojo.com',
    siteName: 'dytmojo',
    images: [{ url: 'https://dytmojo.com/images/og-cover.jpg' }],
  },
}


Add an OG image at public/images/og-cover.jpg — a 1200×630px image with the dytmojo brand. WhatsApp, Instagram link previews will use this.

