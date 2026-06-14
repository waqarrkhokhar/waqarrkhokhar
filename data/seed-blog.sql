-- ComfyClub — 3 sample blog posts (filler), published but noindex.
-- Safe to re-run. Adds the robots column if missing.
BEGIN;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS robots TEXT DEFAULT 'index, follow';

DELETE FROM blog_posts WHERE slug IN (
  'how-to-choose-the-perfect-sofa-for-your-drawing-room',
  'interior-design-trends-pakistani-homes-2026',
  'velvet-vs-linen-which-fabric-is-right'
);

INSERT INTO blog_posts (title, slug, content, excerpt, category, featured_image, author, status, robots, published_at, created_at) VALUES
  ('How to Choose the Perfect Sofa for Your Drawing Room','how-to-choose-the-perfect-sofa-for-your-drawing-room','Choosing a sofa is one of the most important furniture decisions you''ll make. It''s where your family gathers, where guests sit, and where you unwind after a long day. In Pakistani homes, the drawing room sofa is the centrepiece of hospitality.

## 1. Measure Your Space First
Before falling in love with a design, measure your drawing room carefully. Account for doorways, walking paths, and other furniture. A sofa that''s too large will make the room feel cramped, while one that''s too small will look lost.

## 2. Choose the Right Size
For smaller rooms, a 2-seater or loveseat works beautifully. Larger drawing rooms can accommodate 3-seater sofas or even L-shaped configurations. Consider how many people typically use the room.

## 3. Pick Your Fabric Wisely
Velvet adds luxury and richness, perfect for air-conditioned drawing rooms. Linen is breathable and ideal for warmer climates. Boucle offers a modern textured look that hides minor wear well.

## 4. Frame Quality Matters
Always ask about the internal frame. At ComfyClub, we use solid hardwood frames that last decades. Avoid sofas with particleboard or metal frames as they warp and break with regular use.

## 5. Test the Cushion Comfort
High-density foam cushioning provides the best balance of comfort and durability. It holds its shape over years of daily use. Softer foams feel nice initially but flatten quickly.','Finding the right sofa is about more than just looks. We break down size, fabric, and style considerations for Pakistani homes.','Buying Guides','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-armless-tufted-velvet-accent-chair-1.webp','Admin','published','noindex, follow', now() - interval '5 days', now() - interval '5 days'),
  ('5 Interior Design Trends Transforming Pakistani Homes in 2026','interior-design-trends-pakistani-homes-2026','Pakistani interior design is evolving rapidly. Homeowners are moving away from heavy, ornate furniture towards cleaner, more contemporary pieces that still feel warm and inviting.

## 1. Boucle and Textured Fabrics
Boucle fabric has taken the design world by storm. Its soft, looped texture adds visual interest and a cosy feel. We''re seeing boucle accent chairs and sofas in drawing rooms across Lahore and Islamabad.

## 2. Warm Earth Tones
Cool greys are giving way to warm creams, taupes, and terracotta. These colours create a welcoming atmosphere that suits Pakistani hospitality culture perfectly.

## 3. Curved Silhouettes
Sharp angles are out; gentle curves are in. Barrel chairs, rounded sofas, and scalloped backs bring softness to living spaces.

## 4. Multi-Functional Furniture
With apartment living growing in cities like Karachi and Lahore, convertible sofa beds and storage ottomans are becoming essential. Function meets luxury.

## 5. Handcrafted and Local
There''s growing pride in locally made furniture. Consumers are choosing quality Pakistani craftsmanship over mass-produced imports.','From boucle textures to warm earth tones, these are the trends we''re seeing across Lahore, Karachi, and Islamabad.','Interior Design','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-boucle-tufted-upholstered-loveseat.4.webp','Admin','published','noindex, follow', now() - interval '12 days', now() - interval '12 days'),
  ('Velvet vs Linen: Which Fabric is Right for Your Climate?','velvet-vs-linen-which-fabric-is-right','One of the most common questions we get at ComfyClub is: should I go with velvet or linen? The answer depends on your climate, lifestyle, and personal preference.

## Velvet: The Luxury Choice
Velvet is rich, luxurious, and surprisingly durable. Modern performance velvets are stain-resistant and easy to clean. Velvet works best in air-conditioned rooms and during winter months. It''s our most popular fabric choice in Lahore and Islamabad.

## Linen: The Breathable Option
Linen is lightweight, breathable, and naturally hypoallergenic. It''s perfect for warmer climates like Karachi and Multan. Linen develops a beautiful patina over time, becoming softer with each use.

## Our Recommendation
If you have air conditioning and want a formal look, choose velvet. If you prefer a casual, airy feel, go with linen. Both fabrics are available across our entire sofa collection.','Pakistan''s varied climate means fabric choice matters. We compare durability, comfort, and maintenance for both options.','Furniture Care','https://comfyclub.pk/wp-content/uploads/2026/04/comfyclub-fabric-upholstered-dining-chair-with-arms-2.webp','Admin','published','noindex, follow', now() - interval '20 days', now() - interval '20 days');

COMMIT;
