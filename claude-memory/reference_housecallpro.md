---
name: HousecallPro Booking Integration
description: HCP booking widget token, API key, booking page URL, and UTM tracking pattern for conversion tracking on americanservicesar.com
type: reference
---

- HCP Token: `45f072dc777541658391f978b7f64a3d`
- Org Name: `American-Services-AR`
- API Key: `13317c556f61472e8a57c60e0bea930f`
- Booking Page: `https://book.housecallpro.com/book/American-Services-AR/45f072dc777541658391f978b7f64a3d?v2=true`
- UTM Pattern: `&utm_source=website&utm_medium=organic&utm_campaign=[service]-[city]`
- Widget code requires `<script src="https://online-booking.housecallpro.com/script.js?token=45f072dc777541658391f978b7f64a3d&orgName=American-Services-AR">` on every page with booking button
- Booking redirect after success → `/thank-you/` page on site
- HCP source attribution tags: website, facebook, instagram, yard-sign, email
- GA4 tracking: GTM fires `generate_lead` on HCP button click, `booking_complete` on /thank-you/ pageview
