# Shop.co UI mockups for Lucy

_Started 2026-11-12 13:33 UTC_

---

## User

Make UI mockups for Updated UI/UX Architecture & Layout Spec (Shop.co Inspired)
1. Global Header & Announcement Marquee
Top Banner Bar (Electric Lime #D4FF00 or Deep Forest #0F3D3E): 🔥 Free delivery in Juja, Kahawa & CBD for orders > KES 2,500 • Pay via M-Pesa on Delivery

Header Bar:

Left: Lucy HOUSEHOLD ITEMS bold branding badge.

Center: Wide search bar (Search kettles, LED lights, duvets, sockets...) with instant autocomplete.

Right: Nav links (Shop, Deals, Starter Packs) + Admin Portal button.

2. Shop Catalogue View (Two-Column Split layout inspired by Image 4)
Left Sidebar (Desktop Filter Panel):

Categories: Bedsitter Kitchen, Hostel Storage, Aesthetic Lighting, Cleaning & Laundry, Bedding & Comfort.

Student Budget Filter Range: Quick price brackets (Under KES 500, KES 500 - 1,500, KES 1,500 - 3,000+).

Availability Filter: In Stock Now vs Pre-order / Restocking.

Main Right Content Area:

Sorting Header: Showing active result count + Dropdown (Sort by: Price: Low to High, Newest Campus Arrivals, Biggest Discount %).

Product Grid (3 Columns):

Cards featuring high-contrast image containers, floating badge (CAMPUS STEAL, -38%), bold current price in KES next to strikethrough original price, and a direct "Buy on WhatsApp" button.

Pagination footer (< Previous 1 2 3 ... 8 Next >).

3. Professional Newsletter & Footer Section (Inspired by Image 4 bottom)
Dark Conversion Banner: "STAY UPTO DATE ABOUT OUR LATEST CAMPUS DEALS" with an email/WhatsApp number input for flash drop alerts.

Footer Columns:

Lucy Household Items: Mission statement ("Drip for your crib, without breaking HELB").

Campus Hubs: Juja (JKUAT), Rongai (USIU/Kenyatta/Riara), Nairobi CBD, Eldoret.

Help & Support: FAQ, M-Pesa Payment Guide, Delivery Timelines, Return Policy.

Accepted Payment Icons: M-Pesa, Visa, Mastercard, Bank Transfer.

Would you like me to write out the updated frontend code incorporating thi

## Assistant



## Assistant

_[tool: ask_user]_

Waiting on your form answers (or hit "decide for me" and I'll pick defaults and build).

## User

<artifact-content-authored-by-others/>
Answered — Asked for follow-up questions; banner: Show both; viewport: Desktop + mobile; variations: One polished; vary: Product card style; interactive: Working filters/sort/search; photos: Placeholders; admin: Also mock admin screen

## Assistant



## Assistant

_[tool: ask_user]_

Waiting on the second round of answers: overall look, headline type, mobile filters, admin scope and card variants.

## User

<artifact-content-authored-by-others/>
Answered — look: Loud and youthful: lime-heavy, chunky type, sticker badges; type: Friendly rounded; mobile_filters: Scrolling chips; admin_screen: Product list with stock, price and badge editing; card_variants: Yes, as a tweak toggle; open_qs: 1. 2. Target Audience & Personas Primary User: Administrator / Curator (Lucy) Role: Channel owner and product manager monitoring WhatsApp supplier groups and student requests. Goals: Quickly post new…

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

Three screens are on one canvas, out for review: desktop catalogue, mobile catalogue and the Admin Studio product list.

- **Working:** search with autocomplete, category/budget/availability filters, sort and pagination all work. Admin edits to price, badge and stock update both storefronts live.
- **Tweaks:** banner colour (Electric Lime / Deep Forest), card style (Sticker / Clean / Forest), badge accent (Lime / Coral), marquee scroll.
- **Placeholders:** product photos are striped placeholders, and the 18 products and their prices are sample data I made up.
- **WhatsApp:** "Buy on WhatsApp" opens a pre-filled message but has no number yet; send me Lucy's.
- **Not built:** hero banner, product detail drawer, add/edit product form. "+ New product", the nav links and the mobile menu button are not wired up.

I added a sixth category, Smart Tech & Study, from your longer brief, plus a "Price: High to Low" sort.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

Fixed the mobile badge overlap: the discount % pill now sits bottom-right of the image, clear of the tag. I haven't re-measured it after the change.

Your usage limit is nearly reached, so I've stopped here. Still open: Lucy's WhatsApp number for the order links, and the optional hero banner, product detail drawer and add/edit product form.

## User

banners are important to add promotional itmes and holiday discounts find aplace to  add it

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Added a promo banner slot, out for review:

- **Desktop:** two banners between the header and the catalogue. A large lime promo with a photo placeholder, and a smaller forest-green holiday discount card.
- **Mobile:** the same two banners as a swipeable row under the search bar.

The headlines come from your brief ("Bedsitter Glow-Up Under KES 3,000", "Back-to-Campus Essentials"); the "PROMO" and "HOLIDAY DISCOUNT" labels and button text are mine, and the buttons don't link anywhere yet. Banners are fixed text for now. Lucy can't edit them from the Admin Studio; say if you want a banner manager added there.

## User

in the mobile view there are too many filters

## Assistant

## User

in the mobile view there are too many filters

## Assistant

## User

in the mobile view there are too many filters

## Assistant

## User

in the mobile view there are too many filters

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

On mobile, the category chips stay as a scrolling row. The budget, availability and sort options are now three compact dropdowns in one row beneath it, with the product count below. That replaces the two extra rows of chips and the separate sort control. I haven't viewed the mobile screen since the change.

