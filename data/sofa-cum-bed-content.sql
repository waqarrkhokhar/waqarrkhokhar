ALTER TABLE categories ADD COLUMN IF NOT EXISTS content_html TEXT;

UPDATE categories
SET content_html = '<h2>Sofa Come Bed Collection</h2>
<p>Furniture shopping in Pakistan rarely happens on the first scroll. A sofa come bed, also written as sofa cum bed, has to work as proper seating during the day and a real bed at night without falling apart after a few months of folding. That is the standard we built this collection around.</p>
<p>Every sofa come bed here is made to order at our workshop in Lahore. Nothing sits pre-built in a warehouse waiting for a buyer. You choose the fabric, confirm the size, and we start cutting frame and foam only after your order is placed. It takes longer than buying off a showroom floor, but the piece that arrives is built for your home specifically, not assembled to a generic spec months ago.</p>
<h2>Why the Frame and Foam Matter More Than the Fabric</h2>
<p>Most sofa cum bed price comparisons in Pakistan focus on fabric and finish, which is the part you can see in a photo. The part that actually determines how long the piece lasts is hidden underneath: the wood frame and the foam. We use solid wood frames backed by a 2.5-year warranty, not particleboard that loosens at the joints after repeated folding. The foam across this collection is Molty Foam, which holds its shape through nightly use far better than the unbranded foam common in budget sofa come bed designs, and it carries a 5-year warranty.</p>
<p>This is the difference between a sofa come bed that still folds smoothly after two years and one that starts sagging within months. If you are comparing a sofa come bed price in Pakistan across different sellers, ask what is inside the cushion before asking about the fabric colour.</p>
<h2>Designs in This Collection</h2>
<p>The range covers the formats Pakistani households actually search for. Wooden design sofa cum beds with visible solid wood arms and legs for buyers who want the frame on display rather than hidden under upholstery. Single sofa come bed options sized for smaller bedrooms, guest rooms, and studio apartments where a 3-seater would overwhelm the space. L shape sofa cum bed layouts for corner placement in open living rooms. Tufted, channel-backed, and boucle-finished pieces for buyers prioritising how the sofa looks when it is folded up and being used as daily seating, since that is its default state most of the year.</p>
<p>Every product page lists the fold mechanism, the closed and open dimensions, and the fabric options for that specific design, so you know exactly what you are ordering before you commit.</p>
<h2>Built for How Pakistani Homes Actually Use a Sofa Cum Bed</h2>
<p>A sofa come bed in a Pakistani household is rarely bought as a primary bed. It is the answer to Eid visitors who need somewhere to sleep, a wedding season where three extra rooms'' worth of guests show up for two weeks, or a small apartment where a dedicated guest room is not realistic. That means the fold mechanism gets used in bursts rather than nightly, and it needs to work reliably even after sitting closed for months between uses.</p>
<p>It also means the daytime appearance matters as much as the nighttime function. A sofa come bed in a Lahore drawing room needs to look like a proper sofa, not a fold-out bed wearing a fabric cover. The designs in this collection are built to read as furniture first, with the bed function available when needed rather than visually announced.</p>
<h2>Sofa Come Bed Price in Pakistan and How Ordering Works</h2>
<p>We do not list fixed prices upfront because every sofa come bed in this collection is made to order, and the price depends on the fabric grade and any customisation you choose. What we can tell you is how the process works. You select a design and fabric colour, confirm everything over WhatsApp, and pay 60 percent in advance to begin production. The remaining 40 percent is due before dispatch. Most sofa come bed orders are completed and delivered within 25 to 30 working days from our Lahore workshop, slightly longer than our standard sofas because of the additional mechanism and foam work involved.</p>
<p>We deliver across Pakistan, not only within Lahore. If you are based in Karachi, Islamabad, Rawalpindi, or anywhere else, the same made-to-order process and delivery timeline applies, with shipping arranged once your piece is complete.</p>
<h2>Choosing the Right Size</h2>
<p>Sofa come bed sizing is where most buyers get it wrong, ordering based on the folded sofa dimensions without checking what the bed opens out to. A single sofa come bed typically opens to a single bed width, comfortable for one person but tight for two. Our 2-seater and 3-seater options open to wider sleeping surfaces, better suited to a couple or for someone who wants more room to move at night. If you are unsure which size fits your room or your guest needs, message us on WhatsApp with your room dimensions before ordering and we will recommend a size that fits without overwhelming the space when folded back into sofa mode.</p>'
WHERE slug = '/sofas/sofa-come-bed/'
   OR name ILIKE '%come bed%'
   OR name ILIKE '%cum bed%';

SELECT name, slug, length(content_html) AS content_chars
FROM categories
WHERE slug = '/sofas/sofa-come-bed/'
   OR name ILIKE '%come bed%'
   OR name ILIKE '%cum bed%';
