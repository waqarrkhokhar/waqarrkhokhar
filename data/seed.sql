-- ComfyClub DATA seed. Paste into Supabase SQL Editor and Run (after the setup file).
-- Safe to re-run.

INSERT INTO parent_categories (name, slug, sort_order, status) VALUES
  ('Sofas','/sofas/',0,'published'),
  ('Seater Sofas','/seater-sofas/',1,'published'),
  ('Furniture','/furniture/',2,'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (parent_id, name, slug, sort_order, status) VALUES
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'Sofa Chair','/sofas/sofa-chair/',0,'published'),
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'Sofa Cum Bed','/sofas/sofa-come-bed/',1,'published'),
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'L Shape Sofas','/sofas/l-shape-sofas/',2,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'Deewan Sofas','/sofas/deewan-sofas/',3,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'Settee Sofas','/sofas/settee-sofas/',4,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/sofas/'),'Ottoman Sofas','/sofas/ottoman-sofas/',5,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/seater-sofas/'),'2 Seater Sofas','/seater-sofas/2-seater-sofas/',0,'published'),
  ((SELECT id FROM parent_categories WHERE slug='/seater-sofas/'),'3 Seater Sofas','/seater-sofas/3-seater-sofas/',1,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/seater-sofas/'),'4 Seater Sofas','/seater-sofas/4-seater-sofas/',2,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/seater-sofas/'),'5 Seater Sofas','/seater-sofas/5-seater-sofas/',3,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/seater-sofas/'),'6 Seater Sofas','/seater-sofas/6-seater-sofas/',4,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/furniture/'),'Wooden Beds','/furniture/wooden-beds/',0,'draft'),
  ((SELECT id FROM parent_categories WHERE slug='/furniture/'),'Poshish Bed Sets','/furniture/poshish-bed-sets/',1,'draft')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, sale_price, short_description, long_description, category_id, status, is_featured, published_at) VALUES
  ('Button Tufted Wingback Accent Chair', 'button-tufted-wingback-accent-chair', 'CC-SC-001', 25999, 21999, '<span data-sheets-root="1">A classic button tufted wingback single sofa chair upholstered in rich premium velvet, handcrafted to order at our Lahore workshop. Perfect for your drawing room, lounge, or bedroom corner, it delivers timeless style and deep cushion comfort. Choose your fabric and colour and we will craft and deliver it to your door.</span>', '<h2>Button Tufted Wingback Accent Chair - Timeless Elegance for Pakistani Homes</h2>
\nThe ComfyClub Button Tufted Wingback Accent Chair is designed for those who want both style and substance in their drawing room or lounge. Handcrafted to order at our Lahore workshop, every chair is built with a solid hardwood frame, high density foam cushioning, and your choice of premium velvet upholstery. This is not mass produced furniture. This is your chair, made your way.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Classic button tufted backrest and seat for timeless elegance</li>
\n 	<li>High wingback silhouette with deep side panels for warmth and support</li>
\n 	<li>Premium velvet upholstery, soft and durable</li>
\n 	<li>Solid hardwood internal frame built to last for years</li>
\n 	<li>High density foam cushioning with spring base for lasting comfort</li>
\n 	<li>Available in multiple velvet colours: Emerald, Navy, Dusty Pink, Ivory, Charcoal and more</li>
\n 	<li>Non-slip wooden legs in natural or walnut finish</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, guest bedrooms, reading corners, and formal lounges. This single sofa chair works beautifully on its own as a statement piece or paired with a matching ottoman or side table.
\n<h3>Why Pakistani Customers Love This Chair</h3>
\nVelvet is the preferred fabric in Pakistani homes for good reason. It looks rich, feels luxurious, and photographs beautifully. Our velvet holds its colour through daily use and is easy to spot clean. The wingback design also provides an enclosed, private seating experience that suits traditional drawing room arrangements.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 82 cm | Depth: 86 cm | Height: 106 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your preferred velvet colour and wood finish. Step 2: Place your order and confirm payment with our team via WhatsApp. Step 3: Your chair is crafted at our Lahore workshop and delivered to your door in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>
\n
\n"', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Mid Century Wingback Upholstered Accent Chair', 'mid-century-wingback-upholstered-accent-chair', 'CC-SC-002', 25000, 21000, '<span data-sheets-root="1">A refined mid century wingback accent chair with a solid wood frame and premium upholstery, made to order at our Lahore workshop. The high wingback silhouette adds personality and warmth to any drawing room, guest room, or office corner. Pre-order now and choose your fabric and colour.</span>', '<h2>Mid Century Wingback Upholstered Accent Chair - Refined Style for Modern Pakistani Interiors</h2>
\nThe ComfyClub Mid Century Wingback Upholstered Accent Chair brings the best of 1950s design sensibility to your home. Clean lines, a high wingback silhouette, and solid wood tapered legs create a chair that is both visually striking and deeply comfortable. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>High back wingback silhouette with defined side wings</li>
\n 	<li>Solid wood tapered legs in natural oak or dark walnut finish</li>
\n 	<li>Premium upholstery options: linen, velvet, boucle, or corduroy</li>
\n 	<li>High density foam seat and back cushioning</li>
\n 	<li>Subtle mid century detailing on arms and backrest</li>
\n 	<li>Available in a wide range of colours on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLounges, guest bedrooms, reading nooks, and home offices in Pakistan. Its compact footprint makes it ideal for apartment living while its elegance suits formal drawing rooms equally well.
\n<h3>Why This Chair Works in Pakistani Homes</h3>
\nThe mid century modern style has become increasingly popular in Pakistani interior design over the last few years. This chair fits seamlessly into modern apartments in Lahore, Karachi, and Islamabad while also complementing more traditional decor when upholstered in richer fabrics like velvet or brocade.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 80 cm | Depth: 84 cm | Height: 100 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your preferred fabric and colour. Step 2: Confirm your order and pay your advance via WhatsApp or our website. Step 3: Your chair is crafted and delivered in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>
\n
\n&nbsp;', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Fabric Upholstered Single Sofa Chair for Living Room', 'fabric-upholstered-single-sofa-chair-for-living-room', 'CC-SC-003', 70000, 59999, '<span data-sheets-root="1">A beautifully proportioned mid century modern lounge chair with clean lines, fabric upholstery, and solid wood legs, crafted to order at our Lahore workshop. Perfect for a modern drawing room, study, or reading corner, this single sofa chair brings understated style and real comfort to any space. Select your preferred fabric today.</span>', '<h2>Mid Century Modern Lounge Chair - Clean Lines, Real Comfort</h2>
\nThe ComfyClub Mid Century Modern Lounge Chair is built for people who appreciate understated elegance. Its clean geometric lines, gently reclined back, and solid wood tapered legs capture the spirit of mid century design without feeling dated. Handcrafted at our Lahore workshop and made entirely to your specifications.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Clean mid century silhouette with gently reclined backrest</li>
\n 	<li>Solid wood tapered legs in natural or walnut finish</li>
\n 	<li>Premium fabric upholstery options: linen, chenille, boucle, or microfiber</li>
\n 	<li>High density foam seat and back for long-term comfort</li>
\n 	<li>Compact footprint ideal for apartments and smaller rooms</li>
\n 	<li>Multiple colour options available on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, studies, reading corners, and home offices. This chair sits as comfortably in a modern Lahore apartment as it does in a traditional drawing room across Pakistan.
\n<h3>Why Pakistani Customers Choose This Chair</h3>
\nThis lounge chair is one of our most versatile designs. It works with almost any interior colour palette and suits both Western and traditional Pakistani decor styles. The fabric options allow you to tailor it to your exact taste and space requirements.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 78 cm | Depth: 85 cm | Height: 88 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your fabric type and colour. Step 2: Confirm your order and advance payment with our team. Step 3: We craft and deliver your chair in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Soft Velvet Upholstered Accent Chair', 'soft-velvet-upholstered-accent-chair', 'CC-SC-004', 27000, 22999, '<span data-sheets-root="1">A supremely soft and comfortable velvet upholstered accent chair with deep high density foam cushioning and solid wood legs, made to order at our Lahore workshop. Ideal for your bedroom, drawing room, or guest room, this single sofa chair wraps you in luxury from the moment you sit down. Available in all velvet colours.</span>', '<h2>Soft Velvet Upholstered Accent Chair - Luxury Comfort for Every Room</h2>
\nThe ComfyClub Soft Velvet Upholstered Accent Chair is designed for those who refuse to compromise on comfort. With an extra-thick cushion seat, plush velvet fabric, and solid wood legs, this single sofa chair is as beautiful as it is comfortable. Made to order at our Lahore workshop so every detail is exactly as you want it.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Ultra-soft premium velvet upholstery, smooth and durable</li>
\n 	<li>Extra deep high density foam cushioning for full body support</li>
\n 	<li>Solid wood legs in natural or walnut finish</li>
\n 	<li>Rounded cushioned armrests for added comfort</li>
\n 	<li>Available in: Emerald, Navy, Blush Pink, Mustard, Cream, Ivory, Charcoal and more</li>
\n 	<li>Compact enough for bedrooms, spacious enough for lounges</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, drawing rooms, guest rooms, and reading corners across Pakistan. The velvet upholstery looks especially beautiful in natural Pakistani home lighting and adds an instant sense of luxury to any space.
\n<h3>A Note on Velvet in Pakistani Homes</h3>
\nVelvet is a top choice among Pakistani homeowners for its rich visual appeal and tactile softness. Our velvet is selected specifically for durability in warmer climates, resisting fading and maintaining its sheen through regular use and seasonal temperature changes.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 80 cm | Depth: 82 cm | Height: 84 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour. Step 2: Confirm with our team and pay your advance. Step 3: Receive your custom single sofa chair in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Armless Tufted Velvet Accent Chair', 'armless-tufted-velvet-accent-chair', 'CC-SC-005', 21000, 16999, '<span data-sheets-root="1">A sleek compact armless tufted velvet accent chair that fits perfectly in smaller bedrooms, reading corners, and lounge spaces, handcrafted at our Lahore workshop. The button tufted velvet seat and back deliver elegance without demanding extra space. Chhoti jagah ke liye perfect single sofa chair. Pre-order now.</span>', '<h2>Armless Tufted Velvet Accent Chair - Maximum Style, Minimum Space</h2>
\nNot every room has space for a wide armchair, but every room deserves a beautiful one. The ComfyClub Armless Tufted Velvet Accent Chair solves this perfectly. Its compact armless silhouette fits into tighter spaces while the button tufted velvet upholstery ensures it never looks anything less than premium. Handcrafted to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Armless design for a compact and space-efficient footprint</li>
\n 	<li>Button tufted velvet upholstery on seat and backrest</li>
\n 	<li>High density foam cushioning for comfortable seating</li>
\n 	<li>Solid wood or metal legs options</li>
\n 	<li>Ideal for small bedrooms, studio apartments, and cosy lounge corners</li>
\n 	<li>Available in multiple velvet colours on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nSmall bedrooms, dressing areas, reading nooks, hostel rooms, and studio apartments in Pakistan. This single sofa chair is also a popular choice for home offices where a comfortable accent seat is needed without taking up too much floor space.
\n<h3>Why This Works So Well in Pakistani Homes</h3>
\nPakistani bedrooms and lounges often have limited floor space, especially in urban apartments in Lahore, Karachi, and Islamabad. This armless design delivers the look and comfort of a full accent chair in a more compact form, making it one of our most popular single sofa chair options.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 65 cm | Depth: 70 cm | Height: 84 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour and leg finish. Step 2: Place your order and confirm with our team. Step 3: Your chair is delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Modern Upholstered Corduroy Wide Armchair', 'modern-upholstered-corduroy-wide-armchair', 'CC-SC-006', 32000, 26999, '<span data-sheets-root="1">A wide and luxuriously comfortable corduroy armchair with a tufted seat, padded armrests, and two matching bolster pillows, crafted to order at our Lahore workshop. The ribbed corduroy texture adds character and warmth to your living room or lounge. Solid wood legs complete the mid century modern look.</span>', '<h2>Modern Corduroy Wide Armchair with Bolster Pillows - Texture, Comfort and Character</h2>
\nThe ComfyClub Corduroy Wide Armchair is a chair that makes a statement without saying a word. Its wide, generous seat, ribbed corduroy upholstery, and two matching bolster pillows create a look that is distinctly mid century modern yet completely at home in a contemporary Pakistani lounge or living room. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Wide comfortable seat designed for full body relaxation</li>
\n 	<li>Ribbed corduroy upholstery, textured and durable</li>
\n 	<li>Button tufted seat cushion for classic mid century detailing</li>
\n 	<li>Two matching bolster pillows included</li>
\n 	<li>Solid wood tapered legs in dark walnut finish</li>
\n 	<li>Padded armrests for all-day sitting comfort</li>
\n 	<li>Available in: Navy, Olive Green, Rust Orange, Charcoal, Sand, Teal</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, lounges, TV rooms, and home libraries across Pakistan. The wide seat is especially loved by customers who want a chair they can truly relax in, not just sit on.
\n<h3>Corduroy in Pakistani Homes</h3>
\nCorduroy is a smart choice for Pakistani homes. The ribbed texture hides everyday wear and minor marks far better than plain fabrics, it is easy to clean, and it adds a tactile richness that elevates the look of any room without being overly formal.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 88 cm | Depth: 86 cm | Height: 84 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your corduroy colour. Step 2: Confirm your order and pay your advance with our team. Step 3: Your chair and bolster pillows are crafted and delivered in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room', 'comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room', 'CC-SC-007', 45000, 34999, 'A beautifully handcrafted mid century spindle accent chair featuring ornate solid wood bobbin turned arms and legs, paired with a plush upholstered seat and back cushion. Made to order at our Lahore workshop, this single sofa chair is a statement piece for your drawing room, study, or lounge. Pakistani craftsmanship at its finest.', '<h2>Mid Century Spindle Accent Chair - Handcrafted Bobbin Wood, Pure Pakistani Craftsmanship</h2>
\nThe ComfyClub Mid Century Spindle Accent Chair is a celebration of handcraft. The signature bobbin turned arms and legs are carved from solid hardwood by skilled artisans at our Lahore workshop, creating a chair that is genuinely unique with every single piece. Paired with a plush upholstered seat and back, this single sofa chair delivers comfort that matches its craftsmanship.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Signature bobbin turned solid wood arms, handcrafted in Lahore</li>
\n 	<li>Solid hardwood legs in natural, walnut, or mahogany finish</li>
\n 	<li>Plush upholstered back cushion and padded seat</li>
\n 	<li>Removable cushion covers for easy cleaning</li>
\n 	<li>Upholstery options: grey linen, beige linen, cream, terracotta, or custom fabric</li>
\n 	<li>Classic aesthetic that suits both traditional and modern Pakistani interiors</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, studies, reading corners, and traditional sitting areas. This single sofa chair is also a popular gifting choice for housewarming and wedding occasions in Pakistan, given its craftsmanship and visual appeal.
\n<h3>True Pakistani Craftsmanship</h3>
\nPakistan has a centuries-old tradition of exceptional woodworking. The spindle turning on this chair connects directly to that heritage. Each set of arms is turned by hand and no two pieces are completely identical. This is furniture with a story.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 80 cm | Depth: 82 cm | Height: 98 cm | Seat Height: 45 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your wood finish and fabric colour. Step 2: Confirm your order with our team. Step 3: Your handcrafted single sofa chair is delivered in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Wide Tufted Armchair with Solid Wood Legs', 'wide-tufted-armchair-with-solid-wood-legs', 'CC-SC-008', 30000, 24999, '<span data-sheets-root="1">A generously wide tufted armchair with solid wood legs and thick premium upholstery, made to order at our Lahore workshop. The deep button tufting adds a classic elegant touch while the wide seat ensures all day comfort for your lounge, bedroom, or drawing room. Choose your fabric and colour today.</span>', '<h2>Wide Tufted Armchair with Solid Wood Legs - Generous Comfort, Lasting Quality</h2>
\nThe ComfyClub Wide Tufted Armchair is built for those who want a chair that actually fits them. The extra wide seat, deep cushioning, and solid wood legs create a single sofa chair that feels as impressive as it looks. Button tufting across the backrest and seat adds a classic touch that never goes out of style. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Extra wide seat for all day sitting comfort</li>
\n 	<li>Deep button tufting on back and seat</li>
\n 	<li>Solid wood legs in natural or walnut finish</li>
\n 	<li>Thick high density foam cushioning</li>
\n 	<li>Premium upholstery options: velvet, linen, boucle, or microfiber</li>
\n 	<li>Padded arms for complete arm support</li>
\n 	<li>Available in multiple colours on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLounges, living rooms, master bedrooms, and drawing rooms. The wide seat is particularly popular with Pakistani families where chairs are used for long sitting sessions during family gatherings and eid celebrations.
\n<h3>Why Width Matters</h3>
\nMany imported chair designs are sized for Western proportions and can feel cramped for extended sitting. The ComfyClub Wide Armchair is designed with Pakistani customer feedback in mind, giving you a chair you can actually relax in for hours at a time.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 92 cm | Depth: 90 cm | Height: 85 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your fabric and colour. Step 2: Confirm your order with our team. Step 3: Delivered to your door in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Mustard Yellow Velvet Accent Chair with Metal Legs', 'mustard-yellow-velvet-accent-chair-with-metal-legs', 'CC-SC-009', 26000, 21999, '<span data-sheets-root="1">A bold and eye-catching mustard yellow velvet accent chair with sleek modern metal legs, handcrafted to order at our Lahore workshop. This statement single sofa chair instantly elevates any drawing room, bedroom, or lounge with its rich colour and plush velvet feel. Available in multiple velvet colours, pre-order now.</span>', '<h2>Mustard Yellow Velvet Accent Chair with Metal Legs - Bold, Beautiful, Unforgettable</h2>
\nIf your room needs a focal point, this is it. The ComfyClub Mustard Yellow Velvet Accent Chair with Metal Legs is designed to be seen. The rich mustard velvet and sleek metal legs create a modern contrast that immediately draws attention and elevates the entire room. Made to order at our Lahore workshop in the colour of your choice.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Rich velvet upholstery in mustard yellow or any custom colour</li>
\n 	<li>Sleek gold-tone or matte black metal legs</li>
\n 	<li>High density foam cushioning for comfortable seating</li>
\n 	<li>Clean modern silhouette with padded back and seat</li>
\n 	<li>Also available in: Emerald, Dusty Rose, Burnt Orange, Forest Green, Cobalt Blue</li>
\n 	<li>Easy to clean velvet surface</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, master bedrooms, photography and studio spaces, and modern lounge setups. This single sofa chair is a favourite for customers who want their furniture to make a design statement in their Pakistani home.
\n<h3>A Statement Chair for Bold Pakistani Interiors</h3>
\nBold colour chairs are becoming increasingly popular in Pakistani homes, especially in Lahore and Karachi where interior design tastes have evolved significantly. Mustard yellow pairs beautifully with off-white walls, dark wood furniture, and neutral rugs that are common in Pakistani living rooms.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 74 cm | Depth: 76 cm | Height: 80 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour and metal leg finish. Step 2: Confirm your order with our team. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Modern Boucle Wingback Armchair with Solid Wood Legs', 'modern-boucle-wingback-armchair-with-solid-wood-legs', 'CC-SC-010', 32000, 25999, 'A modern boucle wingback armchair with a high back design, textured boucle upholstery, and solid natural wood legs, made to order at our Lahore workshop. The boucle fabric is soft, breathable, and well suited to Pakistani climate, while the wingback silhouette adds instant elegance to any drawing room. Pre-order now.', '<h2>Modern Boucle Wingback Armchair with Solid Wood Legs - Textured Luxury for Pakistani Drawing Rooms</h2>
\nThe ComfyClub Modern Boucle Wingback Armchair is one of our most requested designs. The combination of a high back wingback silhouette, textured boucle upholstery, and solid natural wood legs creates a chair that feels luxurious, looks contemporary, and works beautifully in Pakistani homes. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>High back wingback silhouette for a commanding presence</li>
\n 	<li>Premium boucle upholstery, textured and soft to the touch</li>
\n 	<li>Solid natural wood legs in light oak finish</li>
\n 	<li>High density foam cushioning throughout</li>
\n 	<li>Boucle fabric is breathable and suitable for Pakistani climate</li>
\n 	<li>Available in: Cream, Oatmeal, Light Grey, Warm White</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, formal lounges, bedrooms, and open plan living spaces. The neutral boucle tones pair well with almost any wall colour or flooring, making this one of the most versatile single sofa chairs in our collection.
\n<h3>Why Boucle Works So Well in Pakistan</h3>
\nBoucle fabric has become one of the most popular upholstery choices among Pakistani interior designers. It stays cooler than velvet in warm weather, does not trap pet hair, and the textured looped surface adds visual depth without requiring a bold colour. It is elegant without being high-maintenance.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 82 cm | Depth: 84 cm | Height: 100 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm your order with our team and pay your advance. Step 3: Your chair is delivered in 20 to 25 working days.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Curved Upholstered Single Sofa Chair for Living Room', 'curved-upholstered-single-sofa-chair-for-living-room', 'CC-SC-011', 30000, 24999, '<span data-sheets-root="1">A contemporary tub barrel accent chair with a smooth curved backrest and armrests, upholstered in premium fabric and supported by solid wood legs, made to order at our Lahore workshop. The rounded silhouette wraps you in comfort, making it the perfect single sofa chair for your living room, bedroom, or reading corner.</span>', '<h2>Modern Tub Barrel Accent Chair - Curved Comfort for Contemporary Spaces</h2>
\nThe ComfyClub Modern Tub Barrel Accent Chair offers a distinctly modern seating experience. Its curved continuous backrest and arms wrap around you in a cocooning embrace, while the upholstered fabric and solid wood legs ground the piece beautifully. Compact, stylish, and made to order at our Lahore workshop for customers across Pakistan.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Curved tub barrel silhouette with continuous backrest and arms</li>
\n 	<li>Premium upholstery options: boucle, linen, velvet, or microfiber</li>
\n 	<li>Solid wood legs in natural or walnut finish</li>
\n 	<li>High density foam cushioning for comfortable seating</li>
\n 	<li>Compact footprint ideal for bedrooms and apartments</li>
\n 	<li>Multiple colour options available on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, bedrooms, reading corners, and home offices. The tub barrel shape is particularly popular in modern Pakistani apartments where a stylish but space-conscious single sofa chair is needed.
\n<h3>Why the Barrel Shape Works</h3>
\nThe continuous curve of the barrel chair means there are no hard edges, no separate armrests that break the visual flow, and the seating position feels naturally supported. Many customers tell us this becomes their favourite chair in the house within the first week.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 78 cm | Depth: 80 cm | Height: 78 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric type and colour. Step 2: Confirm with our team. Step 3: Your single sofa chair is crafted and delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Dukinfield Upholstered Side Chair', 'dukinfield-upholstered-side-chair', NULL, 19500, 16500, 'The Dukinfield upholstered side chair combines a padded fabric seat with a structured solid frame, offering comfort and versatility for your lounge, dining room, or home office. Made to order at our Lahore workshop in your choice of fabric and colour. A clean and practical addition to any Pakistani home.', '<h2>Dukinfield Upholstered Side Chair - Versatile Comfort for Every Room</h2>
\nThe ComfyClub Dukinfield Upholstered Side Chair is the definition of functional elegance. A structured frame, padded fabric seat and back, and clean proportions make it equally at home at a dining table, in a home office, or as a bedroom accent chair. Made to order at our Lahore workshop for customers across Pakistan.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Structured solid frame for lasting durability</li>
\n 	<li>Padded fabric seat and padded backrest</li>
\n 	<li>Clean simple lines that complement any interior</li>
\n 	<li>Available in a wide range of fabric options and colours</li>
\n 	<li>Solid wood or metal legs available</li>
\n 	<li>Easy to clean and maintain</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDining rooms, home offices, bedroom corners, and lounge accents. One of the most versatile single sofa chairs we offer, the Dukinfield Side Chair is a practical yet elegant choice for Pakistani families who want quality without complexity.
\n<h3>A Chair for Real Pakistani Life</h3>
\nThis chair is built for everyday use. Whether it is at the head of your dining table, beside your study desk, or as an extra seat in the guest room, it holds up beautifully through daily use and regular cleaning. Practical furniture for practical Pakistani homes.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 55 cm | Depth: 60 cm | Height: 88 cm | Seat Height: 46 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric and colour. Step 2: Confirm your order with our team. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('George Oliver Accent Chair with Metal Legs', 'george-oliver-accent-chair-with-metal-legs', 'CC-SC-013', 36000, 32999, 'A modern George Oliver accent chair with sleek metal legs and high quality upholstery, crafted to order at our Lahore workshop. Clean contemporary lines make this single sofa chair the ideal choice for a bedroom, home office, or open plan living space. Order now in your preferred fabric and colour.', '<h2>George Oliver Accent Chair with Metal Legs - Contemporary Design for Modern Pakistani Homes</h2>
\nThe ComfyClub George Oliver Accent Chair brings clean contemporary design to your home. Sleek metal legs, high quality upholstery, and a refined silhouette combine to create a single sofa chair that works beautifully in modern Pakistani apartments and homes. Handcrafted to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li style="list-style-type: none;">
\n<ul>
\n 	<li>Contemporary silhouette with clean modern lines</li>
\n 	<li>Sleek metal legs in gold-tone or matte black finish</li>
\n 	<li>Premium upholstery: velvet, linen, or fabric on request</li>
\n</ul>
\n</li>
\n</ul>
\n<ul>
\n 	<li>High density foam cushioning for comfortable seating</li>
\n 	<li>Padded seat and backrest</li>
\n 	<li>Available in multiple colours and fabric options</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, home offices, modern living rooms, and open plan spaces. The metal leg design gives this single sofa chair a lighter visual footprint, making rooms feel more spacious while still delivering real comfort and quality.
\n<h3>Why Metal Legs Work in Pakistani Interiors</h3>
\nMetal legs have become a popular choice in modern Pakistani homes, especially in urban apartments where the design aesthetic leans contemporary. They are easy to clean, do not warp or scratch like wood, and they give any chair an instant modern upgrade.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 72 cm | Depth: 74 cm | Height: 82 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric colour and leg finish. Step 2: Confirm with our team. Step 3: Your single sofa chair is delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Meribeth Upholstered Accent Chair', 'meribeth-upholstered-accent-chair', 'CC-SC-014', 33000, 27999, '<span data-sheets-root="1">The Meribeth upholstered accent chair is a plush fabric single sofa chair with generous cushioning and a timeless structured silhouette, made to order at our Lahore workshop. A beautiful addition to any drawing room, lounge, or guest bedroom. Choose your fabric and colour and we will deliver to your door.</span>', '<h2>Meribeth Upholstered Accent Chair - Plush Comfort with Timeless Appeal</h2>
\nThe ComfyClub Meribeth Upholstered Accent Chair is built for those who want a chair that looks as good as it feels. Generous cushioning, quality upholstery, and a structured silhouette come together in a single sofa chair that serves equally well as a drawing room focal point or a comfortable bedroom addition. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Generous cushioning throughout seat and back</li>
\n 	<li>Structured solid frame for lasting durability</li>
\n 	<li>Premium upholstery options: velvet, linen, boucle, or fabric</li>
\n 	<li>Solid wood legs in natural or walnut finish</li>
\n 	<li>Timeless proportions that suit traditional and modern interiors</li>
\n 	<li>Available in a wide range of colours on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, lounges, guest bedrooms, and formal sitting areas across Pakistan. The Meribeth is a consistent bestseller for customers decorating guest rooms or formal spaces in Pakistani homes.
\n<h3>A Chair That Impresses</h3>
\nWhen guests visit your home in Pakistan, the drawing room makes the first and strongest impression. The Meribeth Accent Chair is the kind of piece that draws comments. Clients and guests notice it. It says something about the taste and care you put into your home without you having to say a word.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 80 cm | Depth: 84 cm | Height: 86 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric and colour. Step 2: Confirm your order and advance with our team. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Fabric Upholstered Dining Chair with Arms', 'fabric-upholstered-dining-chair-with-arms', 'CC-SC-015', 26000, 19999, 'A smart and versatile fabric upholstered dining chair with arms, featuring a padded seat, padded backrest, and solid wood frame, made to order at our Lahore workshop. Works beautifully as a dining chair, study chair, or accent sofa chair for any room. Practical, comfortable, and custom made for Pakistani homes.', '<h2>Fabric Upholstered Dining Chair with Arms - Practical Comfort for Pakistani Homes</h2>
\nThe ComfyClub Fabric Upholstered Dining Chair with Arms bridges the gap between a functional dining chair and a comfortable accent chair. Padded seat, padded back, padded arms, and a solid wood frame make this one of the most comfortable dining chairs available in Pakistan. Made to order at our Lahore workshop in any fabric and colour you choose.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Padded fabric seat for comfortable extended seating</li>
\n 	<li>Padded backrest with structured support</li>
\n 	<li>Padded arms for complete comfort</li>
\n 	<li>Solid hardwood frame built for daily use</li>
\n 	<li>Available in a wide range of fabric options and colours</li>
\n 	<li>Sold as single sofa chair, also available in sets on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDining rooms, study rooms, home offices, and bedroom corners. This single sofa chair is especially popular among Pakistani families who want a dining chair that is genuinely comfortable for long family meals and gatherings, not just visually appealing.
\n<h3>For Pakistani Families Who Value Comfort at the Table</h3>
\nLong family meals, dawat setups, and extended dinner gatherings are a central part of Pakistani home life. A dining chair that supports you comfortably for two or three hours makes a genuine difference. This chair is built precisely for that purpose.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 60 cm | Depth: 64 cm | Height: 90 cm | Seat Height: 46 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric and colour. Step 2: Confirm your order and quantity with our team. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Solid Wood and Jute Rope Armrests Armchair', 'solid-wood-and-jute-rope-armrests-armchair', 'CC-SC-016', 55000, 44999, 'A unique solid wood armchair with handwoven jute rope armrests and a cushioned upholstered seat, made to order at our Lahore workshop. The natural materials bring an organic earthy warmth to your living room, lounge, or study. One of the most distinctive single sofa chairs in our collection. Order now.', '<h2>Solid Wood and Jute Rope Armrests Armchair - Natural Craft, Organic Warmth</h2>
\nThe ComfyClub Jute Rope Armchair is unlike anything else in our collection. Solid wood arms are finished with handwoven jute rope by our Lahore craftsmen, creating an organic, textured detail that brings the warmth of natural materials into your home. Paired with a comfortably cushioned upholstered seat, this single sofa chair is a statement of craftsmanship and taste.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Solid hardwood frame with handwoven jute rope armrests</li>
\n 	<li>Cushioned upholstered seat in your choice of fabric and colour</li>
\n 	<li>Natural material aesthetic that works beautifully with Pakistani decor</li>
\n 	<li>Unique handwoven detail, no two chairs are completely identical</li>
\n 	<li>Wood frame in natural or light walnut finish</li>
\n 	<li>Compact and versatile for multiple room types</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, lounges, reading corners, and outdoor-inspired interior spaces. This chair is particularly loved by customers who want something that feels handcrafted and genuinely different from the mass-produced furniture found in most Pakistani furniture stores.
\n<h3>Why Natural Materials Work So Well in Pakistani Homes</h3>
\nJute, rattan, cane, and wood are materials deeply connected to South Asian craft traditions. This armchair draws on that heritage while delivering contemporary design sensibility. It pairs beautifully with earthy tones, terracotta colours, and the white or off-white walls common in Pakistani homes.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 74 cm | Depth: 78 cm | Height: 84 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your seat cushion fabric and colour. Step 2: Confirm your order with our team. Step 3: Your handcrafted single sofa chair is delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Modern Single Sofa Chair for Bedroom and Office', 'modern-single-sofa-chair-for-bedroom-and-office', 'CC-SC-017', 26000, 21499, 'The Holiway accent chair features soft flannel upholstery and sleek metal legs, combining modern minimalist design with everyday comfort. Made to order at our Lahore workshop, this single sofa chair is ideal for bedrooms, home offices, or compact living spaces. Choose your flannel colour and pre-order today.', '<h2>Holiway Accent Chair Flannel Upholstered with Metal Legs - Minimalist Style for Modern Spaces</h2>
\nThe ComfyClub Holiway Accent Chair is designed for the modern Pakistani home. Soft flannel upholstery, clean lines, and sleek metal legs create a single sofa chair that is quietly stylish and genuinely comfortable. It does not demand attention but always earns it. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Soft flannel upholstery, warm and smooth to the touch</li>
\n 	<li>Sleek metal legs in gold-tone or matte black finish</li>
\n 	<li>Clean minimalist silhouette with no unnecessary detailing</li>
\n 	<li>High density foam cushioning for comfort</li>
\n 	<li>Compact design suitable for smaller rooms</li>
\n 	<li>Available in multiple flannel colours on request</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, home offices, apartment lounges, and compact living spaces across Pakistan. The clean modern lines of the Holiway make it a favourite among younger homeowners and professionals who want furniture that reflects a contemporary aesthetic.
\n<h3>A Chair for the Modern Pakistani Professional</h3>
\nWith more Pakistani professionals working from home than ever before, having a comfortable and stylish accent chair for your home office or bedroom workspace has become important. The Holiway delivers that without taking up too much space or looking out of place in a bedroom setting.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 70 cm | Depth: 72 cm | Height: 80 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your flannel colour and leg finish. Step 2: Confirm with our team. Step 3: Your single sofa chair is delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Bohemian Boucle Accent Chair', 'bohemian-boucle-accent-chair', 'CC-SC-018', 30000, 25000, 'A beautiful bohemian boucle accent chair with plush textured upholstery and a solid wood frame, handcrafted to order at our Lahore workshop. Perfect for a bedroom reading nook, lounge corner, or home decor focused space. Boucle stays cool in summer and cosy in winter, ideal for Pakistani homes. Pre-order now.', '<h2>Bohemian Boucle Accent Chair - Soft, Textured, and Beautifully Comfortable</h2>
\nThe ComfyClub Bohemian Boucle Accent Chair is designed for the person who wants their home to feel as good as it looks. The plush looped boucle fabric is irresistibly soft, the solid wood frame is beautifully crafted, and the overall silhouette brings a warm bohemian sensibility to any space. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Plush boucle upholstery with soft looped texture</li>
\n 	<li>Solid wood frame in natural finish</li>
\n 	<li>High density foam cushioning for deep comfortable seating</li>
\n 	<li>Relaxed rounded silhouette with gently curved back</li>
\n 	<li>Available in: Cream, Oatmeal, Warm White, Dusty Rose, Taupe</li>
\n 	<li>Pairs well with rattan, wicker, and natural element decor</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, reading nooks, bohemian and eclectic interiors, and cosy lounge corners across Pakistan. The boucle fabric photograph exceptionally well and is a popular choice for social media-worthy home setups among Pakistani homeowners.
\n<h3>Boucle in Pakistani Homes</h3>
\nBoucle has gained enormous popularity in Pakistani interior design due to its softness, versatility, and neutral colour palette. It works in every season, stays cooler than velvet in Pakistani summers, and adds a textured warmth that plain fabrics cannot match. It also stays cleaner for longer in dusty environments.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 76 cm | Depth: 78 cm | Height: 82 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm your order and pay your advance. Step 3: Your single sofa chair is crafted and delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Plush Lambswool-Style Side Chair with Metal Legs', 'plush-lambswool-style-side-chair-with-metal-legs', 'CC-SC-019', 21500, 18499, 'A luxuriously plush lambswool-style side chair with sleek metal legs, wrapped in an ultra soft fluffy upholstery you will want to sink into. Made to order at our Lahore workshop, this single sofa chair brings a cosy and elegant touch to any bedroom, lounge, or living room. Pre-order now in cream or white.', '<h2>Plush Lambswool-Style Side Chair with Metal Legs - Unbelievably Soft, Beautifully Simple</h2>
\nThe ComfyClub Plush Lambswool-Style Side Chair is the softest chair we make. Its fluffy lambswool-style upholstery is so soft you want to touch it every time you walk past. Paired with sleek modern metal legs, this single sofa chair delivers the perfect balance of cosy luxury and contemporary design. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Ultra soft lambswool-style fluffy upholstery</li>
\n 	<li>Sleek metal legs in gold-tone or matte black finish</li>
\n 	<li>High density foam cushioning beneath the plush outer layer</li>
\n 	<li>Clean minimalist silhouette that showcases the fabric</li>
\n 	<li>Available in: Cream, Ivory, Off-White, Warm White</li>
\n 	<li>Easy to style with any neutral or bold colour palette</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, dressing rooms, lounge corners, and photography styled spaces. The lambswool-style texture photographs beautifully and is a top choice among Pakistani homeowners who curate their interior spaces for aesthetics alongside comfort.
\n<h3>The Cosy Factor in Pakistani Winters</h3>
\nPakistani winters in Lahore, Islamabad, and across the north can be genuinely cold. The lambswool-style upholstery on this chair adds a layer of warmth and cosiness that is particularly appreciated in the colder months from November through February. It feels like a warm hug every time you sit down.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 68 cm | Depth: 70 cm | Height: 82 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your colour and leg finish. Step 2: Confirm your order with our team. Step 3: Your single sofa chair is delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Willow Single Seat Lounge Chair', 'willow-single-seat-lounge-chair', 'CC-SC-020', 31500, 25499, 'The Willow single seat lounge chair is a cushioned fabric single sofa chair with a gently reclined back and solid wood frame, crafted to order at our Lahore workshop. Perfect for reading, relaxing, or adding a cosy corner to your living room or study. Choose your fabric and colour and we will deliver across Pakistan.', '<h2>Willow Single Seat Lounge Chair - Quiet Comfort for Everyday Moments</h2>
\nThe ComfyClub Willow Single Seat Lounge Chair is built for the simple pleasure of sitting comfortably in your own home. Cushioned fabric, a gently reclined back, and a solid wood frame come together in a single sofa chair that is easy to love and easy to live with. Handcrafted to order at our Lahore workshop for customers across Pakistan.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Gently reclined backrest for natural comfortable posture</li>
\n 	<li>Cushioned fabric seat and back</li>
\n 	<li>Solid wood frame in natural or walnut finish</li>
\n 	<li>High density foam for long lasting cushioning</li>
\n 	<li>Relaxed versatile silhouette that suits most interior styles</li>
\n 	<li>Available in a wide range of fabric options and colours</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, studies, reading corners, and bedroom lounges. The Willow is the chair for quiet moments, for reading a book, catching up on the news, or simply sitting with a cup of chai. A single sofa chair for real everyday life in Pakistan.
\n<h3>Why Comfortable Everyday Chairs Matter</h3>
\nPakistani homes often have very formal sofa sets in the drawing room that are not used every day. The Willow Lounge Chair is the chair you actually sit in every day, the one in the study, beside the window, or in the corner of the bedroom. Comfortable enough for hours, attractive enough to be proud of.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 80 cm | Depth: 86 cm | Height: 84 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric type and colour. Step 2: Confirm your order with our team. Step 3: Your Willow Lounge Chair is delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/sofas/sofa-chair/'), 'published', false, now()),
  ('Boucle Tufted Upholstered Loveseat', 'boucle-tufted-upholstered-loveseat', 'CC-2S-001', 50000, 42999, 'A plush boucle tufted 2 seater sofa with a button tufted backrest, rounded arms, and solid walnut wood legs. Made to order at our Lahore workshop in your choice of boucle colour. Sits comfortably in your drawing room, lounge, or bedroom corner.', '<h2>Boucle Tufted Upholstered Loveseat - Comfortable 2 Seater Sofa for Pakistani Homes</h2>
\nThe ComfyClub Boucle Tufted Loveseat is a 2 seater sofa built for genuine everyday comfort. The button tufted backrest gives it a classic touch, the rounded arms make it a natural fit for any room, and the plush boucle upholstery stays cool in Pakistani summers while adding warmth in winter. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Button tufted backrest in premium boucle fabric</li>
\n 	<li>Rounded padded arms for all-day sitting comfort</li>
\n 	<li>Solid walnut wood legs with natural finish</li>
\n 	<li>High density foam seat and back cushioning</li>
\n 	<li>Available in: Caramel, Cream, Oatmeal, Dusty Rose, Light Gray</li>
\n 	<li>Compact footprint suited to living rooms and bedrooms</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, drawing rooms, bedrooms, and reading corners across Pakistan. The boucle texture holds up well in dusty urban environments and is one of the most practical fabric choices for Pakistani homes.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 150 cm | Depth: 82 cm | Height: 82 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Your 2 seater sofa is crafted and delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Mid Century Modern Scalloped Back Loveseat', 'mid-century-modern-scalloped-back-loveseat', 'CC-2S-002', 55000, 41999, 'A mid century modern scalloped loveseat with a striking petal-shaped backrest, soft fabric upholstery, and sleek gold metal legs. One of our most visually distinctive 2 seater sofa designs, made to order at our Lahore workshop in your choice of colour.', '<h2>Mid Century Modern Scalloped Back Loveseat - Stylish 2 Seater Sofa</h2>
\nThe ComfyClub Mid Century Scalloped Loveseat is a statement 2 seater sofa. The distinctive petal-shaped scalloped backrest gives this sofa a personality that plain designs simply do not have. Combined with gold metal legs and premium fabric upholstery, it sits beautifully in formal drawing rooms and modern living spaces across Pakistan.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Distinctive scalloped petal backrest with vertical channel stitching</li>
\n 	<li>Sleek gold-tone metal legs for a glamorous finish</li>
\n 	<li>Premium chenille or velvet upholstery options</li>
\n 	<li>Plush single seat cushion with high density foam</li>
\n 	<li>Available in: Sage Green, Navy, Dusty Pink, Mustard, Ivory, Custom</li>
\n 	<li>Bold aesthetic suited to formal drawing rooms and modern lounges</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, formal lounges, and modern bedroom sitting areas in Pakistani homes. This 2 seater sofa design is a consistent choice for customers who want furniture that looks as good as it sits.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 148 cm | Depth: 78 cm | Height: 86 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your colour and fabric. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Billijo Scalloped Back Velvet Loveseat', 'billijo-scalloped-back-velvet-loveseat', 'CC-2S-003', 48000, 41999, 'The Billijo scalloped loveseat features a petal-shaped backrest in soft velvet upholstery and natural solid wood legs. A modern 2 seater sofa that brings colour and character to bedrooms, lounges, and drawing rooms. Made to order at our Lahore workshop.', '<h2>Billijo Scalloped Velvet Loveseat - Modern 2 Seater Sofa with Natural Wood Legs</h2>
\nThe ComfyClub Billijo Loveseat offers the same bold scalloped silhouette with the warmth of natural solid wood legs instead of metal. The result is a modern 2 seater sofa that is both striking and approachable, at home in a bedroom corner, a lounge, or a compact drawing room. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Scalloped petal backrest with clean vertical channel stitching</li>
\n 	<li>Natural solid wood tapered legs in light oak finish</li>
\n 	<li>Soft velvet upholstery with strong colour retention</li>
\n 	<li>Plush single seat cushion with high density foam</li>
\n 	<li>Available in: Teal, Navy, Blush, Sage, Mustard, Ivory, Custom</li>
\n 	<li>Compact design suitable for bedrooms and smaller lounges</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, compact lounges, and reading corners across Pakistani homes. The natural wood legs soften the overall look and make this 2 seater sofa more versatile across different interior styles compared to metal-leg options.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 145 cm | Depth: 78 cm | Height: 84 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour. Step 2: Confirm via WhatsApp and pay your advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>
\n
\n"', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Wide Boucle Loveseat Sofa', 'wide-boucle-loveseat-sofa', 'CC-2S-004', 62000, 44999, 'A wide organic-form boucle 2 seater sofa with a fully curved silhouette, plush boucle upholstery, and included bolster cushions. No visible legs, sits on a clean solid base. A contemporary double seater sofa that suits modern drawing rooms and open plan living spaces.', '<h2>Wide Boucle Organic Curved Loveseat - Contemporary Double Seater Sofa</h2>
\nThe ComfyClub Wide Boucle Loveseat is designed for those who want something genuinely different. The organic curved silhouette, wide seat, and plush boucle upholstery create a 2 seater sofa that looks as considered as it feels comfortable. The bolster cushions and solid platform base complete the contemporary look. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Wide organic curved silhouette with continuous flowing form</li>
\n 	<li>Premium boucle upholstery throughout seat, back, and arms</li>
\n 	<li>Two matching bolster cushions and one back cushion included</li>
\n 	<li>Clean solid platform base with no visible legs</li>
\n 	<li>Extra wide seat for generous two-person comfort</li>
\n 	<li>Available in: Brown, Taupe, Oatmeal, Warm White, Sage, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nModern drawing rooms, open plan living spaces, and formal lounges in Pakistani homes. The wide seat makes this double seater sofa a popular choice for families who use the drawing room for extended sitting and entertaining.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 170 cm | Depth: 86 cm | Height: 78 cm | Seat Height: 40 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm order via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Mid Century 2 Seater Sofa with Separate Cushions', 'mid-century-2-seater-sofa-with-separate-cushions', 'CC-2S-005', 60000, 51999, 'A mid century modern 2 seater sofa in ribbed corduroy with two separate back cushions, padded track arms, and dark wood tapered legs. The corduroy fabric handles daily use well and suits lounges, drawing rooms, and TV rooms across Pakistani homes.', '<h2>Corduroy Upholstered Loveseat - Mid Century 2 Seater Sofa for Pakistani Living Rooms</h2>
\nThe ComfyClub Corduroy Loveseat is a 2 seater sofa built for daily use. Ribbed corduroy is one of the most durable upholstery fabrics available, it hides everyday marks far better than plain fabrics, stays cooler than velvet in Pakistani summers, and holds its texture over years of regular family use. Made entirely to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Ribbed corduroy upholstery throughout seat, back, and arms</li>
\n 	<li>Two separate back cushions for individual support</li>
\n 	<li>Track padded arms for a clean mid century silhouette</li>
\n 	<li>Dark walnut solid wood tapered legs</li>
\n 	<li>High density foam seat cushions with sinuous spring base</li>
\n 	<li>Available in: Gray, Navy, Olive, Rust, Charcoal, Sand, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, TV lounges, and drawing rooms. The ribbed corduroy makes this one of the best choices for Pakistani homes where the sofa is used daily by the full family. It is practical, durable, and genuinely good looking.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 165 cm | Depth: 88 cm | Height: 86 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your corduroy colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Your 2 seater sofa is delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('ComfyClub Square Arm Loveseat', 'comfyclub-square-arm-loveseat', 'CC-2S-006', 65000, 54999, 'A mid century linen 2 seater sofa with a button tufted backrest, clean track arms, and a solid wood base with tapered legs. Breathable linen fabric and a wood-heavy construction make this one of the best wooden 2 seater sofa options for Pakistani homes.', '<h2>Linen Square Arm Loveseat - Wooden 2 Seater Sofa with Tufted Back</h2>
\nThe ComfyClub Linen Square Arm Loveseat is a wooden 2 seater sofa with genuine mid century credentials. The exposed solid wood base, tapered legs, and clean track arms give it a structured, furniture-forward look that suits both contemporary apartments and traditional drawing rooms across Pakistan. Linen upholstery is practical, breathable, and holds its colour well year-round.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Button tufted linen backrest with clean horizontal stitching</li>
\n 	<li>Square track arms for a structured mid century silhouette</li>
\n 	<li>Exposed solid wood base with tapered natural wood legs</li>
\n 	<li>High density foam seat cushioning</li>
\n 	<li>Breathable linen fabric ideal for Pakistani climate</li>
\n 	<li>Available in: Sage Green, Natural Linen, Stone Gray, Off-White, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, studies, and formal lounges in Pakistani homes. The wood base and linen fabric combination is a popular choice among Pakistani interior designers for spaces where the furniture should feel deliberate and well-considered.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 168 cm | Depth: 90 cm | Height: 84 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your linen colour and wood finish. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs', 'luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs', 'CC-2S-007', 55000, 47999, 'The Demetrius loveseat features a distinctive horizontal channel tufted backrest in premium velvet, rounded pillow arms, and sleek gold metal legs. A luxury 2 seater sofa designed for drawing rooms and formal lounges where the sofa is expected to be both beautiful and well-made.', '<h2>Demetrius Channel Tufted Velvet Loveseat - Luxury 2 Seater Sofa</h2>
\nThe ComfyClub Demetrius Loveseat is one of our most distinctive 2 seater sofa designs. The horizontal channel tufted backrest runs full-width across the sofa creating a bold ribbed texture in premium velvet. Combined with rounded pillow arms and gold metal legs, this is a luxury 2 seater sofa designed to hold its own in any formal drawing room or living space across Pakistan.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Full-width horizontal channel tufting on backrest in premium velvet</li>
\n 	<li>Rounded pillow arms for deep comfort</li>
\n 	<li>Sleek gold-tone metal legs with a polished finish</li>
\n 	<li>High density foam seat and back cushioning</li>
\n 	<li>Available in: Gray, Navy, Dusty Rose, Ivory, Forest Green, Charcoal, Custom</li>
\n 	<li>Bold statement piece for drawing rooms and formal lounges</li>
\n</ul>
\n<h3>Perfect For</h3>
\nFormal drawing rooms, guest sitting areas, and premium lounge setups in Pakistani homes. The velvet and gold combination is a consistently popular choice among Pakistani homeowners who want furniture that photographs well and impresses guests.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 155 cm | Depth: 86 cm | Height: 82 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your velvet colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Your luxury 2 seater sofa is delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge', 'minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge', 'CC-2S-008', 60000, 49999, '<span data-sheets-root="1">The Flovilla is a minimalist 2 seater sofa with a smooth curved organic shell backrest and deep seat in premium velvet. No arms, no visible structure, just clean flowing curves and gold metal legs. An ideal bedroom or lounge 2 seater sofa for contemporary Pakistani interiors.</span>', '<h2>Flovilla Curved Organic Loveseat - Minimalist 2 Seater Sofa</h2>
\nThe ComfyClub Flovilla Loveseat is for those who want furniture that looks like it was designed rather than just chosen. The smooth continuous curved backrest flows into the seat with no interruption from arms or visible structure. Premium velvet upholstery and gold metal legs complete this minimalist 2 seater sofa that suits bedrooms, compact lounges, and modern drawing rooms.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Smooth organic curved shell backrest with no visible frame</li>
\n 	<li>Armless design for a clean minimalist silhouette</li>
\n 	<li>Premium velvet upholstery inside and out</li>
\n 	<li>Gold-tone metal legs with polished finish</li>
\n 	<li>Deep seat cushion with high density foam</li>
\n 	<li>Available in: Ivory, Cream, Blush, Sage, Charcoal, Cobalt, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, compact lounges, home offices, and modern drawing rooms in Pakistani homes. The armless design gives it a smaller visual footprint making it one of the better space saving 2 seater sofa options in our collection.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 142 cm | Depth: 78 cm | Height: 76 cm | Seat Height: 40 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Velvet Button Tufted Loveseat with Nailhead Trim', 'velvet-button-tufted-loveseat-with-nailhead-trim', 'CC-2S-009', 48000, 41999, 'A luxury 2 seater sofa with deep all-over button tufting, a curved barrel back, nailhead trim detailing, and silver bun feet. This velvet loveseat is a formal statement piece for Pakistani drawing rooms and sitting areas where traditional elegance is expected.', '<h2>Velvet Button Tufted Loveseat with Nailhead Trim - Luxury 2 Seater Sofa</h2>
\nThe ComfyClub Velvet Tufted Loveseat is the most formal 2 seater sofa in our collection. Deep button tufting covers the entire backrest and seat, nailhead trim runs along the frame outline, and silver bun feet complete the traditional luxury look. This is a drawing room sofa designed to hold its status for years, built at our Lahore workshop with a solid hardwood frame and premium velvet.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Full deep button tufting across backrest and seat</li>
\n 	<li>Nailhead trim detailing along the frame for formal elegance</li>
\n 	<li>Curved barrel backrest with recessed arms</li>
\n 	<li>Silver-finish solid bun feet</li>
\n 	<li>Premium velvet upholstery throughout</li>
\n 	<li>Available in: Gray, Navy, Burgundy, Ivory, Forest Green, Dusty Rose, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nFormal drawing rooms, guest sitting areas, and traditional home settings across Pakistan. This luxury 2 seater sofa is a top choice for Pakistani homes that maintain a formal standard in their main sitting room and want furniture that reflects that standard.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 158 cm | Depth: 90 cm | Height: 88 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Modern Boucle Curved Loveseat', 'modern-boucle-curved-loveseat', 'CC-2S-010', 47000, 41999, '<span data-sheets-root="1">A modern low-profile 2 seater sofa with a curved back, fully recessed arms, plush velvet or boucle upholstery, and solid wood block feet. The compact design and low seat height make this a practical space saving 2 seater sofa for bedrooms and compact lounge areas.</span>', '<h2>Modern Boucle Curved Loveseat - Space Saving 2 Seater Sofa</h2>
\nThe ComfyClub Modern Boucle Curved Loveseat keeps things deliberate and minimal. The low profile silhouette, fully recessed arms, and clean curved back create a 2 seater sofa that sits well in spaces where a larger or taller sofa would feel too heavy. Solid wood block feet and plush velvet or boucle upholstery finish the look. Built to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Low profile curved silhouette with recessed arms</li>
\n 	<li>Fully upholstered exterior and interior in velvet or boucle</li>
\n 	<li>Solid wood block feet in natural or walnut finish</li>
\n 	<li>High density foam throughout for deep cushioned seating</li>
\n 	<li>Compact design suited to bedrooms and smaller lounges</li>
\n 	<li>Available in: Cognac Brown, Ivory, Sage, Charcoal, Warm White, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, compact lounges, studio apartments, and smaller drawing rooms across Pakistani cities. The low profile makes it one of our best space saving 2 seater sofa options for urban apartments in Lahore, Karachi, and Islamabad.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 152 cm | Depth: 84 cm | Height: 72 cm | Seat Height: 38 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric and colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Hendrix Velvet Scalloped Loveseat', 'hendrix-velvet-scalloped-loveseat', 'CC-2S-011', 45000, 37999, 'The Hendrix velvet loveseat features a bold scalloped petal backrest, wide flared arms, and gold metal legs in rich premium velvet. A stylish 2 seater sofa that suits drawing rooms, formal lounges, and bedroom sitting areas. Made to order at our Lahore workshop in your colour.', '<h2>Hendrix Velvet Scalloped Loveseat - Stylish 2 Seater Sofa with Flared Arms</h2>
\nThe ComfyClub Hendrix Loveseat combines two bold design choices: the scalloped petal backrest and wide flared arms. The result is a stylish 2 seater sofa that is distinctive from every angle. Premium velvet upholstery and gold metal legs complete the look. Made entirely to order at our Lahore workshop so the colour is exactly what you choose.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Scalloped petal backrest with vertical channel stitching</li>
\n 	<li>Wide flared arms for a dramatic glamorous silhouette</li>
\n 	<li>Premium velvet upholstery in rich saturated colour</li>
\n 	<li>Gold-tone metal legs with polished finish</li>
\n 	<li>Single plush seat cushion with high density foam</li>
\n 	<li>Available in: Terracotta, Blush, Sage Green, Navy, Ivory, Mustard, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nFormal drawing rooms, guest sitting areas, and bedroom lounge corners in Pakistani homes. This stylish 2 seater sofa is a strong choice for customers who want a sofa that looks as intentional as the rest of their decor.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 148 cm | Depth: 80 cm | Height: 86 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your velvet colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Jopath Mini Channel Tufted Boucle Loveseat', 'jopath-mini-channel-tufted-boucle-loveseat', 'CC-2S-012', 62000, 54999, 'The Jopath mini loveseat is a compact small 2 seater sofa with vertical channel tufting, premium boucle upholstery, and sleek black metal legs. Built for bedrooms, studio apartments, dorm rooms, and small spaces where a standard sofa would not fit.', '<h2>Jopath Mini Channel Tufted Boucle Loveseat - Small 2 Seater Sofa</h2>
\nThe ComfyClub Jopath Mini Loveseat solves a real problem in Pakistani homes: finding a good quality small 2 seater sofa that fits in a bedroom, study, or compact lounge without dominating the room. The channel tufted boucle backrest and black metal legs give it a clean contemporary look while the compact width means it works in spaces where a standard sofa would not.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Compact small footprint designed for tight spaces</li>
\n 	<li>Vertical channel tufting on the back and arms</li>
\n 	<li>Premium boucle upholstery in soft looped texture</li>
\n 	<li>Sleek black metal legs for a modern minimal finish</li>
\n 	<li>High density foam seat cushion</li>
\n 	<li>Available in: Ivory, Cream, Light Gray, Blush, Oatmeal, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, studios, home offices, dorm rooms, and compact lounges across Pakistan. One of the few genuinely small 2 seater sofa options in our collection that does not compromise on quality or comfort despite its smaller scale.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 120 cm | Depth: 72 cm | Height: 78 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Your small 2 seater sofa is delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Modern Curved Arm Boucle Loveseat', 'modern-curved-arm-boucle-loveseat', 'CC-2S-013', 46000, 39999, '<span data-sheets-root="1">A wide contemporary 2 seater sofa with gently curved arms, soft boucle upholstery, and natural solid wood tapered legs. Clean Scandinavian proportions and a generous seat width make this one of our most practical and visually balanced 2 seater sofa designs.</span>', '<h2>Modern Curved Arm Boucle Loveseat - Contemporary 2 Seater Sofa</h2>
\nThe ComfyClub Curved Arm Boucle Loveseat gets the proportions exactly right. Wide enough for genuine two-person comfort, structured enough to hold its shape over years, and upholstered in boucle that stays practical through Pakistani summers and winters alike. The gently curved arms give it a softness that balances the clean Scandinavian lines. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Gently curved arm design for a soft contemporary silhouette</li>
\n 	<li>Wide generous seat for comfortable two-person seating</li>
\n 	<li>Premium boucle upholstery throughout</li>
\n 	<li>Natural solid wood tapered legs in light oak finish</li>
\n 	<li>High density foam seat and back cushioning</li>
\n 	<li>Available in: Cream, Oatmeal, Warm White, Light Gray, Taupe, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, drawing rooms, and open plan spaces across Pakistan. The neutral boucle tones make this 2 seater sofa one of the most versatile options in our collection and a consistent choice among Pakistani interior designers.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 162 cm | Depth: 88 cm | Height: 82 cm | Seat Height: 43 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your boucle colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from our Lahore workshop.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Mid Century Corduroy Barrel Back Loveseat', 'mid-century-corduroy-barrel-back-loveseat', 'CC-2S-014', 65000, 54999, 'A mid century modern double seater sofa with a barrel back shape, vertical channel tufted stitching, corduroy upholstery, and solid walnut tapered legs. A strong 2 seater sofa design that works in living rooms, drawing rooms, and study areas across Pakistani homes.', '<h2>Mid Century Corduroy Barrel Back Loveseat - Double Seater Sofa</h2>
\nThe ComfyClub Mid Century Corduroy Barrel Back Loveseat brings two of the best design choices together: the enclosed barrel back for full back support and the ribbed corduroy fabric for texture and durability. Solid walnut tapered legs and vertical channel stitching across the curved back give it a strong mid century identity that suits both traditional and contemporary Pakistani interiors.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Barrel back silhouette with full continuous curved backrest</li>
\n 	<li>Vertical channel tufted stitching across the backrest</li>
\n 	<li>Ribbed corduroy upholstery, textured and durable</li>
\n 	<li>Solid walnut tapered legs with natural wood grain</li>
\n 	<li>High density foam seat and back cushioning</li>
\n 	<li>Available in: Cream, Ivory, Gray, Olive, Navy, Rust, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, living rooms, and study areas in Pakistani homes. The barrel back provides better head and back support than open-top designs and this makes it a preferred double seater sofa for customers who sit for extended periods.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 150 cm | Depth: 82 cm | Height: 80 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Select your corduroy colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Provence Chesterfield Tufted Loveseat', 'provence-chesterfield-tufted-loveseat', 'CC-2S-015', 47000, 41999, 'The Provence is a classic 2 seater lounge sofa with Chesterfield-style button tufting, generously rolled arms, nailhead trim detailing, and dark turned bun feet. A traditional linen loveseat that suits formal drawing rooms and guest sitting areas across Pakistani homes.', '<h2>Provence Chesterfield Tufted Loveseat - Classic 2 Seater Lounge Sofa</h2>
\nThe ComfyClub Provence Loveseat is a classic 2 seater lounge sofa with genuine Chesterfield DNA. Button tufting across the back and seat, generously rolled arms, nailhead trim along the edges, and dark turned bun feet create a sofa that feels settled, formal, and properly considered. Upholstered in premium linen and built at our Lahore workshop to the same quality standard as every piece we make.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Full button tufting across backrest and seat cushion</li>
\n 	<li>Generously rolled arms with tufted detailing</li>
\n 	<li>Nailhead trim along the arm and front base edges</li>
\n 	<li>Dark turned bun feet in ebony or walnut finish</li>
\n 	<li>Premium linen or fabric upholstery options</li>
\n 	<li>Available in: Beige, Cream, Sand, Dusty Blue, Sage, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nFormal drawing rooms, guest sitting areas, and traditional home settings in Pakistan. The Provence is a consistent choice for Pakistani homeowners who want a drawing room sofa that reflects traditional taste and holds its look over many years.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 168 cm | Depth: 92 cm | Height: 84 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Sidwell Channel Tufted Loveseat', 'sidwell-channel-tufted-loveseat', 'CC-2S-016', 41000, 36999, 'The Sidwell loveseat features a curved wave-shaped backrest with vertical channel tufting, two matching round cushions, and gold metal legs. A stylish 2 person sofa that brings bold design to drawing rooms and formal lounges without sacrificing comfort.', '<h2>Sidwell Channel Tufted Wave Back Loveseat - Stylish 2 Person Sofa</h2>
\nThe ComfyClub Sidwell Loveseat is built around its most distinctive feature: the curved wave-shaped backrest with full vertical channel tufting. The wave contour gives each seat its own defined shape while the two matching round cushions add comfort and visual detail. Gold metal legs and premium fabric complete this stylish 2 person sofa that suits both formal and contemporary settings in Pakistani homes.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Curved wave-shaped backrest with full vertical channel tufting</li>
\n 	<li>Two matching round bolster cushions included</li>
\n 	<li>Gold-tone metal legs with polished finish</li>
\n 	<li>Premium fabric upholstery with strong colour retention</li>
\n 	<li>Defined individual seat contours for two-person comfort</li>
\n 	<li>Available in: Navy, Dusty Blue, Sage, Gray, Blush, Ivory, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, formal sitting areas, and modern bedroom lounges across Pakistan. The wave back and bold colour make this 2 person sofa one of the most photographed designs in our collection, popular with customers who actively curate their home interiors.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 146 cm | Depth: 80 cm | Height: 82 cm | Seat Height: 40 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Terren Farmhouse Linen Loveseat', 'terren-farmhouse-linen-loveseat', 'CC-2S-017', 40000, 34999, 'The Terren farmhouse linen loveseat features rolled padded arms, a high cushioned back, natural linen upholstery, and turned spindle wood bun legs. A traditional 2 seater sofa design that suits bedrooms, compact sitting rooms, and farmhouse-style interiors across Pakistani homes.', '<h2>Terren Farmhouse Linen Loveseat - Two Seater Sofa for Bedroom</h2>
\nThe ComfyClub Terren Farmhouse Loveseat is built around the classic farmhouse sofa formula: rolled arms, a high upholstered back, breathable linen fabric, and solid turned wood legs. It sits naturally in a bedroom corner, a compact sitting room, or any space where a relaxed traditional look is preferred over a formal one. Made to order at our Lahore workshop.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Rolled padded arms with a traditional farmhouse profile</li>
\n 	<li>High cushioned back with a single loose back cushion included</li>
\n 	<li>Natural breathable linen upholstery suited to Pakistani climate</li>
\n 	<li>Turned spindle bun legs in natural or walnut wood finish</li>
\n 	<li>High density foam seat cushioning</li>
\n 	<li>Available in: Olive Green, Natural Linen, Cream, Stone Gray, Sage, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nBedrooms, bedroom sitting areas, compact lounges, and guest rooms across Pakistan. This two seater sofa for bedroom use is one of our most requested designs for Pakistani master bedrooms where a comfortable additional seat is needed without adding another large piece of furniture.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 138 cm | Depth: 84 cm | Height: 86 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your linen colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>
\n
\n&nbsp;', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Terren Farmhouse Loveseat', 'terren-farmhouse-loveseat', 'CC-2S-018', 45000, 39999, 'The Terren farmhouse loveseat with exposed natural wood rolled arms combines upholstered linen seating with uncovered natural wood arm details and spindle legs. A wooden 2 seater sofa that connects to Pakistani woodworking craft traditions while delivering modern farmhouse style.', '<h2>Terren Farmhouse Loveseat with Exposed Wood Rolled Arms - Wooden 2 Seater Sofa</h2>
\nThe ComfyClub Terren Farmhouse Loveseat with Exposed Wood Arms shows the frame rather than hiding it. The natural solid wood rolled arms sit uncovered above the linen upholstery, letting the quality of the woodwork speak directly. Spindle legs, nailhead trim at the base, and a deep upholstered seat complete this wooden 2 seater sofa that draws from both traditional craft and contemporary farmhouse design.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Exposed natural solid wood rolled arms for visible craftsmanship</li>
\n 	<li>Nailhead trim along the lower base edge</li>
\n 	<li>Premium linen or fabric upholstery on seat and back</li>
\n 	<li>Solid wood spindle legs in natural or walnut finish</li>
\n 	<li>High density foam seat with sinuous spring base</li>
\n 	<li>Available in: Charcoal Gray, Dark Linen, Navy, Stone, Natural, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nDrawing rooms, guest sitting rooms, and lounge areas across Pakistan. The exposed wood arms give this wooden 2 seater sofa a character that fully upholstered designs do not have, and Pakistani customers who appreciate visible woodcraft consistently choose this design.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 152 cm | Depth: 88 cm | Height: 88 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your linen colour and wood finish. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Rattan and Linen Upholstered Loveseat', 'rattan-and-linen-upholstered-loveseat', 'CC-2S-019', 65000, 55000, 'A bohemian 2 seater sofa with handwoven rattan cane side panels, cream linen seat and back cushions, and a solid wood frame. Natural materials and open cane weaving make this a distinctive and breathable loveseat for Pakistani homes that lean towards natural or bohemian aesthetics.', '<h2>Rattan and Linen Upholstered Loveseat - Bohemian 2 Seater Sofa</h2>
\nThe ComfyClub Rattan Linen Loveseat stands apart from every other 2 seater sofa in our collection. The handwoven rattan cane panels on both sides replace the standard upholstered arm panels with a natural open weave that is breathable, visually distinctive, and connected to South Asian craft traditions. Combined with cream linen seat cushions and a solid wood frame, this bohemian 2 seater sofa works beautifully in natural, Japandi, and earthy interior styles.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Handwoven rattan cane panels on both sides</li>
\n 	<li>Solid wood frame with natural or walnut finish</li>
\n 	<li>Premium linen seat and back cushions with removable covers</li>
\n 	<li>Open cane weave allows airflow, practical for Pakistani summers</li>
\n 	<li>Clean straight frame lines with natural aesthetic</li>
\n 	<li>Available seat colours: Cream, Natural, Beige, Terracotta, Sage, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nLiving rooms, lounges, study areas, and verandas across Pakistan. Natural rattan is deeply connected to South Asian design heritage. This 2 seater sofa is a consistent choice for customers who want furniture that reflects natural craft and stands out in a space dominated by standard upholstered designs.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 148 cm | Depth: 82 cm | Height: 88 cm | Seat Height: 44 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your seat cushion colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs', 'button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs', 'CC-2S-020', 35000, 29999, 'A classic fabric chesterfield 2 seater sofa with button tufting across the back and arms, rolled arm detailing, and dark turned wood legs. A traditional two seater sofa that suits formal drawing rooms, guest sitting areas, and heritage-style interiors across Pakistani homes.', '<h2>Fabric Chesterfield 2 Seater Loveseat Sofa - Classic Button Tufted Two Seater Sofa</h2>
\nThe ComfyClub Chesterfield 2 Seater Sofa is the original drawing room sofa in a two-seater format. Button tufting across the full backrest and arms, rolled arm detailing on both sides, and dark turned wood legs create a sofa with clear Chesterfield credentials built at our Lahore workshop with a solid hardwood frame and premium velvet or fabric upholstery. A two seater sofa that holds its look and its value over many years.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Full button tufting across backrest and rolled arms</li>
\n 	<li>Classic Chesterfield rolled arm silhouette on both sides</li>
\n 	<li>Dark turned wood legs in ebony or dark walnut finish</li>
\n 	<li>Premium velvet or fabric upholstery options</li>
\n 	<li>High density foam seat with sinuous spring base</li>
\n 	<li>Available in: Emerald Green, Navy, Burgundy, Ivory, Charcoal, Teal, Custom</li>
\n</ul>
\n<h3>Perfect For</h3>
\nFormal drawing rooms, guest sitting areas, studies, and traditional interiors across Pakistan. The Chesterfield two seater sofa remains one of the most recognisable and requested designs in Pakistan, particularly among customers furnishing formal rooms where a strong traditional statement is expected.
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Width: 158 cm | Depth: 90 cm | Height: 86 cm | Seat Height: 42 cm</li>
\n</ul>
\n<h3>How to Pre-Order</h3>
\nStep 1: Choose your fabric or velvet colour. Step 2: Confirm via WhatsApp and pay 60% advance. Step 3: Your chesterfield 2 seater sofa is delivered in 20 to 25 working days from Lahore.
\n
\n<strong>Handcrafted in Lahore, Pakistan | Delivered Across Pakistan</strong>', (SELECT id FROM categories WHERE slug='/seater-sofas/2-seater-sofas/'), 'published', false, now()),
  ('3-in-1 Fabric Convertible Pull-Out Sofa Bed', '3-in-1-fabric-convertible-pull-out-sofa-bed', 'CC-SCB-001', 95000, 84000, 'Grid-tufted backrest, padded arms with built-in storage on both sides, and dark block feet. The front mechanism pulls out to a flat sleeping surface without moving the back cushions. Two matching cushions included.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The storage compartments built into both arms are what set this sofa bed apart from a standard pull-out. Bedding, remotes, reading material , it all stays within reach without a side table. The grid-tufted backrest sits upright and structured in sofa mode. Pull out the base and the sofa converts to a flat sleeping surface without touching the back cushions or removing anything from the arms.</p>\n<p>Made to order in Lahore. The fabric and colour are confirmed before we start. The block feet keep the base clean and grounded , no metal legs that scratch floors or collect dust underneath.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Front pull-out mechanism converts to a flat sleeping surface</li>\n<li>Built-in storage in both arm rests</li>\n<li>Grid button-tufted backrest</li>\n<li>Dark solid block feet</li>\n<li>Two matching cushions included</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 165 cm | Depth 88 cm | Height 86 cm</li>\n<li>Bed Mode: Width 165 cm | Full Depth 190 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Velvet Tufted Futon Sofa Bed with Gold Legs', 'velvet-tufted-futon-sofa-bed-with-gold-legs', 'CC-SCB-002', 78000, 65000, 'Diamond button tufting covers both the backrest and the seat. Gold metal legs and a matching gold horizontal base rail run the full length of the front. The futon backrest folds flat in one step , no parts to remove, no cushions to set aside.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The gold base rail is the detail that most people notice first. It runs the full front and sides of the sofa at floor level, tying together the gold legs into a single clean horizontal line. Combined with full diamond tufting on the backrest and seat, this is a sofa cum bed that earns its place in a formal drawing room without looking like it converts to anything.</p>\n<p>The futon mechanism folds the backrest back in a single movement. The tufted surface becomes the sleeping area. Two matching velvet cushions are included. Available in ivory as shown and in any velvet colour you confirm with us.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Full diamond button tufting on backrest and seat</li>\n<li>Gold metal legs with matching gold horizontal base rail</li>\n<li>Futon flat-fold mechanism, one-step conversion</li>\n<li>Premium velvet upholstery</li>\n<li>Two matching cushions included</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 168 cm | Depth 86 cm | Height 82 cm</li>\n<li>Bed Mode: Width 168 cm | Full Depth 185 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Corduroy Rounded 2-in-1 Foldable Sofa Bed', 'corduroy-rounded-2-in-1-foldable-sofa-bed', 'CC-SCB-003', 72000, 65000, 'Rounded edges, ribbed corduroy throughout, and clean white piping along the seat base give this sofa a soft organic silhouette that stands out from every standard rectangular design. The seat folds forward to convert to a sleeping surface. No legs , it sits on a low platform that keeps the proportions grounded.\n\nSolid hardwood base frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Most sofa beds are rectangular. This one is not. The rounded corners, low platform base, and continuous ribbed corduroy create a sofa cum bed that looks like it was shaped rather than built. The white piping that runs along the seat base edge is a clean design detail that breaks the corduroy texture with a sharp contrast line.</p>\n<p>The seat folds forward to create the sleeping surface. In sofa mode, the upright back cushions give solid support. The sage green shown is the standard colour. Other corduroy colours are available on order. Made at our Lahore workshop , your colour is confirmed before cutting starts.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Rounded organic pill-form silhouette, no sharp corners</li>\n<li>White contrast piping along the seat base edge</li>\n<li>Ribbed corduroy upholstery throughout</li>\n<li>Low platform base, no legs</li>\n<li>Fold-forward seat converts to sleeping surface</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood base frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 165 cm | Depth 82 cm | Height 78 cm</li>\n<li>Bed Mode: Width 165 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('2-in-1 Scandinavian Fabric Futon Sofa Bed', '2-in-1-scandinavian-fabric-futon-sofa-bed', 'CC-SCB-004', 80000, 74999, 'Clean lines, a straight back, tapered solid wood legs, and no unnecessary detailing. The futon backrest lays flat in one move. Nothing about this sofa announces that it converts , which is the point.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Scandinavian furniture design built its reputation on doing more with less. This sofa cum bed follows that principle. The proportions are honest , a proper seat depth, a back that provides real support, legs that carry the piece without looking heavy. The absence of tufting, buttons, or decorative stitching lets the fabric and the form speak for themselves.</p>\n<p>The futon backrest reclines flat smoothly. In bed mode the surface is even and stable. In sofa mode the backrest locks upright. This is a sofa cum bed for rooms where the furniture is not supposed to compete with the rest of the space , it is simply there, doing its job well. Fabric and colour confirmed at the time of order.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Clean Scandinavian silhouette, no excess detailing</li>\n<li>Tapered solid wood legs in natural or walnut finish</li>\n<li>Flat-fold futon mechanism, smooth and stable</li>\n<li>Breathable fabric upholstery</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 162 cm | Depth 84 cm | Height 80 cm</li>\n<li>Bed Mode: Width 162 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Linen Convertible Single Sleeper Chair Bed', 'linen-convertible-single-sleeper-chair-bed', 'CC-SCB-005', 58000, 49999, 'A single-seat linen chair that reclines fully to a flat single sleeping surface. The metal frame mechanism at the base extends forward smoothly on built-in wheels, making it easy to move and reposition the piece without lifting. One matching lumbar cushion included.\n\nSolid frame with Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>This is the most compact piece in the sofa cum bed collection. A single chair width, a single sleeping surface, and wheels underneath that make it the easiest piece to move in the entire range. The metal extension mechanism shows when the chair is in bed mode , the frame folds out forward and the seat reclines flat. It is a practical single-person sleeping solution for rooms where a full sofa cum bed would simply not fit.</p>\n<p>The tufted linen seat and back hold their shape in both sitting and reclining positions. The pink colour is shown , other linen colours are available on order. This chair is a good option for a study, a child''s room, or a compact apartment where the occasional overnight guest needs a proper sleeping surface without a dedicated guest bed.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Single-seat chair reclines to a full flat single sleeping surface</li>\n<li>Metal frame extension mechanism with built-in wheels</li>\n<li>Tufted linen seat and backrest</li>\n<li>One matching lumbar cushion included</li>\n<li>Compact single-person footprint</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Chair Mode: Width 90 cm | Depth 82 cm | Height 88 cm</li>\n<li>Bed Mode: Width 90 cm | Full Depth 195 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Velvet 3-in-1 Sleeper Sofa Bed Side Pockets', 'velvet-3-in-1-sleeper-sofa-bed-side-pockets', 'CC-SCB-006', 135000, 124999, 'Deep button tufting on the backrest, side pockets on both arms, and a pull-out sleeping surface that lies completely flat. This is the most functional sofa cum bed in the collection if regular nightly use is the priority.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Side pockets on both arms are a specific choice. They are there for the person using this sofa cum bed as an actual bed , phone, water, book, glasses within reach from a lying position. The pull-out sleeping surface is wide enough for comfortable single sleeping and extends flat without any uneven sections. The backrest stands upright and tufted during the day so the sofa reads as a proper piece in any room.</p>\n<p>The black velvet is the available colour shown. Any velvet colour can be ordered. Two matching cushions are included. For households where the sofa cum bed is used as a regular sleeping spot rather than just for occasional guests, this design is built for that frequency of use.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Full-width pull-out sleeping surface, completely flat</li>\n<li>Side pockets on both arms for bedside essentials</li>\n<li>Deep button tufting on the full backrest</li>\n<li>Premium velvet upholstery</li>\n<li>Two matching cushions included</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 170 cm | Depth 88 cm | Height 84 cm</li>\n<li>Bed Mode: Width 170 cm | Full Depth 195 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Mid Century Faux Leather Futon Sofa Bed', 'mid-century-faux-leather-futon-sofa-bed', 'CC-SCB-007', 95000, 85000, 'Channel tufting runs vertically across the full backrest. Rounded padded arms and dark walnut tapered legs give this sofa a mid-century identity that holds well in both traditional and contemporary rooms. The faux leather surface cleans with a wipe.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Faux leather ages better than genuine leather in Pakistani conditions. It does not crack in dry winters, does not become tacky in humid summers, and a damp cloth removes most marks. The channel tufting is cut into the backrest at regular vertical intervals , this creates shadow lines that add depth to the surface without the formality of button tufting. The rounded arms are fully padded and comfortable in a way that squared wooden arms are not.</p>\n<p>The futon backrest reclines flat in one movement. In bed mode the surface is firm and even , channel tufting does not create pressure points the way button tufting can. Cognac is the shown colour. Black and dark gray are available on order. Walnut legs are standard; natural wood finish is also available.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Vertical channel tufting on the full backrest</li>\n<li>Faux leather surface, easy to wipe clean</li>\n<li>Rounded padded arms</li>\n<li>Dark walnut tapered solid wood legs</li>\n<li>Futon flat-fold mechanism</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 166 cm | Depth 88 cm | Height 82 cm</li>\n<li>Bed Mode: Width 166 cm | Full Depth 190 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Japandi Fabric Futon Sofa Bed Wood Arms', 'japandi-fabric-futon-sofa-bed-wood-arms', 'CC-SCB-010', 95000, 84999, 'Flat solid wood arms replace the standard padded arm panels. Side pockets are built into the wood on both arms. The channel-stitched seat sits low. The futon adjusts to multiple backrest angles.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The wood arms are the defining feature. They are flat, finished solid wood , not veneered, not painted , and they hold pockets that are built flush into the outer face. In a room with other natural wood furniture, these arms create a visual connection that fully upholstered sofas cannot make. The seat sits low, consistent with the Japandi approach to furniture that keeps the room feeling open and uncluttered.</p>\n<p>The futon backrest adjusts between multiple angles so the sofa works in an upright reading position, a mid-recline lounging position, and fully flat for sleeping. The channel stitching on the seat adds subtle texture without competing with the wood arm detail. Neutral fabric colours are available , beige, cream, and light gray are the most requested options.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Flat solid wood arms with built-in side pockets</li>\n<li>Multi-position adjustable futon backrest</li>\n<li>Channel-stitched fabric seat</li>\n<li>Low-profile seat height for a grounded look</li>\n<li>Short solid wood block legs</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 155 cm | Depth 82 cm | Height 76 cm</li>\n<li>Bed Mode: Width 155 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Corduroy Double Sofa Bed Chrome Side Handles', 'corduroy-double-sofa-bed-chrome-side-handles', 'CC-SCB-011', 125000, NULL, 'Brown ribbed corduroy, rounded barrel arms, and chrome rectangular handles on both sides. The three back cushions are fully upholstered in matching corduroy. The sofa converts to a wide daybed , the chrome handles on the sides are what you use to pull the conversion mechanism.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The chrome handles are a functional design choice, not a decorative one. They give you a grip point to pull the conversion mechanism without bending around the side of the sofa. The result is a cleaner operation than sofas with hidden latches. The rounded barrel arms are wide enough to rest your arms comfortably and the corduroy texture holds its shape under daily pressure from leaning and sitting.</p>\n<p>When converted, the sofa creates a wide, flat sleeping surface with a daybed proportions. All three back cushions can be repositioned to support the head or lined up as a sleeping surface extension. The brown corduroy shown is standard; other corduroy colours including olive, gray, and navy are available on order from Lahore.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Chrome rectangular handles on both sides for easy conversion</li>\n<li>Rounded barrel arms, fully corduroy upholstered</li>\n<li>Three matching corduroy back cushions</li>\n<li>Converts to a wide flat daybed surface</li>\n<li>Ribbed corduroy throughout, durable for daily use</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 185 cm | Depth 90 cm | Height 84 cm</li>\n<li>Bed Mode: Width 185 cm | Full Depth 196 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Beige Fabric Pull-Out Sofa Bed with Cushions', 'beige-fabric-pull-out-sofa-bed-with-cushions', 'CC-SCB-012', 105000, 94999, 'Three large back cushions sit against a clean armless backrest. A small handle at the front base is all it takes to pull the sleeping surface forward. No arms means no wasted side width , the full seat area is usable.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Armless sofa beds look wider than they are because there is no visual interruption at the sides. This one uses that space well , the three back cushions fill the full width, the seat runs edge to edge, and when the pull-out extends, the sleeping area is as wide as the sofa itself. The pull-out handle at the front base is low-profile and practical. No hinges, no latches on the arms, no complicated assembly.</p>\n<p>Beige is the most flexible furniture colour available. It works with cream walls, gray walls, wood floors, and tiled floors alike. The fabric is practical for year-round use. Other fabric colours are available on order if beige is not right for your room.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Armless profile, full seat width with no side interruption</li>\n<li>Three large back cushions included</li>\n<li>Simple front pull-out handle at base</li>\n<li>Low-profile silhouette</li>\n<li>Neutral beige fabric, other colours available</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 170 cm | Depth 88 cm | Height 82 cm</li>\n<li>Bed Mode: Width 170 cm | Full Depth 192 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Velvet Futon Sofa Bed Gold Base Rail Legs', 'velvet-futon-sofa-bed-gold-base-rail-legs', 'CC-SCB-013', 91000, 81999, 'Diamond tufting on the full backrest and seat. Gold metal legs and a continuous gold horizontal rail that runs the full front and sides at base level. The gold rail is the detail that distinguishes this design from other gold-leg options , it connects the legs into a single visual plane.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Most gold-leg sofas stop at the legs. This one runs a gold rail between them at base level, creating a continuous horizontal line rather than four separate punctuation marks. That single design decision changes how the whole sofa reads from the front. The diamond tufting above, the gold rail below , the sofa has a defined visual structure that holds in any room.</p>\n<p>The futon backrest folds flat for sleeping. Two matching cushions included. Gray velvet is shown , the gold hardware works equally well with navy, dusty rose, and deep green if you prefer a more saturated palette. Colour confirmed before production starts.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Continuous gold horizontal rail at base level connecting the legs</li>\n<li>Gold metal tapered legs</li>\n<li>Full diamond button tufting on backrest and seat</li>\n<li>Premium velvet upholstery</li>\n<li>Futon flat-fold mechanism</li>\n<li>Two matching cushions included</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 168 cm | Depth 86 cm | Height 82 cm</li>\n<li>Bed Mode: Width 168 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Chesterfield Velvet Sofa Bed Scroll Arms', 'chesterfield-velvet-sofa-bed-scroll-arms', 'CC-SCB-014', 115000, 95000, 'Full button tufting on the backrest, seat, and both scroll arms. Dark turned bun feet. This is the Chesterfield silhouette in a sofa cum bed format , the pull-out mechanism sits in the base frame without any visible indication that the piece converts.
\n
\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', 'The challenge with a Chesterfield sofa cum bed is maintaining the formal identity while fitting a conversion mechanism inside the frame. This design achieves that , from the front it is a Chesterfield. The tufting is hand-placed on the arms, the scroll profile is consistent on both sides, and the dark bun feet complete the traditional silhouette. The pull-out does not compromise the exterior form in any way.
\n
\nCream velvet is shown and is the most popular colour choice for formal Pakistani drawing rooms. Navy, burgundy, and forest green are available for rooms with a more saturated palette. Button tufting on velvet in these colours creates a richness that photographs well and impresses guests. Two matching cushions included.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Full button tufting on backrest, seat, and both scroll arms</li>
\n 	<li>Classic Chesterfield scroll arm profile</li>
\n 	<li>Dark turned bun feet</li>
\n 	<li>Pull-out mechanism integrated without affecting exterior form</li>
\n 	<li>Premium velvet upholstery</li>
\n 	<li>Two matching cushions included</li>
\n 	<li>Molty Foam cushioning, 5-year warranty</li>
\n 	<li>Solid hardwood frame, 2.5-year warranty</li>
\n</ul>
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Sofa Mode: Width 172 cm | Depth 90 cm | Height 88 cm</li>
\n 	<li>Bed Mode: Width 172 cm | Full Depth 195 cm</li>
\n</ul>
\n<h3>How to Order</h3>
\nContact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.
\n<div style="background: #FAF7F2; border-left: 3px solid #C9A84C; padding: 12px 16px; font-weight: 600; color: #1b2a47; margin-top: 20px;">Handcrafted in Lahore, Pakistan  |  Molty Foam 5-Year Warranty  |  Solid Wood Frame 2.5-Year Warranty  |  Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Boucle Modular Floor Sofa Bed Round Cushions', 'boucle-modular-floor-sofa-bed-round-cushions', 'CC-SCB-015', 81000, 69999, 'No legs. No arms. The entire piece sits at floor level on a platform base. Two large round cushions lean against the back. The modular sections reconfigure to create a floor sleeping area.
\n
\nSolid frame with Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', 'Floor-level furniture requires no commitment to a fixed configuration. The sections of this sofa cum bed can be arranged in different ways depending on the room and the occasion. As a sofa, the sections create a low seating area with the round cushions propped against the back. As a sleeping surface, the sections extend flat across the floor. The orange boucle is a bold colour choice , it does not blend into a room, it becomes the room.
\n
\nBoucle fabric is more practical for floor-level furniture than velvet. It resists dust better, stays cooler, and the looped texture does not flatten with daily use the way velvet pile does. Other boucle colours are available , cream, taupe, and sage are the most requested alternatives if orange is too strong for your space.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Floor-level platform base, no legs</li>
\n 	<li>Modular sections reconfigure for sofa and sleeping use</li>
\n 	<li>Two large matching round boucle cushions</li>
\n 	<li>Premium boucle upholstery</li>
\n 	<li>Bold colour options available</li>
\n 	<li>Molty Foam cushioning, 5-year warranty</li>
\n 	<li>Solid frame, 2.5-year warranty</li>
\n</ul>
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Sofa Mode: Width 175 cm | Depth 85 cm | Height 55 cm</li>
\n 	<li>Bed Mode: Sections extend to approx. 175 x 195 cm flat</li>
\n</ul>
\n<h3>How to Order</h3>
\nContact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.
\n<div style="background: #FAF7F2; border-left: 3px solid #C9A84C; padding: 12px 16px; font-weight: 600; color: #1b2a47; margin-top: 20px;">Handcrafted in Lahore, Pakistan  |  Molty Foam 5-Year Warranty  |  Solid Wood Frame 2.5-Year Warranty  |  Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Quilted Sleeper Sofa Bed Adjustable Backrest', 'quilted-sleeper-sofa-bed-adjustable-backrest', 'CC-SCB-016', 80000, 74999, 'Diamond-quilted surface on the backrest, seat, and arms. The backrest adjusts through multiple positions , upright, mid-recline, and fully flat for sleeping. Wide arms have storage compartments built in.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The adjustable backrest is the functional advantage here. Most sofa cum beds offer two positions , sofa and flat bed. This one locks at intermediate angles too, which matters if you read or watch television in a reclining position before sleeping. The storage compartments in the wide arms hold the things that end up on the floor beside a sofa: remotes, phones, reading material.</p>\n<p>Diamond quilting on faux leather is a durable surface choice. The quilting pattern holds its shape even when the surface is compressed in daily use. The teal shown is a strong room colour , gray, black, and navy are available as quieter alternatives. Solid wood legs at each corner.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Backrest adjusts and locks at multiple angles</li>\n<li>Diamond-quilted surface on backrest, seat, and arms</li>\n<li>Storage compartments in both wide arms</li>\n<li>Faux leather surface, easy to maintain</li>\n<li>Solid wood legs</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 165 cm | Depth 88 cm | Height 86 cm</li>\n<li>Bed Mode: Width 165 cm | Full Depth 192 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Corduroy Sofa Bed Loveseat with Cup Holders', 'corduroy-sofa-bed-loveseat-with-cup-holders', 'CC-SCB-017', 75000, 64999, 'Built-in cup holders in both arms. Ribbed corduroy throughout. Gold metal legs. The backrest converts to a flat sleeping surface. Compact loveseat width.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Cup holders in furniture are a practical feature that gets used every single day. This sofa cum bed has them recessed into the top of each arm , one on each side. Tea, water, a phone, a remote. The things that normally migrate to the floor or the edge of the coffee table stay within reach and off the seat. The gold legs tie into gold hardware elsewhere in the room if that is part of the decor direction.</p>\n<p>The pink corduroy shown is a bold choice and consistently popular. Navy, sage, beige, and gray are available for a quieter option. The ribbed corduroy texture gives the piece character that plain velvet or fabric does not have at close range. Compact loveseat width makes this a practical sofa cum bed for a bedroom or a study that does not have space for a full three-seater.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Built-in cup holders recessed into both arm tops</li>\n<li>Ribbed corduroy upholstery throughout</li>\n<li>Gold metal legs</li>\n<li>Convertible backrest for sofa to sleeping position</li>\n<li>Compact loveseat width</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 155 cm | Depth 84 cm | Height 80 cm</li>\n<li>Bed Mode: Width 155 cm | Full Depth 185 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Faux Leather Tufted Convertible Sofa Bed', 'faux-leather-tufted-convertible-sofa-bed', 'CC-SCB-018', 95000, 79999, 'Diamond tufting on the full backrest above clean untufted seat cushions. Dark solid wood tapered legs. The convertible mechanism reclines the back through multiple positions including fully flat.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>The contrast between the tufted back and the plain seat works well in faux leather. The tufting creates visual texture on the surface that faces the room. The seat cushions remain smooth , because tufted leather-look surfaces are less comfortable to sit on for extended periods than a plain cushioned seat. This design makes that distinction deliberately.</p>\n<p>Dark wood tapered legs in a walnut tone ground the cognac colour without adding black hardware. The convertible back adjusts smoothly through multiple recline positions. Cognac is a warm colour that works with most Pakistani interior palettes. Dark brown, black, and caramel are also available. Made at our Lahore workshop in your confirmed colour.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Diamond tufting on the full backrest</li>\n<li>Clean untufted seat cushions for comfortable seating</li>\n<li>Dark solid wood tapered legs</li>\n<li>Faux leather surface, wipes clean easily</li>\n<li>Multi-position convertible backrest</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 170 cm | Depth 88 cm | Height 84 cm</li>\n<li>Bed Mode: Width 170 cm | Full Depth 190 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Gray Linen Channel Back Futon Sofa Bed', 'gray-linen-channel-back-futon-sofa-bed', 'CC-SCB-019', 85000, 79999, 'Vertical channel tufting runs the full height of the backrest. Rounded padded arms. Tapered solid wood legs. The futon backrest folds flat. Linen fabric is breathable year-round.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Channel tufting is a different language to button tufting. Where buttons create individual focal points, channels create movement , the eye travels up and down the parallel lines rather than landing on specific points. On a linen surface, the channels cast soft shadows that shift with the light through the day. The rounded arms add a softness that squared arms would not have alongside the vertical channel lines.</p>\n<p>Linen upholstery breathes better than velvet in Pakistani summers. The gray linen shown is a mid-tone that does not photograph too dark or too light , it holds its colour well across different room lighting conditions. Natural linen and charcoal are available for those who want something lighter or darker. Tapered solid wood legs in natural or walnut finish.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Full vertical channel tufting on the backrest</li>\n<li>Rounded padded arms</li>\n<li>Linen upholstery, breathable and practical</li>\n<li>Tapered solid wood legs in natural or walnut finish</li>\n<li>Futon flat-fold mechanism</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 165 cm | Depth 86 cm | Height 82 cm</li>\n<li>Bed Mode: Width 165 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Beige Faux Leather Sofa Bed Tufted Arms', 'beige-faux-leather-sofa-bed-tufted-arms', 'CC-SCB-020', 98000, 89999, 'Diamond tufting covers both arms completely. The backrest and seat use a lighter grid stitching that keeps the main surfaces clean. A dark walnut solid wood base rail runs the full length at floor level , the same walnut tone carries through to the legs. Premium faux leather throughout.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', '<p>Most sofas tuft the back or the seat. This one tufts the arms , and only the arms. The diamond pattern on both arm faces is the visual anchor of the design. The back and seat carry a lighter grid stitch that provides texture without competing. The result is a formal piece where the craft shows on the details that are closest to the people sitting in it.</p>\n<p>The dark walnut base rail connects the legs into a continuous floor-level line, giving the sofa a grounded, settled presence. Beige faux leather reads as a light, warm neutral from a distance but the arm tufting gives it definition up close. This is a 3-seater sofa bed suited to formal drawing rooms where the furniture needs to look fully considered. Made to order at our Lahore workshop in beige or other faux leather colours on request.</p>\n<h3>Key Features</h3>\n<ul>\n<li>Diamond tufting across both arm faces</li>\n<li>Grid-stitched backrest and seat for secondary texture</li>\n<li>Dark walnut solid wood base rail and legs</li>\n<li>Premium faux leather throughout</li>\n<li>Full 3-seater width with formal drawing room proportions</li>\n<li>Molty Foam cushioning, 5-year warranty</li>\n<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n<li>Sofa Mode: Width 210 cm | Depth 90 cm | Height 84 cm</li>\n<li>Bed Mode: Width 210 cm | Full Depth 195 cm</li>\n</ul>\n<h3>How to Order</h3>\n<p>Contact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.</p>\n<div style="background:#FAF7F2;border-left:3px solid #C9A84C;padding:12px 16px;font-weight:600;color:#1B2A47;margin-top:20px;">Handcrafted in Lahore, Pakistan &nbsp;|&nbsp; Molty Foam 5-Year Warranty &nbsp;|&nbsp; Solid Wood Frame 2.5-Year Warranty &nbsp;|&nbsp; Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Ivory Convertible Loveseat Pull-Out Sofa Bed', 'ivory-convertible-loveseat-pull-out-sofa-bed', 'CC-SCB-008', 90000, 82000, 'The pull-out mechanism at the base extends forward without requiring the backrest to move. The tufted backrest stays upright while the sleeping surface extends from under the seat. Two matching cushions included. Compact loveseat width makes this the smallest full sofa cum bed in the collection.
\n
\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.', 'Rooms that cannot fit a standard sofa width need this. The loveseat format gives you a proper sofa , not a chair , in a significantly smaller footprint. The pull-out extends from the seat base so there is no wall clearance needed behind the sofa for the back to recline. This makes it workable even in rooms where the sofa sits close to a wall.
\n
\nThe ivory fabric is a neutral that works with almost any room colour. The tufted backrest gives it a finished look in sofa mode. If you need a different colour, we can make this in any fabric you choose. Confirmed at the time of order before production starts.
\n<h3>Key Features</h3>
\n<ul>
\n 	<li>Compact loveseat width, smallest full sofa cum bed in the range</li>
\n 	<li>Front pull-out mechanism, no wall clearance needed behind</li>
\n 	<li>Tufted backrest stays upright during conversion</li>
\n 	<li>Two matching cushions included</li>
\n 	<li>Ivory fabric shown, other colours available</li>
\n 	<li>Molty Foam cushioning, 5-year warranty</li>
\n 	<li>Solid hardwood frame, 2.5-year warranty</li>
\n</ul>
\n<h3>Dimensions (Approximate)</h3>
\n<ul>
\n 	<li>Sofa Mode: Width 148 cm | Depth 86 cm | Height 84 cm</li>
\n 	<li>Bed Mode: Width 148 cm | Full Depth 186 cm</li>
\n</ul>
\n<h3>How to Order</h3>
\nContact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.
\n<div style="background: #FAF7F2; border-left: 3px solid #C9A84C; padding: 12px 16px; font-weight: 600; color: #1b2a47; margin-top: 20px;">Handcrafted in Lahore, Pakistan  |  Molty Foam 5-Year Warranty  |  Solid Wood Frame 2.5-Year Warranty  |  Delivered Across Pakistan</div>', (SELECT id FROM categories WHERE slug='/sofas/sofa-come-bed/'), 'published', false, now()),
  ('Black Tufted Futon Sofa Bed with Wood Legs', 'black-tufted-futon-sofa-bed-with-wood-legs', NULL, NULL, NULL, '<span data-sheets-root="1">Grid button tufting covers the backrest and seat entirely. Solid wood tapered legs in a natural finish. The futon backrest folds flat. In sofa mode nothing about this piece suggests it converts , it reads as a proper tufted sofa.\n\nSolid hardwood frame and Molty Foam cushioning. 2.5-year frame warranty and 5-year foam warranty.</span>', 'The tufting on this design covers both the back and the seat, which is more visually assertive than tufting the backrest alone. It gives the sofa a formal, considered appearance. The tapered solid wood legs in natural finish balance the dark fabric without the starkness of all-black hardware.\n\nThe futon mechanism lays the back flat in one movement. The tufted surface in bed mode provides a firm, even sleeping area , the buttons sit flush rather than creating raised pressure points. Two matching cushions are included. The black shown is standard; other fabric colours are available on order from Lahore.\n<h3>Key Features</h3>\n<ul>\n 	<li>Full grid button tufting on backrest and seat</li>\n 	<li>Tapered solid wood legs in natural finish</li>\n 	<li>Futon flat-fold, one-step conversion</li>\n 	<li>Two matching cushions included</li>\n 	<li>Molty Foam cushioning, 5-year warranty</li>\n 	<li>Solid hardwood frame, 2.5-year warranty</li>\n</ul>\n<h3>Dimensions (Approximate)</h3>\n<ul>\n 	<li>Sofa Mode: Width 164 cm | Depth 86 cm | Height 82 cm</li>\n 	<li>Bed Mode: Width 164 cm | Full Depth 188 cm</li>\n</ul>\n<h3>How to Order</h3>\nContact us on WhatsApp, confirm your colour and specifications, and we will start production within 2 working days. Delivery in 25 to 30 working days from Lahore.\n<div>Handcrafted in Lahore, Pakistan  |  Molty Foam 5-Year Warranty  |  Solid Wood Frame 2.5-Year Warranty  |  Delivered Across Pakistan</div>', NULL, 'draft', false, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, v.url, v.alt, v.ord, v.prim
FROM (VALUES
  ('button-tufted-wingback-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-button-tufted-wingback-accent-chair-1.webp','Button Tufted Wingback Accent Chair',0,true),
  ('button-tufted-wingback-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-button-tufted-wingback-accent-chair-2.webp','Button Tufted Wingback Accent Chair',1,false),
  ('button-tufted-wingback-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-button-tufted-wingback-accent-chair-3.webp','Button Tufted Wingback Accent Chair',2,false),
  ('button-tufted-wingback-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-button-tufted-wingback-accent-chair-4.webp','Button Tufted Wingback Accent Chair',3,false),
  ('button-tufted-wingback-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-button-tufted-wingback-accent-chair-5.webp','Button Tufted Wingback Accent Chair',4,false),
  ('mid-century-wingback-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-wingback-upholstered-accent-chair-1.webp','Mid Century Wingback Upholstered Accent Chair',0,true),
  ('mid-century-wingback-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-wingback-upholstered-accent-chair-4.webp','Mid Century Wingback Upholstered Accent Chair',1,false),
  ('mid-century-wingback-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-wingback-upholstered-accent-chair-2.webp','Mid Century Wingback Upholstered Accent Chair',2,false),
  ('mid-century-wingback-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-wingback-upholstered-accent-chair-3.webp','Mid Century Wingback Upholstered Accent Chair',3,false),
  ('mid-century-wingback-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-wingback-upholstered-accent-chair-5.webp','Mid Century Wingback Upholstered Accent Chair',4,false),
  ('fabric-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-modern-lounge-chair-1.webp','Fabric Upholstered Single Sofa Chair for Living Room',0,true),
  ('fabric-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-modern-lounge-chair-2.webp','Fabric Upholstered Single Sofa Chair for Living Room',1,false),
  ('fabric-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-modern-lounge-chair-3.webp','Fabric Upholstered Single Sofa Chair for Living Room',2,false),
  ('fabric-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-modern-lounge-chair-4.webp','Fabric Upholstered Single Sofa Chair for Living Room',3,false),
  ('fabric-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-modern-lounge-chair-5.webp','Fabric Upholstered Single Sofa Chair for Living Room',4,false),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-1.webp','Soft Velvet Upholstered Accent Chair',0,true),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-2.webp','Soft Velvet Upholstered Accent Chair',1,false),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-5.webp','Soft Velvet Upholstered Accent Chair',2,false),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-3.webp','Soft Velvet Upholstered Accent Chair',3,false),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-4.webp','Soft Velvet Upholstered Accent Chair',4,false),
  ('soft-velvet-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-soft-velvet-upholstered-accent-chair-6.webp','Soft Velvet Upholstered Accent Chair',5,false),
  ('armless-tufted-velvet-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-1.webp','Armless Tufted Velvet Accent Chair',0,true),
  ('armless-tufted-velvet-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-3.webp','Armless Tufted Velvet Accent Chair',1,false),
  ('armless-tufted-velvet-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-2.webp','Armless Tufted Velvet Accent Chair',2,false),
  ('armless-tufted-velvet-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-5.webp','Armless Tufted Velvet Accent Chair',3,false),
  ('armless-tufted-velvet-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-6.webp','Armless Tufted Velvet Accent Chair',4,false),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-1.webp','Modern Upholstered Corduroy Wide Armchair',0,true),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-2.webp','Modern Upholstered Corduroy Wide Armchair',1,false),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-3.webp','Modern Upholstered Corduroy Wide Armchair',2,false),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-4.webp','Modern Upholstered Corduroy Wide Armchair',3,false),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-5.webp','Modern Upholstered Corduroy Wide Armchair',4,false),
  ('modern-upholstered-corduroy-wide-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-corduroy-wide-armchair-bolster-pillows-6.webp','Modern Upholstered Corduroy Wide Armchair',5,false),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-1.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',0,true),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-2.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',1,false),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-4.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',2,false),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-5.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',3,false),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-3.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',4,false),
  ('comfyclub-mid-century-spindle-accent-chair-solid-wood-bobbin-arms-upholstered-single-sofa-chair-for-drawing-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-spindle-accent-chair-6.webp','ComfyClub Mid Century Spindle Accent Chair, Solid Wood Bobbin Arms Upholstered Single Sofa Chair for Drawing Room',5,false),
  ('wide-tufted-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-tufted-armchair-solid-wood-legs-1.webp','Wide Tufted Armchair with Solid Wood Legs',0,true),
  ('wide-tufted-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-tufted-armchair-solid-wood-legs-2.webp','Wide Tufted Armchair with Solid Wood Legs',1,false),
  ('wide-tufted-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-tufted-armchair-solid-wood-legs-3.webp','Wide Tufted Armchair with Solid Wood Legs',2,false),
  ('wide-tufted-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-tufted-armchair-solid-wood-legs-4.webp','Wide Tufted Armchair with Solid Wood Legs',3,false),
  ('wide-tufted-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-tufted-armchair-solid-wood-legs-5.webp','Wide Tufted Armchair with Solid Wood Legs',4,false),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-1.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',0,true),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-2.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',1,false),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-3.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',2,false),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-4.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',3,false),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-5.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',4,false),
  ('mustard-yellow-velvet-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mustard-yellow-velvet-accent-chair-metal-legs-6.webp','Mustard Yellow Velvet Accent Chair with Metal Legs',5,false),
  ('modern-boucle-wingback-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-boucle-wingback-armchair-solid-wood-1.webp','Modern Boucle Wingback Armchair with Solid Wood Legs',0,true),
  ('modern-boucle-wingback-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-boucle-wingback-armchair-solid-wood-2.webp','Modern Boucle Wingback Armchair with Solid Wood Legs',1,false),
  ('modern-boucle-wingback-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-boucle-wingback-armchair-solid-wood-3.webp','Modern Boucle Wingback Armchair with Solid Wood Legs',2,false),
  ('modern-boucle-wingback-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-boucle-wingback-armchair-solid-wood-4.webp','Modern Boucle Wingback Armchair with Solid Wood Legs',3,false),
  ('modern-boucle-wingback-armchair-with-solid-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-boucle-wingback-armchair-solid-wood-5.webp','Modern Boucle Wingback Armchair with Solid Wood Legs',4,false),
  ('curved-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-tub-barrel-accent-chair-1.webp','Curved Upholstered Single Sofa Chair for Living Room',0,true),
  ('curved-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-tub-barrel-accent-chair-1.webp','Curved Upholstered Single Sofa Chair for Living Room',1,false),
  ('curved-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-tub-barrel-accent-chair-3.webp','Curved Upholstered Single Sofa Chair for Living Room',2,false),
  ('curved-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-tub-barrel-accent-chair-4.webp','Curved Upholstered Single Sofa Chair for Living Room',3,false),
  ('curved-upholstered-single-sofa-chair-for-living-room','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-modern-tub-barrel-accent-chair-5.webp','Curved Upholstered Single Sofa Chair for Living Room',4,false),
  ('dukinfield-upholstered-side-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-dukinfield-upholstered-side-chair-1.webp','Dukinfield Upholstered Side Chair',0,true),
  ('dukinfield-upholstered-side-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-dukinfield-upholstered-side-chair-4.webp','Dukinfield Upholstered Side Chair',1,false),
  ('dukinfield-upholstered-side-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-dukinfield-upholstered-side-chair-5.webp','Dukinfield Upholstered Side Chair',2,false),
  ('dukinfield-upholstered-side-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-dukinfield-upholstered-side-chair-3.webp','Dukinfield Upholstered Side Chair',3,false),
  ('dukinfield-upholstered-side-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-dukinfield-upholstered-side-chair-2.webp','Dukinfield Upholstered Side Chair',4,false),
  ('george-oliver-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-george-oliver-accent-chair-metal-legs-1.webp','George Oliver Accent Chair with Metal Legs',0,true),
  ('george-oliver-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-george-oliver-accent-chair-metal-legs-4.webp','George Oliver Accent Chair with Metal Legs',1,false),
  ('george-oliver-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-george-oliver-accent-chair-metal-legs-3.webp','George Oliver Accent Chair with Metal Legs',2,false),
  ('george-oliver-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-george-oliver-accent-chair-metal-legs-2.webp','George Oliver Accent Chair with Metal Legs',3,false),
  ('george-oliver-accent-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-george-oliver-accent-chair-metal-legs-5.webp','George Oliver Accent Chair with Metal Legs',4,false),
  ('meribeth-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-meribeth-upholstered-accent-chair-2.webp','Meribeth Upholstered Accent Chair',0,true),
  ('meribeth-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-meribeth-upholstered-accent-chair-1.webp','Meribeth Upholstered Accent Chair',1,false),
  ('meribeth-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-meribeth-upholstered-accent-chair-4.webp','Meribeth Upholstered Accent Chair',2,false),
  ('meribeth-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-meribeth-upholstered-accent-chair-5.webp','Meribeth Upholstered Accent Chair',3,false),
  ('meribeth-upholstered-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-meribeth-upholstered-accent-chair-3.webp','Meribeth Upholstered Accent Chair',4,false),
  ('fabric-upholstered-dining-chair-with-arms','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-1.webp','Fabric Upholstered Dining Chair with Arms',0,true),
  ('fabric-upholstered-dining-chair-with-arms','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-2.webp','Fabric Upholstered Dining Chair with Arms',1,false),
  ('fabric-upholstered-dining-chair-with-arms','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-3.webp','Fabric Upholstered Dining Chair with Arms',2,false),
  ('fabric-upholstered-dining-chair-with-arms','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-4.webp','Fabric Upholstered Dining Chair with Arms',3,false),
  ('fabric-upholstered-dining-chair-with-arms','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-5.webp','Fabric Upholstered Dining Chair with Arms',4,false),
  ('solid-wood-and-jute-rope-armrests-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-solid-wood-jute-rope-armrests-armchair-1.webp','Solid Wood and Jute Rope Armrests Armchair',0,true),
  ('solid-wood-and-jute-rope-armrests-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-metal-legs-5.webp','Solid Wood and Jute Rope Armrests Armchair',1,false),
  ('solid-wood-and-jute-rope-armrests-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-metal-legs-3.webp','Solid Wood and Jute Rope Armrests Armchair',2,false),
  ('solid-wood-and-jute-rope-armrests-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-metal-legs-2.webp','Solid Wood and Jute Rope Armrests Armchair',3,false),
  ('solid-wood-and-jute-rope-armrests-armchair','https://comfyclub.pk/wp-content/uploads/2026/04/download-2026-04-17T121040.429.webp','Solid Wood and Jute Rope Armrests Armchair',4,false),
  ('modern-single-sofa-chair-for-bedroom-and-office','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-1.webp','Modern Single Sofa Chair for Bedroom and Office',0,true),
  ('modern-single-sofa-chair-for-bedroom-and-office','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-2.webp','Modern Single Sofa Chair for Bedroom and Office',1,false),
  ('modern-single-sofa-chair-for-bedroom-and-office','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-3.webp','Modern Single Sofa Chair for Bedroom and Office',2,false),
  ('modern-single-sofa-chair-for-bedroom-and-office','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-4.webp','Modern Single Sofa Chair for Bedroom and Office',3,false),
  ('modern-single-sofa-chair-for-bedroom-and-office','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-holiway-flannel-accent-chair-5.webp','Modern Single Sofa Chair for Bedroom and Office',4,false),
  ('bohemian-boucle-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-bohemian-boucle-accent-chair-1.webp','Bohemian Boucle Accent Chair',0,true),
  ('bohemian-boucle-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-bohemian-boucle-accent-chair-3.webp','Bohemian Boucle Accent Chair',1,false),
  ('bohemian-boucle-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-bohemian-boucle-accent-chair-5.webp','Bohemian Boucle Accent Chair',2,false),
  ('bohemian-boucle-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-bohemian-boucle-accent-chair-2.webp','Bohemian Boucle Accent Chair',3,false),
  ('bohemian-boucle-accent-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-bohemian-boucle-accent-chair-4.webp','Bohemian Boucle Accent Chair',4,false),
  ('plush-lambswool-style-side-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-plush-lambswool-side-chair-metal-legs-4.webp','Plush Lambswool-Style Side Chair with Metal Legs',0,true),
  ('plush-lambswool-style-side-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-plush-lambswool-side-chair-metal-legs-.webp','Plush Lambswool-Style Side Chair with Metal Legs',1,false),
  ('plush-lambswool-style-side-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-plush-lambswool-side-chair-metal-legs-5.webp','Plush Lambswool-Style Side Chair with Metal Legs',2,false),
  ('plush-lambswool-style-side-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-plush-lambswool-side-chair-metal-legs-2.webp','Plush Lambswool-Style Side Chair with Metal Legs',3,false),
  ('plush-lambswool-style-side-chair-with-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-plush-lambswool-side-chair-metal-legs-3.webp','Plush Lambswool-Style Side Chair with Metal Legs',4,false),
  ('willow-single-seat-lounge-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-willow-single-seat-lounge-chair-1.webp','Willow Single Seat Lounge Chair',0,true),
  ('willow-single-seat-lounge-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-willow-single-seat-lounge-chair-4.webp','Willow Single Seat Lounge Chair',1,false),
  ('willow-single-seat-lounge-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-willow-single-seat-lounge-chair-2.webp','Willow Single Seat Lounge Chair',2,false),
  ('willow-single-seat-lounge-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-willow-single-seat-lounge-chair-3.webp','Willow Single Seat Lounge Chair',3,false),
  ('willow-single-seat-lounge-chair','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-barrel-tub-chair-05.webp','Willow Single Seat Lounge Chair',4,false),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat.6.webp','Boucle Tufted Upholstered Loveseat',0,true),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat-1.webp','Boucle Tufted Upholstered Loveseat',1,false),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat.4.webp','Boucle Tufted Upholstered Loveseat',2,false),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat-2.webp','Boucle Tufted Upholstered Loveseat',3,false),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat.3.webp','Boucle Tufted Upholstered Loveseat',4,false),
  ('boucle-tufted-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat.5.webp','Boucle Tufted Upholstered Loveseat',5,false),
  ('mid-century-modern-scalloped-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-scalloped-back-loveseat-5.webp','Mid Century Modern Scalloped Back Loveseat',0,true),
  ('mid-century-modern-scalloped-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-scalloped-back-loveseat-6.webp','Mid Century Modern Scalloped Back Loveseat',1,false),
  ('mid-century-modern-scalloped-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-scalloped-back-loveseat-3.webp','Mid Century Modern Scalloped Back Loveseat',2,false),
  ('mid-century-modern-scalloped-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-scalloped-back-loveseat-2.webp','Mid Century Modern Scalloped Back Loveseat',3,false),
  ('mid-century-modern-scalloped-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-mid-century-scalloped-back-loveseat-1.webp','Mid Century Modern Scalloped Back Loveseat',4,false),
  ('billijo-scalloped-back-velvet-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-billijo-scalloped-velvet-loveseat-4.webp','Billijo Scalloped Back Velvet Loveseat',0,true),
  ('billijo-scalloped-back-velvet-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-billijo-scalloped-velvet-loveseat-1.webp','Billijo Scalloped Back Velvet Loveseat',1,false),
  ('billijo-scalloped-back-velvet-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-billijo-scalloped-velvet-loveseat-2.webp','Billijo Scalloped Back Velvet Loveseat',2,false),
  ('billijo-scalloped-back-velvet-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-billijo-scalloped-velvet-loveseat-3.webp','Billijo Scalloped Back Velvet Loveseat',3,false),
  ('billijo-scalloped-back-velvet-loveseat','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-billijo-scalloped-velvet-loveseat-5.webp','Billijo Scalloped Back Velvet Loveseat',4,false),
  ('wide-boucle-loveseat-sofa','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-boucle-organic-loveseat-sofa-1.webp','Wide Boucle Loveseat Sofa',0,true),
  ('wide-boucle-loveseat-sofa','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-boucle-organic-loveseat-sofa-2.webp','Wide Boucle Loveseat Sofa',1,false),
  ('wide-boucle-loveseat-sofa','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-boucle-organic-loveseat-sofa-4.webp','Wide Boucle Loveseat Sofa',2,false),
  ('wide-boucle-loveseat-sofa','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-boucle-organic-loveseat-sofa-5.webp','Wide Boucle Loveseat Sofa',3,false),
  ('wide-boucle-loveseat-sofa','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-wide-boucle-organic-loveseat-sofa-3.webp','Wide Boucle Loveseat Sofa',4,false),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-3.webp','Mid Century 2 Seater Sofa with Separate Cushions',0,true),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-1.webp','Mid Century 2 Seater Sofa with Separate Cushions',1,false),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-2.webp','Mid Century 2 Seater Sofa with Separate Cushions',2,false),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-6.webp','Mid Century 2 Seater Sofa with Separate Cushions',3,false),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-5.webp','Mid Century 2 Seater Sofa with Separate Cushions',4,false),
  ('mid-century-2-seater-sofa-with-separate-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-loveseat-4.webp','Mid Century 2 Seater Sofa with Separate Cushions',5,false),
  ('comfyclub-square-arm-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-linen-square-arm-loveseat-1.webp','ComfyClub Square Arm Loveseat',0,true),
  ('comfyclub-square-arm-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-linen-square-arm-loveseat-1.webp','ComfyClub Square Arm Loveseat',1,false),
  ('comfyclub-square-arm-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-linen-square-arm-loveseat-5.webp','ComfyClub Square Arm Loveseat',2,false),
  ('comfyclub-square-arm-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-linen-square-arm-loveseat-4.webp','ComfyClub Square Arm Loveseat',3,false),
  ('comfyclub-square-arm-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-linen-square-arm-loveseat-2.webp','ComfyClub Square Arm Loveseat',4,false),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-1.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',0,true),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-2.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',1,false),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-4.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',2,false),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-5.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',3,false),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-6.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',4,false),
  ('luxury-2-seater-sofa-with-ribbed-back-and-gold-metal-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-demetrius-channel-tufted-velvet-loveseat-21.webp','Luxury 2 Seater Sofa with Ribbed Back and Gold Metal Legs',5,false),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-1.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',0,true),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-3.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',1,false),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-5.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',2,false),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-6.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',3,false),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-4.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',4,false),
  ('minimalist-2-seater-sofa-with-gold-legs-for-bedroom-and-lounge','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-flovilla-curved-organic-loveseat-2.webp','Minimalist 2 Seater Sofa with Gold Legs for Bedroom and Lounge',5,false),
  ('velvet-button-tufted-loveseat-with-nailhead-trim','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-tufted-loveseat-nailhead-trim-1.webp','Velvet Button Tufted Loveseat with Nailhead Trim',0,true),
  ('velvet-button-tufted-loveseat-with-nailhead-trim','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-tufted-loveseat-nailhead-trim-5.webp','Velvet Button Tufted Loveseat with Nailhead Trim',1,false),
  ('velvet-button-tufted-loveseat-with-nailhead-trim','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-tufted-loveseat-nailhead-trim-4.webp','Velvet Button Tufted Loveseat with Nailhead Trim',2,false),
  ('velvet-button-tufted-loveseat-with-nailhead-trim','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-tufted-loveseat-nailhead-trim-3.webp','Velvet Button Tufted Loveseat with Nailhead Trim',3,false),
  ('velvet-button-tufted-loveseat-with-nailhead-trim','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-tufted-loveseat-nailhead-trim-2.webp','Velvet Button Tufted Loveseat with Nailhead Trim',4,false),
  ('modern-boucle-curved-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-boucle-curved-low-profile-loveseat-1.webp','Modern Boucle Curved Loveseat',0,true),
  ('modern-boucle-curved-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-boucle-curved-low-profile-loveseat-5.webp','Modern Boucle Curved Loveseat',1,false),
  ('modern-boucle-curved-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-boucle-curved-low-profile-loveseat-4.webp','Modern Boucle Curved Loveseat',2,false),
  ('modern-boucle-curved-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-boucle-curved-low-profile-loveseat-3.webp','Modern Boucle Curved Loveseat',3,false),
  ('modern-boucle-curved-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-boucle-curved-low-profile-loveseat-2.webp','Modern Boucle Curved Loveseat',4,false),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-6.webp','Hendrix Velvet Scalloped Loveseat',0,true),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-1.webp','Hendrix Velvet Scalloped Loveseat',1,false),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-5.webp','Hendrix Velvet Scalloped Loveseat',2,false),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-4.webp','Hendrix Velvet Scalloped Loveseat',3,false),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-3.webp','Hendrix Velvet Scalloped Loveseat',4,false),
  ('hendrix-velvet-scalloped-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-hendrix-velvet-scalloped-loveseat-2.webp','Hendrix Velvet Scalloped Loveseat',5,false),
  ('jopath-mini-channel-tufted-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-1.webp','Jopath Mini Channel Tufted Boucle Loveseat',0,true),
  ('jopath-mini-channel-tufted-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-5.webp','Jopath Mini Channel Tufted Boucle Loveseat',1,false),
  ('jopath-mini-channel-tufted-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-4.webp','Jopath Mini Channel Tufted Boucle Loveseat',2,false),
  ('jopath-mini-channel-tufted-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-2.webp','Jopath Mini Channel Tufted Boucle Loveseat',3,false),
  ('jopath-mini-channel-tufted-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-jopath-mini-channel-tufted-boucle-loveseat-3.webp','Jopath Mini Channel Tufted Boucle Loveseat',4,false),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-1.webp','Modern Curved Arm Boucle Loveseat',0,true),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-5.webp','Modern Curved Arm Boucle Loveseat',1,false),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-6.webp','Modern Curved Arm Boucle Loveseat',2,false),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-2.webp','Modern Curved Arm Boucle Loveseat',3,false),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-4.webp','Modern Curved Arm Boucle Loveseat',4,false),
  ('modern-curved-arm-boucle-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-modern-curved-arm-boucle-loveseat-3.webp','Modern Curved Arm Boucle Loveseat',5,false),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-1.webp','Mid Century Corduroy Barrel Back Loveseat',0,true),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-6.webp','Mid Century Corduroy Barrel Back Loveseat',1,false),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-5.webp','Mid Century Corduroy Barrel Back Loveseat',2,false),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-4.webp','Mid Century Corduroy Barrel Back Loveseat',3,false),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-3.webp','Mid Century Corduroy Barrel Back Loveseat',4,false),
  ('mid-century-corduroy-barrel-back-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mid-century-corduroy-barrel-back-loveseat-2.webp','Mid Century Corduroy Barrel Back Loveseat',5,false),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-1.webp','Provence Chesterfield Tufted Loveseat',0,true),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-4.webp','Provence Chesterfield Tufted Loveseat',1,false),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-5.webp','Provence Chesterfield Tufted Loveseat',2,false),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-6.webp','Provence Chesterfield Tufted Loveseat',3,false),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-2.webp','Provence Chesterfield Tufted Loveseat',4,false),
  ('provence-chesterfield-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-provence-chesterfield-tufted-loveseat-3.webp','Provence Chesterfield Tufted Loveseat',5,false),
  ('sidwell-channel-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-sidwell-channel-tufted-wave-back-loveseat-1.webp','Sidwell Channel Tufted Loveseat',0,true),
  ('sidwell-channel-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-sidwell-channel-tufted-wave-back-loveseat-5.webp','Sidwell Channel Tufted Loveseat',1,false),
  ('sidwell-channel-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-sidwell-channel-tufted-wave-back-loveseat-4.webp','Sidwell Channel Tufted Loveseat',2,false),
  ('sidwell-channel-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-sidwell-channel-tufted-wave-back-loveseat-2.webp','Sidwell Channel Tufted Loveseat',3,false),
  ('sidwell-channel-tufted-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-sidwell-channel-tufted-wave-back-loveseat-3.webp','Sidwell Channel Tufted Loveseat',4,false),
  ('terren-farmhouse-linen-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-5.webp','Terren Farmhouse Linen Loveseat',0,true),
  ('terren-farmhouse-linen-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-1.webp','Terren Farmhouse Linen Loveseat',1,false),
  ('terren-farmhouse-linen-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-4.webp','Terren Farmhouse Linen Loveseat',2,false),
  ('terren-farmhouse-linen-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-3.webp','Terren Farmhouse Linen Loveseat',3,false),
  ('terren-farmhouse-linen-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-linen-loveseat-spindle-legs-2.webp','Terren Farmhouse Linen Loveseat',4,false),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-6.webp','Terren Farmhouse Loveseat',0,true),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-1.webp','Terren Farmhouse Loveseat',1,false),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-5.webp','Terren Farmhouse Loveseat',2,false),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-3.webp','Terren Farmhouse Loveseat',3,false),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-4.webp','Terren Farmhouse Loveseat',4,false),
  ('terren-farmhouse-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-terren-farmhouse-exposed-wood-loveseat-2.webp','Terren Farmhouse Loveseat',5,false),
  ('rattan-and-linen-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-rattan-linen-upholstered-loveseat-1.webp','Rattan and Linen Upholstered Loveseat',0,true),
  ('rattan-and-linen-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-rattan-linen-upholstered-loveseat-5.webp','Rattan and Linen Upholstered Loveseat',1,false),
  ('rattan-and-linen-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-rattan-linen-upholstered-loveseat-4.webp','Rattan and Linen Upholstered Loveseat',2,false),
  ('rattan-and-linen-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-rattan-linen-upholstered-loveseat-3.webp','Rattan and Linen Upholstered Loveseat',3,false),
  ('rattan-and-linen-upholstered-loveseat','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-rattan-linen-upholstered-loveseat-2.webp','Rattan and Linen Upholstered Loveseat',4,false),
  ('button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-fabric-chesterfield-2-seater-sofa-1.webp','Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs',0,true),
  ('button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-fabric-chesterfield-2-seater-sofa-5.webp','Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs',1,false),
  ('button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-fabric-chesterfield-2-seater-sofa-3.webp','Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs',2,false),
  ('button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-fabric-chesterfield-2-seater-sofa-4.webp','Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs',3,false),
  ('button-tufted-two-seater-sofa-with-rolled-arms-and-turned-wood-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-fabric-chesterfield-2-seater-sofa-2.webp','Button Tufted Two Seater Sofa with Rolled Arms and Turned Wood Legs',4,false),
  ('3-in-1-fabric-convertible-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-3-in-1-convertible-pull-out-sofa-bed-1.webp','3-in-1 Fabric Convertible Pull-Out Sofa Bed',0,true),
  ('3-in-1-fabric-convertible-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-3-in-1-convertible-pull-out-sofa-bed-2.webp','3-in-1 Fabric Convertible Pull-Out Sofa Bed',1,false),
  ('3-in-1-fabric-convertible-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-3-in-1-convertible-pull-out-sofa-bed-3.webp','3-in-1 Fabric Convertible Pull-Out Sofa Bed',2,false),
  ('3-in-1-fabric-convertible-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-3-in-1-convertible-pull-out-sofa-bed-4.webp','3-in-1 Fabric Convertible Pull-Out Sofa Bed',3,false),
  ('3-in-1-fabric-convertible-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-3-in-1-convertible-pull-out-sofa-bed-5.webp','3-in-1 Fabric Convertible Pull-Out Sofa Bed',4,false),
  ('velvet-tufted-futon-sofa-bed-with-gold-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-futon-sofa-bed-1.webp','Velvet Tufted Futon Sofa Bed with Gold Legs',0,true),
  ('velvet-tufted-futon-sofa-bed-with-gold-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-futon-sofa-bed-2.webp','Velvet Tufted Futon Sofa Bed with Gold Legs',1,false),
  ('velvet-tufted-futon-sofa-bed-with-gold-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-futon-sofa-bed-3.webp','Velvet Tufted Futon Sofa Bed with Gold Legs',2,false),
  ('velvet-tufted-futon-sofa-bed-with-gold-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-futon-sofa-bed-4.webp','Velvet Tufted Futon Sofa Bed with Gold Legs',3,false),
  ('velvet-tufted-futon-sofa-bed-with-gold-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-velvet-futon-sofa-bed-5.webp','Velvet Tufted Futon Sofa Bed with Gold Legs',4,false),
  ('corduroy-rounded-2-in-1-foldable-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-2-in-1-foldable-sofa-bed-1.webp','Corduroy Rounded 2-in-1 Foldable Sofa Bed',0,true),
  ('corduroy-rounded-2-in-1-foldable-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-2-in-1-foldable-sofa-bed-2.webp','Corduroy Rounded 2-in-1 Foldable Sofa Bed',1,false),
  ('corduroy-rounded-2-in-1-foldable-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-2-in-1-foldable-sofa-bed-3.webp','Corduroy Rounded 2-in-1 Foldable Sofa Bed',2,false),
  ('corduroy-rounded-2-in-1-foldable-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-2-in-1-foldable-sofa-bed-4.webp','Corduroy Rounded 2-in-1 Foldable Sofa Bed',3,false),
  ('corduroy-rounded-2-in-1-foldable-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-2-in-1-foldable-sofa-bed-5.webp','Corduroy Rounded 2-in-1 Foldable Sofa Bed',4,false),
  ('2-in-1-scandinavian-fabric-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-lofka-2-in-1-convertible-futon-sofa-bed-1.webp','2-in-1 Scandinavian Fabric Futon Sofa Bed',0,true),
  ('2-in-1-scandinavian-fabric-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-lofka-2-in-1-convertible-futon-sofa-bed-2.webp','2-in-1 Scandinavian Fabric Futon Sofa Bed',1,false),
  ('2-in-1-scandinavian-fabric-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-lofka-2-in-1-convertible-futon-sofa-bed-3.webp','2-in-1 Scandinavian Fabric Futon Sofa Bed',2,false),
  ('2-in-1-scandinavian-fabric-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-lofka-2-in-1-convertible-futon-sofa-bed-4.webp','2-in-1 Scandinavian Fabric Futon Sofa Bed',3,false),
  ('2-in-1-scandinavian-fabric-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-lofka-2-in-1-convertible-futon-sofa-bed-5.webp','2-in-1 Scandinavian Fabric Futon Sofa Bed',4,false),
  ('linen-convertible-single-sleeper-chair-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-linen-convertible-sleeper-1.webp','Linen Convertible Single Sleeper Chair Bed',0,true),
  ('linen-convertible-single-sleeper-chair-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-linen-convertible-sleeper-2.webp','Linen Convertible Single Sleeper Chair Bed',1,false),
  ('linen-convertible-single-sleeper-chair-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-linen-convertible-sleeper-3.webp','Linen Convertible Single Sleeper Chair Bed',2,false),
  ('linen-convertible-single-sleeper-chair-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-asofer-linen-convertible-sleeper-4.webp','Linen Convertible Single Sleeper Chair Bed',3,false),
  ('velvet-3-in-1-sleeper-sofa-bed-side-pockets','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-LKTART-3-in-1-convertible-sleeper-sofa-bed-1.webp','Velvet 3-in-1 Sleeper Sofa Bed Side Pockets',0,true),
  ('velvet-3-in-1-sleeper-sofa-bed-side-pockets','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-LKTART-3-in-1-convertible-sleeper-sofa-bed-2.webp','Velvet 3-in-1 Sleeper Sofa Bed Side Pockets',1,false),
  ('velvet-3-in-1-sleeper-sofa-bed-side-pockets','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-LKTART-3-in-1-convertible-sleeper-sofa-bed-3.webp','Velvet 3-in-1 Sleeper Sofa Bed Side Pockets',2,false),
  ('velvet-3-in-1-sleeper-sofa-bed-side-pockets','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-LKTART-3-in-1-convertible-sleeper-sofa-bed-4.webp','Velvet 3-in-1 Sleeper Sofa Bed Side Pockets',3,false),
  ('velvet-3-in-1-sleeper-sofa-bed-side-pockets','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-LKTART-3-in-1-convertible-sleeper-sofa-bed-5.webp','Velvet 3-in-1 Sleeper Sofa Bed Side Pockets',4,false),
  ('mid-century-faux-leather-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mopio-aaron-mid-century-modern-faux-leather-futon-1.webp','Mid Century Faux Leather Futon Sofa Bed',0,true),
  ('mid-century-faux-leather-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mopio-aaron-mid-century-modern-faux-leather-futon-2.webp','Mid Century Faux Leather Futon Sofa Bed',1,false),
  ('mid-century-faux-leather-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mopio-aaron-mid-century-modern-faux-leather-futon-3.webp','Mid Century Faux Leather Futon Sofa Bed',2,false),
  ('mid-century-faux-leather-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mopio-aaron-mid-century-modern-faux-leather-futon-4.webp','Mid Century Faux Leather Futon Sofa Bed',3,false),
  ('mid-century-faux-leather-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mopio-aaron-mid-century-modern-faux-leather-futon-5.webp','Mid Century Faux Leather Futon Sofa Bed',4,false),
  ('japandi-fabric-futon-sofa-bed-wood-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-george-oliver-kamaren-convertible-futon-sofa-1.webp','Japandi Fabric Futon Sofa Bed Wood Arms',0,true),
  ('japandi-fabric-futon-sofa-bed-wood-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-george-oliver-kamaren-convertible-futon-sofa-2.webp','Japandi Fabric Futon Sofa Bed Wood Arms',1,false),
  ('japandi-fabric-futon-sofa-bed-wood-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-george-oliver-kamaren-convertible-futon-sofa-3.webp','Japandi Fabric Futon Sofa Bed Wood Arms',2,false),
  ('japandi-fabric-futon-sofa-bed-wood-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-george-oliver-kamaren-convertible-futon-sofa-4.webp','Japandi Fabric Futon Sofa Bed Wood Arms',3,false),
  ('japandi-fabric-futon-sofa-bed-wood-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-george-oliver-kamaren-convertible-futon-sofa-5.webp','Japandi Fabric Futon Sofa Bed Wood Arms',4,false),
  ('corduroy-double-sofa-bed-chrome-side-handles','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mikasa-furniture-kiran-3-seater-double-corduroy-1.webp','Corduroy Double Sofa Bed Chrome Side Handles',0,true),
  ('corduroy-double-sofa-bed-chrome-side-handles','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mikasa-furniture-kiran-3-seater-double-corduroy-2.webp','Corduroy Double Sofa Bed Chrome Side Handles',1,false),
  ('corduroy-double-sofa-bed-chrome-side-handles','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mikasa-furniture-kiran-3-seater-double-corduroy-3.webp','Corduroy Double Sofa Bed Chrome Side Handles',2,false),
  ('corduroy-double-sofa-bed-chrome-side-handles','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-mikasa-furniture-kiran-3-seater-double-corduroy-4.webp','Corduroy Double Sofa Bed Chrome Side Handles',3,false),
  ('beige-fabric-pull-out-sofa-bed-with-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-beige-fabric-sofa-bed-1.webp','Beige Fabric Pull-Out Sofa Bed with Cushions',0,true),
  ('beige-fabric-pull-out-sofa-bed-with-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-beige-fabric-sofa-bed-2.webp','Beige Fabric Pull-Out Sofa Bed with Cushions',1,false),
  ('beige-fabric-pull-out-sofa-bed-with-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-beige-fabric-sofa-bed-3.webp','Beige Fabric Pull-Out Sofa Bed with Cushions',2,false),
  ('beige-fabric-pull-out-sofa-bed-with-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-beige-fabric-sofa-bed-4.webp','Beige Fabric Pull-Out Sofa Bed with Cushions',3,false),
  ('beige-fabric-pull-out-sofa-bed-with-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-beige-fabric-sofa-bed-5.webp','Beige Fabric Pull-Out Sofa Bed with Cushions',4,false),
  ('velvet-futon-sofa-bed-gold-base-rail-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-ACMEASE-70-velvet-futon-sofa-bed-1.webp','Velvet Futon Sofa Bed Gold Base Rail Legs',0,true),
  ('velvet-futon-sofa-bed-gold-base-rail-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-ACMEASE-70-velvet-futon-sofa-bed-2.webp','Velvet Futon Sofa Bed Gold Base Rail Legs',1,false),
  ('velvet-futon-sofa-bed-gold-base-rail-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-ACMEASE-70-velvet-futon-sofa-bed-3.webp','Velvet Futon Sofa Bed Gold Base Rail Legs',2,false),
  ('velvet-futon-sofa-bed-gold-base-rail-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-ACMEASE-70-velvet-futon-sofa-bed-4.webp','Velvet Futon Sofa Bed Gold Base Rail Legs',3,false),
  ('velvet-futon-sofa-bed-gold-base-rail-legs','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-ACMEASE-70-velvet-futon-sofa-bed-5.webp','Velvet Futon Sofa Bed Gold Base Rail Legs',4,false),
  ('chesterfield-velvet-sofa-bed-scroll-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-GDFStudio-chesterfield-velvet-pull-out-sofa-bed-1.webp','Chesterfield Velvet Sofa Bed Scroll Arms',0,true),
  ('chesterfield-velvet-sofa-bed-scroll-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-GDFStudio-chesterfield-velvet-pull-out-sofa-bed-2.webp','Chesterfield Velvet Sofa Bed Scroll Arms',1,false),
  ('chesterfield-velvet-sofa-bed-scroll-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-GDFStudio-chesterfield-velvet-pull-out-sofa-bed-3.webp','Chesterfield Velvet Sofa Bed Scroll Arms',2,false),
  ('chesterfield-velvet-sofa-bed-scroll-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-GDFStudio-chesterfield-velvet-pull-out-sofa-bed-4.webp','Chesterfield Velvet Sofa Bed Scroll Arms',3,false),
  ('boucle-modular-floor-sofa-bed-round-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-streamdale-furniture-modern-floor-sofa-1.webp','Boucle Modular Floor Sofa Bed Round Cushions',0,true),
  ('boucle-modular-floor-sofa-bed-round-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-streamdale-furniture-modern-floor-sofa-2.webp','Boucle Modular Floor Sofa Bed Round Cushions',1,false),
  ('boucle-modular-floor-sofa-bed-round-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-streamdale-furniture-modern-floor-sofa-3.webp','Boucle Modular Floor Sofa Bed Round Cushions',2,false),
  ('boucle-modular-floor-sofa-bed-round-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-streamdale-furniture-modern-floor-sofa-4.webp','Boucle Modular Floor Sofa Bed Round Cushions',3,false),
  ('boucle-modular-floor-sofa-bed-round-cushions','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-streamdale-furniture-modern-floor-sofa-5.webp','Boucle Modular Floor Sofa Bed Round Cushions',4,false),
  ('quilted-sleeper-sofa-bed-adjustable-backrest','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-simple-modern-small-sleeper-couch-1.webp','Quilted Sleeper Sofa Bed Adjustable Backrest',0,true),
  ('quilted-sleeper-sofa-bed-adjustable-backrest','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-simple-modern-small-sleeper-couch-2.webp','Quilted Sleeper Sofa Bed Adjustable Backrest',1,false),
  ('quilted-sleeper-sofa-bed-adjustable-backrest','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-simple-modern-small-sleeper-couch-3.webp','Quilted Sleeper Sofa Bed Adjustable Backrest',2,false),
  ('quilted-sleeper-sofa-bed-adjustable-backrest','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-simple-modern-small-sleeper-couch-4.webp','Quilted Sleeper Sofa Bed Adjustable Backrest',3,false),
  ('corduroy-sofa-bed-loveseat-with-cup-holders','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-modern-loveseat-1.webp','Corduroy Sofa Bed Loveseat with Cup Holders',0,true),
  ('corduroy-sofa-bed-loveseat-with-cup-holders','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-modern-loveseat-2.webp','Corduroy Sofa Bed Loveseat with Cup Holders',1,false),
  ('corduroy-sofa-bed-loveseat-with-cup-holders','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-modern-loveseat-3.webp','Corduroy Sofa Bed Loveseat with Cup Holders',2,false),
  ('corduroy-sofa-bed-loveseat-with-cup-holders','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-modern-loveseat-4.webp','Corduroy Sofa Bed Loveseat with Cup Holders',3,false),
  ('corduroy-sofa-bed-loveseat-with-cup-holders','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-corduroy-upholstered-modern-loveseat-5.webp','Corduroy Sofa Bed Loveseat with Cup Holders',4,false),
  ('faux-leather-tufted-convertible-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-acire-faux-leather-convertible-1.webp','Faux Leather Tufted Convertible Sofa Bed',0,true),
  ('faux-leather-tufted-convertible-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-acire-faux-leather-convertible-2.webp','Faux Leather Tufted Convertible Sofa Bed',1,false),
  ('faux-leather-tufted-convertible-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-acire-faux-leather-convertible-3.webp','Faux Leather Tufted Convertible Sofa Bed',2,false),
  ('faux-leather-tufted-convertible-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-acire-faux-leather-convertible-4.webp','Faux Leather Tufted Convertible Sofa Bed',3,false),
  ('faux-leather-tufted-convertible-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-acire-faux-leather-convertible-5.webp','Faux Leather Tufted Convertible Sofa Bed',4,false),
  ('gray-linen-channel-back-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-novogratz-brittany-linen-futon-sofa-bed-1.webp','Gray Linen Channel Back Futon Sofa Bed',0,true),
  ('gray-linen-channel-back-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-novogratz-brittany-linen-futon-sofa-bed-2.webp','Gray Linen Channel Back Futon Sofa Bed',1,false),
  ('gray-linen-channel-back-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-novogratz-brittany-linen-futon-sofa-bed-3.webp','Gray Linen Channel Back Futon Sofa Bed',2,false),
  ('gray-linen-channel-back-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-novogratz-brittany-linen-futon-sofa-bed-4.webp','Gray Linen Channel Back Futon Sofa Bed',3,false),
  ('gray-linen-channel-back-futon-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-novogratz-brittany-linen-futon-sofa-bed-5.webp','Gray Linen Channel Back Futon Sofa Bed',4,false),
  ('beige-faux-leather-sofa-bed-tufted-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-Lale-3-seater-beige-sofa-bed-1.webp','Beige Faux Leather Sofa Bed Tufted Arms',0,true),
  ('beige-faux-leather-sofa-bed-tufted-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-Lale-3-seater-beige-sofa-bed-2.webp','Beige Faux Leather Sofa Bed Tufted Arms',1,false),
  ('beige-faux-leather-sofa-bed-tufted-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-Lale-3-seater-beige-sofa-bed-3.webp','Beige Faux Leather Sofa Bed Tufted Arms',2,false),
  ('beige-faux-leather-sofa-bed-tufted-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-Lale-3-seater-beige-sofa-bed-4.webp','Beige Faux Leather Sofa Bed Tufted Arms',3,false),
  ('beige-faux-leather-sofa-bed-tufted-arms','https://comfyclub.pk/wp-content/uploads/2026/05/comfyclub-Lale-3-seater-beige-sofa-bed-5.webp','Beige Faux Leather Sofa Bed Tufted Arms',4,false),
  ('ivory-convertible-loveseat-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/Ivory-convertible-loveseat-pull-out-sofa-bed-1.webp','Ivory Convertible Loveseat Pull-Out Sofa Bed',0,true),
  ('ivory-convertible-loveseat-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/Ivory-convertible-loveseat-pull-out-sofa-bed-2.webp','Ivory Convertible Loveseat Pull-Out Sofa Bed',1,false),
  ('ivory-convertible-loveseat-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/Ivory-convertible-loveseat-pull-out-sofa-bed-4.webp','Ivory Convertible Loveseat Pull-Out Sofa Bed',2,false),
  ('ivory-convertible-loveseat-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/Ivory-convertible-loveseat-pull-out-sofa-bed-5.webp','Ivory Convertible Loveseat Pull-Out Sofa Bed',3,false),
  ('ivory-convertible-loveseat-pull-out-sofa-bed','https://comfyclub.pk/wp-content/uploads/2026/05/Ivory-convertible-loveseat-pull-out-sofa-bed-3.webp','Ivory Convertible Loveseat Pull-Out Sofa Bed',4,false)
) AS v(slug,url,alt,ord,prim)
JOIN products p ON p.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);

