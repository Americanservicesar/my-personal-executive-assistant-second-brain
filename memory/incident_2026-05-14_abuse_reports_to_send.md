---
name: ASAR Hack Incident — Abuse Reports to Send
description: Pre-drafted abuse reports for Anthony Sons to submit (Limestone, FBI IC3, AbuseIPDB)
type: incident-reports
date: 2026-05-14
originSessionId: 022c526e-77b1-4867-8d43-ff7cfe6756ff
---
# 3 REPORTS TO SUBMIT — americanservicesar.com Hack

---

## 1) LIMESTONE NETWORKS ABUSE DESK (HIGHEST PRIORITY — fastest result)

**To**: `abuse@limestonenetworks.com`
**Cc**: (optional) `noc@limestonenetworks.com`
**Subject**: Active malicious traffic from your IP 38.95.35.74 — WordPress exploit campaign — americanservicesar.com

```
Hello Limestone Abuse Team,

I am writing to report active malicious activity originating from an IP in your address space.

ATTACKING IP: 38.95.35.74
TARGET: americanservicesar.com (my website)
DATE OF ACTIVITY: 2026-05-14, 17:56 CT (just hours ago, ongoing)
NATURE: Unauthorized POST request attempting to exploit WordPress plugin
         vulnerability (file upload chain against WP Table Builder).

REQUEST DETAILS (from my web server logs):
  Method:    POST
  URL:       /wp-content/plugins/wp-table-XXXXX-XXXXX.php
  Status:    409 (blocked by my .htaccess armor)
  Time:      2026-05-14 17:56 CT
  Source IP: 38.95.35.74

This is part of a multi-day campaign (initial breach 2026-05-06) during
which the attacker dropped at least 24 backdoor PHP webshells onto my
WordPress installation and injected malware into a core file
(wp-includes/capabilities.php) which crashed the site. Full incident
report available on request.

Your IP 38.95.35.74 is in AS46475 (Limestone Networks) per BGP records.
The request was made directly without proxying, suggesting a VPS or
dedicated server within your facility.

I respectfully request that you:

1) Investigate the customer assigned 38.95.35.74 (and the broader /24
   block, as adjacent IPs may also be involved).
2) Suspend any account engaged in this activity per your Acceptable Use Policy.
3) Provide a case/ticket number for my records.

I will also be filing complaints with:
  - FBI IC3 (Internet Crime Complaint Center)
  - AbuseIPDB
  - Bluehost (my hosting provider, who will be coordinating on cleanup)

Thank you for your prompt attention. Please reply with a ticket number.

Best,
Anthony Sons
Owner, American Services AR
clickcallsell@gmail.com
americanservicesar.com
```

**Where to send:**
- Open your Gmail (`clickcallsell@gmail.com`)
- Compose new email to `abuse@limestonenetworks.com`
- Paste the above
- Attach this incident report if you want (file: `incident_2026-05-14_wordpress_hack.md`)
- Send

---

## 2) FBI IC3 REPORT (Internet Crime Complaint Center)

**URL**: https://www.ic3.gov/Home/ComplaintChoice
**Type**: "Computer Intrusion" or "Hacking"

Click through the IC3 form and use this data:

**Reporting Person**:
- Anthony Sons
- American Services AR (LLC / business)
- Phone: [your phone]
- Email: clickcallsell@gmail.com OR asons@americanservicesar.com
- Address: [your business address]

**Subject of Complaint (the attacker)**:
- Not personally identifiable. Hosted at IP 38.95.35.74 via Limestone Networks (a Chicago, IL VPS provider).
- Operator identity unknown; would require subpoena to Limestone Networks
  for VPS rental records.

