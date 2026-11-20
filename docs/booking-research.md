# Booking research: how fine-dining sites take reservations

Done for revision 1.1, after feedback that the reserve page was a plain form. Sources were fetched on 2026-11-20. Findings are paraphrased. Nothing here was copied.

## What the serious systems do

**Tock (Alinea, Atomix, French Laundry group).** Sells tables like concert tickets. One restaurant page lists several bookable "experiences" next to the normal dining room: a chef's counter tasting, a cellar flight, a patio supper. Payment type is set per experience: free, deposit, card hold, or fully prepaid. The founder's reason is money: Alinea was losing about $800k a year to no-shows before prepaid booking. Sources: exploretock.com/join/experiences, exploretock.com/join/reservations, restaurant-hospitality.com/node/41606.

**Resy.** Guests choose where they sit inside the booking flow (patio, chef's counter) through custom table types. Restaurants can hold hours for regulars. Cancelled tables go out as real-time notifications, and a waitlist handles walk-ins. Sources: resy.com/resyos/en_ca/features/service, resy.com/join/restaurants.

**OpenTable.** Added "dining areas" so a guest can pick terrace, bar or an accessible ground-floor area at booking time, and can change it later from "manage reservation". Search data cited in the same post says outdoor and rooftop requests were rising. Source: opentable.com blog, "You Can Now Choose Your Seat at a Restaurant on OpenTable".

**SevenRooms.** Treats the booking as the start of a guest profile: occasion, birthday, dietary restrictions and seating preference are captured at booking so the host and servers see them before service. Private rooms and group spaces appear in the normal booking flow instead of behind an inquiry form. Prepaid add-ons (welcome drink, cake) and chef's table upsells sit inside the flow. The site is available in 14 languages. Sources: sevenrooms.com/platform/reservations, sevenrooms.com/blog/best-restaurant-event-management-software, sevenrooms.com/press/guest-intelligence-tools-launch.

**TableCheck (Japan, omakase counters).** The Japanese counter model differs from Western tables:
- Course choice comes first, and the course decides which seat categories and party sizes are allowed (counter 1 to 4, private room 4 to 7).
- Seat category is a selector (Counter / Table / Any), and several venues say plainly that a request is not guaranteed.
- Cancellation policy is shown in full on the booking page, usually as a sliding scale by days before (examples seen: 10/30/50/100% of the course fee, or 50% the day before and 100% on the day).
- A card is often required but charged only on a late cancel or no-show.
- Lateness rules are explicit (arriving over 30 minutes late can release the seat).
- Allergy and occasion questions are asked in the form, not left to a free-text box.
Sources: tablecheck.com shop pages for Sushi Takuma, Tomo Banya, Sushi Korin, Ginza Sushi Yoshi Hanare, Sushi Hakugin.

**Operator guidance (Toast).** Show live availability by date, party size and time. Offer alternative slots when peak times are full. Confirm instantly. State the cancellation window and no-show consequence before the guest commits, and repeat the policy at every touchpoint. Source: pos.toasttab.com reservation policy and best-practice posts.

## Patterns worth building (and what each one answers)

1. **Seating type first, because it changes everything after it.** The choice sets party size limits, which time slots exist, and the deposit.
2. **A real month calendar with availability states** (open, few left, full, closed), not a native date input. Closed days must look closed.
3. **Slots as buttons grouped by part of the evening**, with seats left shown when scarce.
4. **Waitlist on full slots** ("notify me") instead of a dead end.
5. **Occasion and dietary as chips**, plus a notes field. Dietary on a set-menu counter needs advance notice, so say so.
6. **Seating notes** (quiet, near the fire, step-free, high chair) kept separate from allergies.
7. **Add-ons inside the flow** (pairing, celebration plate), clearly optional.
8. **Policy before commitment**: deposit amount, cancel window, lateness rule, all visible in the review step, with explicit agreement.
9. **A live summary** that follows the guest, then a confirmation with reference, calendar file and what happens next.
10. **Honesty for a concept site.** No card fields, no real send. The confirmation says so.

## Not copied

Layouts, copy and assets of the systems above were not reused. The step structure is a common pattern across them. The visual design, copy, Japanese-counter seating model and policy wording are original to this project.
