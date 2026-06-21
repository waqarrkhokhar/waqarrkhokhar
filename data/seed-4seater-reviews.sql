-- 4 Seater Sofas reviews + enforce a 4.3 minimum rating on the 3 & 4 seater
-- collections. Safe to run multiple times. Run in Supabase → SQL Editor.
-- Note: only touches the 3-seater and 4-seater collections, never your other
-- (real) product reviews.

-- ── 1. Seed unique reviews for 4 Seater products (only those with none) ──
DO $$
DECLARE
  prod RECORD;
  n int;
  names text[] := ARRAY[
    'Adnan S.','Waqas A.','Bilawal R.','Shoaib K.','Asad M.','Furqan T.','Naveed A.',
    'Yasir K.','Salman R.','Arsalan M.','Umar F.','Raheel S.','Danish K.','Moazzam A.',
    'Sheraz M.','Khurram J.','Zeeshan A.','Fahad R.','Waleed K.','Adeel M.',
    'Nida A.','Zara K.','Mahnoor S.','Saba R.','Aqsa M.','Laiba K.','Eman S.','Hina R.',
    'Kiran A.','Mahira K.','Sumbal R.','Javeria M.','Tooba K.','Maham S.','Warda A.','Aiman R.'
  ];
  cities text[] := ARRAY[
    'Lahore','Lahore','Lahore','Lahore','Lahore','Lahore',
    'Islamabad','Islamabad','Islamabad','Islamabad','Islamabad',
    'Rawalpindi','Karachi','Faisalabad','Multan','Gujranwala','Sialkot','Abbottabad'
  ];
  ratings int[] := ARRAY[5,5,5,5,4,5,4,5,4,5];
  counts int[] := ARRAY[3,3,4,3,4,4,3,4,5,3,4,6,5,4,3];
  texts text[] := ARRAY[
    'Big enough for the whole family and still looks elegant.',
    'Spacious seating, the kids and I fit easily. Love it.',
    'Great for our large drawing room and feels solid.',
    'Plenty of room and the cushions are nice and firm.',
    'Perfect family sofa, comfortable for long evenings.',
    'Generous size without looking bulky. Well balanced.',
    'Seats four comfortably, exactly what we needed.',
    'The build quality is excellent for the size.',
    'Roomy and plush. Our guests are always comfortable.',
    'Fills the lounge nicely and the finish is top notch.',
    'Sturdy even with everyone sitting at once.',
    'Lovely large sofa, the fabric is soft and warm.',
    'We wanted something big for movie nights and this is it.',
    'Excellent value for such a large piece.',
    'Frame feels very strong, no creaks at all.',
    'Delivered to Lahore and set up without any fuss.',
    'Roomy seats and a clean modern look.',
    'The whole family approves. Very comfortable.',
    'Big, comfy and beautifully stitched.',
    'Handles daily family use really well.',
    'Spacious and supportive, great for tall people.',
    'A proper family sized sofa, very happy with it.',
    'The colour is gorgeous and it seats everyone.',
    'Comfortable depth and the back support is great.',
    'Solid wood base, you can feel the quality.',
    'Looks luxurious in our living room.',
    'Plenty of space and the foam is nice and dense.',
    'Worth it for a growing family, lots of room.',
    'Delivered to Islamabad on time and well packed.',
    'Big and cosy, the kids love piling on.',
    'Premium feel and a generous seat.',
    'Exactly the size we measured for. Fits great.',
    'Comfortable for guests and easy to maintain.',
    'The stitching and piping are very neat.',
    'A statement piece, large but tasteful.',
    'Holds its shape well even with heavy use.',
    'Very roomy, our family of five fits easily.',
    'Strong frame and soft, deep cushions.',
    'Great craftsmanship for a sofa this size.',
    'Spacious and stylish, exactly as pictured.',
    'The fabric feels durable and looks rich.',
    'Comfortable seating for the whole drawing room.',
    'Sturdy, roomy and well finished.',
    'Made to our colour choice and it looks superb.',
    'Excellent for entertaining guests.',
    'Comfortable and the size is just right for us.',
    'Solid, spacious and worth the price.',
    'A lovely big sofa that anchors the room.',
    'Family approved, very comfortable and roomy.',
    'Deep seats and a strong build, highly recommend.'
  ];
BEGIN
  FOR prod IN
    SELECT p.id
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE (c.slug = '/seater-sofas/4-seater-sofas/' OR c.name ILIKE '4 Seater%')
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

-- ── 2. Enforce a 4.3 minimum average on 3 & 4 seater products ──
DO $$
DECLARE
  prod RECORD;
  cur numeric;
  rid uuid;
BEGIN
  FOR prod IN
    SELECT p.id
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE (c.slug IN ('/seater-sofas/3-seater-sofas/', '/seater-sofas/4-seater-sofas/')
           OR c.name ILIKE '3 Seater%' OR c.name ILIKE '4 Seater%')
      AND p.deleted_at IS NULL
  LOOP
    LOOP
      SELECT AVG(rating) INTO cur FROM reviews
      WHERE product_id = prod.id AND status = 'approved' AND deleted_at IS NULL;
      EXIT WHEN cur IS NULL OR cur >= 4.3;
      SELECT id INTO rid FROM reviews
      WHERE product_id = prod.id AND status = 'approved' AND deleted_at IS NULL AND rating < 5
      ORDER BY rating ASC, random() LIMIT 1;
      EXIT WHEN rid IS NULL;
      UPDATE reviews SET rating = rating + 1 WHERE id = rid;
    END LOOP;
  END LOOP;
END $$;

-- ── 3. Update the rating badges ──
REFRESH MATERIALIZED VIEW product_ratings;
