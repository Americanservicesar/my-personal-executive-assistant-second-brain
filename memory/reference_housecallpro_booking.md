---
name: HousecallPro Online Booking
description: HCP booking widget code, booking page URL, Reserve with Google issue, and phone number mismatch
type: reference
---

## Online Booking Widget (embed on website)
```html
<!--Start of Housecallpro Online booking button-->
<button data-token="45f072dc777541658391f978b7f64a3d" data-orgname="American-Services-AR" class="hcp-button" onClick="HCPWidget.openModal()">
  Book online
</button>
<script async src="https://online-booking.housecallpro.com/script.js?token=45f072dc777541658391f978b7f64a3d&orgName=American-Services-AR">
</script>
<!--End of Housecallpro Online booking button-->
```

## Booking Page URL
https://book.housecallpro.com/book/American-Services-AR/45f072dc777541658391f978b7f64a3d?v2=true

## Token
`45f072dc777541658391f978b7f64a3d`

## Reserve with Google — BROKEN
- Error: mismatching business phone numbers
- HousecallPro has: **501-289-5623**
- Google Business Profile has: **501-932-8681**
- Fix: Update one to match the other. Recommend updating HCP to match GBP (501-932-8681) since GBP is the public-facing number

## Online Booking Services
Services with online booking enabled should be simple, fixed-price residential services only. Complex/commercial services should be in-house estimate only. See pricebook audit for the full list.