INSERT INTO settings (key, value) VALUES
  ('business_info','{"name": "ComfyClub", "phone": "03394100052", "email": "comfyclub.pk@gmail.com", "address": "Jan Muhammad Road, Nawab Town, Lahore", "coordinates": "31.4503,74.2466", "hours": "8:00 AM \u2013 9:00 PM"}'::jsonb),
  ('social_links','{"facebook": "https://www.facebook.com/comfyclublahore/", "instagram": "https://www.instagram.com/comfyclub.pk/", "tiktok": "https://www.tiktok.com/@comfyclub.pk", "linkedin": "https://www.linkedin.com/company/comfyclub/", "youtube": "https://www.youtube.com/@comfyclublahore"}'::jsonb),
  ('whatsapp_templates','{"order": "Hi, I''d like to order {product_name} ({sku}). Please share availability and delivery details.", "quote": "Hi, I''d like a price quote for {product_name}.", "consultation": "Hi, I''d like a consultation about {product_name}.", "general": "Hi, I''d like to know more about your furniture collection."}'::jsonb),
  ('ga4_id','""'::jsonb),
  ('gtm_id','""'::jsonb),
  ('search_console_property','"https://comfyclub.pk"'::jsonb),
  ('homepage_config','{"section_order": ["hero", "trusted_by", "categories", "trending", "offers", "why", "how_it_works", "cta"], "hero_slides": [], "trusted_by": [], "pinned_trending": [], "pinned_offers": [], "why_items": [], "how_steps": []}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO pages (title, slug, type, content, status) VALUES
  ('Contact Us','/contact-us/','core','<p>Contact Us content — edit from the dashboard.</p>','published'),
  ('About Us','/about-us/','core','<p>About Us content — edit from the dashboard.</p>','published'),
  ('Shipping & Delivery Policy','/shipping-and-delivery-policy/','policy','<p>Shipping & Delivery Policy content — edit from the dashboard.</p>','published'),
  ('Returns & Refunds Policy','/returns-and-refunds-policy/','policy','<p>Returns & Refunds Policy content — edit from the dashboard.</p>','published'),
  ('Privacy Policy','/privacy-policy/','policy','<p>Privacy Policy content — edit from the dashboard.</p>','published'),
  ('Terms & Conditions','/terms-and-conditions/','policy','<p>Terms & Conditions content — edit from the dashboard.</p>','published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO redirects (source_url, target_url, type, is_active) VALUES
  ('/cart/','/',301,true),
  ('/shop/','/sofas/',301,true),
  ('/portfolio/','/about-us/',301,true)
ON CONFLICT (source_url) DO NOTHING;