**Incident Description (paste into the narrative field)**:
```
On 2026-05-06 at approximately 4:51 PM Central Time, an unauthorized
party began compromising my business website americanservicesar.com,
hosted on Bluehost. The attacker exploited what appears to be a known
vulnerability in the WP Table Builder WordPress plugin, dropping a
PHP webshell file (tbl_select.php) into the website's root directory.

Over the following 8 days the attacker maintained persistence by
uploading 7 additional backdoor PHP files, including:
- info_acp_gallery.php (admin control panel malware)
- masterEN.php
- repair.php
- skipfiles.php
- ok.php (a 47.5 KB full-feature webshell)

The attacker then attempted to establish long-term persistence by
injecting 936 bytes of malicious PHP code at the top of the
WordPress core file wp-includes/capabilities.php on 2026-05-14.
This injection caused a syntax error, which crashed the site and
brought it to my attention.

I have since:
- Removed all malware from wp-includes/capabilities.php
- Neutralized all 24 known backdoor PHP files
- Hardened the site with .htaccess armor, blocked the attacker IPs,
  and disabled file editing in WordPress admin
- Engaged Cloudflare WAF (in propagation)

Forensic evidence captured:
- Source IP of active attacker: 38.95.35.74 (Limestone Networks
  VPS, Chicago IL, AS46475)
- Secondary suspicious IPs: 216.73.217.122 (AWS US-East-2),
  171.236.48.162 (Viettel residential, Vietnam)
- File modification timestamps documenting the 8-day persistence

The attack would have used my website to host phishing pages,
distribute malware, or be sold to other actors. Google flagged
the domain as "Deceptive Site Ahead" because of the malware,
which has likely cost my business search traffic and customer trust.

I am submitting this complaint to create a federal record of the
incident and to support any future investigation if 38.95.35.74 is
linked to a larger campaign.
```

**Financial Loss**:
- Estimate based on actual costs:
  - Site downtime: ~6 hours of business disruption
  - Google Safe Browsing flag impact: TBD (review request pending)
  - Recovery labor: 8+ hours
  - Estimated loss: $[your estimate — recommend $500-$2,000]

**Evidence to attach** (PDF or screenshots):
- Screenshot of attacker's POST request in cPanel Visitor log (this is the smoking gun)
- Screenshot of the "Deceptive Site Ahead" warning if you saw it
- Copy of the incident_2026-05-14_wordpress_hack.md file

---

## 3) AbuseIPDB REPORT

**URL**: https://www.abuseipdb.com/report
**Account**: Free signup at https://www.abuseipdb.com/register if you don't have one

**Submit 3 separate reports (one per IP):**

### Report A — IP `38.95.35.74`
- **Categories**: Web App Attack, Hacking, Bad Web Bot
- **Comment**:
```
Active WordPress plugin exploit campaign against my site
americanservicesar.com. POST to /wp-content/plugins/wp-table-XXX.php
on 2026-05-14 17:56 CT. Part of 8-day persistence campaign that
dropped 24 backdoor PHP files and injected malware into
wp-includes/capabilities.php. Hosted at Limestone Networks VPS.
Blocked at .htaccess. Full incident report available.
```

### Report B — IP `216.73.217.122`
- **Categories**: Bad Web Bot, Hacking, Web App Attack
- **Comment**:
```
18 GET requests to /items/Kxxxxxxx/ URLs returning 500 errors
during my WordPress site compromise (americanservicesar.com).
AWS EC2 ephemeral instance, US-East-2. Part of larger attack
campaign during same window as confirmed attacker 38.95.35.74.
```

### Report C — IP `171.236.48.162`
- **Categories**: Brute-Force, Bad Web Bot
- **Comment**:
```
Suspicious GET requests during active WordPress compromise of
americanservicesar.com. Viettel residential range (likely
botnet-conscripted home router). Part of same multi-IP attack
campaign on 2026-05-06 to 2026-05-14.
```

---

## 4) (BONUS) BLUEHOST ABUSE REPORT

Bluehost has their own internal threat intel + can cross-check the
attack against other infected sites on their network.

**To**: `abuse@bluehost.com`
**Subject**: WordPress compromise on hosted site americanservicesar.com — cPanel user ericaqw6

Same body as the Limestone report but ask them to:
1. Review their server logs for the attacker IP across other tenant sites
2. Confirm whether other Bluehost sites are being hit by the same campaign
3. Provide their own incident response support

---

## ORDER OF OPERATIONS

1. **Right now (5 min)** — Send Limestone abuse email. Fastest impact.
2. **Today (15 min)** — File the 3 AbuseIPDB reports. Protects others.
3. **Today (30 min)** — File the FBI IC3 complaint. Federal record.
4. **Tomorrow** — Bluehost abuse report once you have time to talk to support if needed.

---

## TRACKING

| Report | Sent? | Reference # / Ticket | Response |
|--------|-------|---------------------|----------|
| Limestone Networks | [ ] | | |
| FBI IC3 | [ ] | | |
| AbuseIPDB — 38.95.35.74 | [ ] | | |
| AbuseIPDB — 216.73.217.122 | [ ] | | |
| AbuseIPDB — 171.236.48.162 | [ ] | | |
| Bluehost abuse | [ ] | | |
