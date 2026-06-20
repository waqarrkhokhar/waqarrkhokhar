-- Reviews for the newly live "3 Seater Sofas" collection.
-- Adds 3-4 (max 6) short, natural, unique reviews per product, weighted to
-- Lahore/Islamabad, with realistic 3-5 star ratings (avg ~4.3). Idempotent:
-- only products that currently have NO reviews are seeded. Run in Supabase.

DO $$
DECLARE
  prod RECORD;
  n int;
  names text[] := ARRAY[
    'Ahmed R.','Bilal K.','Hamza S.','Usman T.','Ali R.','Faizan M.','Hassan A.',
    'Zain U.','Saad N.','Daniyal K.','Tariq J.','Imran S.','Kamran A.','Nabeel R.',
    'Junaid M.','Shahzaib K.','Rizwan A.','Owais M.','Talha S.','Hamid R.',
    'Ayesha K.','Sana M.','Hira T.','Maryam R.','Fatima N.','Iqra S.','Noor A.',
    'Amna K.','Rabia H.','Sadia M.','Mehwish A.','Komal S.','Areeba N.','Huda K.',
    'Bushra J.','Anum R.'
  ];
  cities text[] := ARRAY[
    'Lahore','Lahore','Lahore','Lahore','Lahore','Lahore',
    'Islamabad','Islamabad','Islamabad','Islamabad','Islamabad',
    'Rawalpindi','Karachi','Faisalabad','Multan','Gujranwala','Sialkot','Peshawar'
  ];
  ratings int[] := ARRAY[5,5,5,4,4,4,5,3,4,5,4,3];
  counts int[] := ARRAY[3,3,4,3,4,4,3,4,5,3,4,6,5,4,3];
  texts text[] := ARRAY[
    'Really comfortable and the fabric feels premium. Delivered to Lahore in good time.',
    'Sturdy frame and neat stitching. Happy with the finish.',
    'Looks even better in person. The colour matched what I picked.',
    'Worth the wait. Made exactly to the size we asked for.',
    'Seating is firm but cosy. The family loves it.',
    'Good quality for the price. Would order again.',
    'The wood legs are solid, not the flimsy kind. Very pleased.',
    'Ordered over WhatsApp and the team guided me through the fabric options.',
    'Fits our lounge perfectly. Compact but roomy enough for three.',
    'Delivery to Islamabad was smooth and the packing was proper.',
    'Cushions hold their shape well after a few weeks of use.',
    'Classy design. Guests keep asking where we got it.',
    'Comfortable back support, easy to relax on after work.',
    'Exactly as shown in the pictures. No surprises.',
    'Soft fabric and a deep seat. Great for movie nights.',
    'The tufting looks premium and feels well made.',
    'Took a little over three weeks but the quality made up for it.',
    'Solid build and the colour is rich. Recommended.',
    'Very happy with the craftsmanship and clean finishing.',
    'Roomy and supportive. Perfect for our drawing room.',
    'Good communication and the sofa arrived without any damage.',
    'Fabric is easy to clean, which is a big plus with kids.',
    'Elegant piece. It lifts the whole room.',
    'Comfort is on point. Does not sink in like cheaper ones.',
    'Reasonable price and a proper hardwood frame.',
    'The team customised the size for our space. Much appreciated.',
    'Stylish and sturdy. Exactly what we wanted.',
    'Arrived in Lahore on the promised date. Smooth process.',
    'Seat height is just right, comfortable for tall folks too.',
    'Beautiful colour and the stitching is even throughout.',
    'Great value. Feels far more expensive than it cost.',
    'We use it daily and it has held up really well.',
    'Looks modern and the cushions are nice and plush.',
    'Friendly service and a well finished product.',
    'The fabric feels durable, not thin at all.',
    'Perfect size for a small lounge and very comfy.',
    'Happy customer. The finish is clean and premium.',
    'Ordered for our bedroom corner and it fits beautifully.',
    'Comfortable and good looking. No complaints.',
    'The legs are properly fixed and very stable.',
    'Picked a custom colour and it turned out lovely.',
    'Strong frame and soft seating. Best of both.',
    'Delivery to Islamabad was quick and careful.',
    'Neat work. You can tell it is handmade.',
    'Cosy and well padded. Worth every rupee.',
    'Matches our interior nicely. Very satisfied.',
    'Good back support and the fabric breathes well in summer.',
    'Smooth ordering on WhatsApp and timely delivery.',
    'The seat is deep and comfortable. Love it.',
    'Quality is solid and the design is timeless.',
    'Compact yet comfortable. Ideal for apartments.',
    'Lovely texture and a very sturdy base.',
    'Premium feel without the premium price tag.',
    'Comfortable for long sittings. Highly recommend.',
    'The colour is exactly as on the site. Very happy.'
  ];
BEGIN
  FOR prod IN
    SELECT p.id
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE (c.slug = '/seater-sofas/3-seater-sofas/' OR c.name ILIKE '3 Seater%')
      AND p.deleted_at IS NULL
      AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.product_id = p.id AND r.deleted_at IS NULL)
  LOOP
    n := counts[1 + floor(random() * array_length(counts, 1))::int];
    INSERT INTO reviews (product_id, name, city, rating, text, status, created_at)
    SELECT prod.id,
           names[1 + floor(random() * array_length(names, 1))::int],
           cities[1 + floor(random() * array_length(cities, 1))::int],
           ratings[1 + floor(random() * array_length(ratings, 1))::int],
           t,
           'approved',
           now() - (floor(random() * 150)::int) * interval '1 day'
    FROM (SELECT t FROM unnest(texts) AS t ORDER BY random() LIMIT n) sub;
  END LOOP;
END $$;

-- Update the rating badges (avg + count) for the storefront cards/pages.
REFRESH MATERIALIZED VIEW product_ratings;
