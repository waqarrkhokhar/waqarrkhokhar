INSERT INTO settings (key, value)
VALUES ('custom_schemas', jsonb_build_array(

  jsonb_build_object(
    'id','org','name','Organization','type','Organization','enabled',true,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','Organization',
      'name','ComfyClub',
      'url','https://comfyclub.pk',
      'logo','https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1782489600564-u6d9pn.webp',
      'email','comfyclub.pk@gmail.com',
      'telephone','+923394100052',
      'description','ComfyClub crafts custom, handcrafted sofas and furniture to order at its Lahore workshop, with delivery across Pakistan.',
      'sameAs',jsonb_build_array(
        'https://www.facebook.com/comfyclublahore/',
        'https://www.instagram.com/comfyclub.pk/',
        'https://www.tiktok.com/@comfyclub.pk',
        'https://www.linkedin.com/company/comfyclub/',
        'https://www.youtube.com/@comfyclublahore'
      )
    ))::text
  ),

  jsonb_build_object(
    'id','localbusiness','name','LocalBusiness (Furniture Store)','type','FurnitureStore','enabled',true,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','FurnitureStore',
      'name','ComfyClub',
      'image','https://nycfgqrilqvwsugbksev.supabase.co/storage/v1/object/public/media/1782489600564-u6d9pn.webp',
      'url','https://comfyclub.pk',
      'telephone','+923394100052',
      'email','comfyclub.pk@gmail.com',
      'priceRange','$$',
      'currenciesAccepted','PKR',
      'address',jsonb_build_object(
        '@type','PostalAddress',
        'streetAddress','Al Jannat Street, Nasirabad Road, Behind Shell Fuel Station, Al Hamra Town',
        'addressLocality','Lahore',
        'addressRegion','Punjab',
        'postalCode','54000',
        'addressCountry','PK'
      ),
      'geo',jsonb_build_object('@type','GeoCoordinates','latitude',31.45294157968887,'longitude',74.2547213022145),
      'areaServed','PK',
      'openingHoursSpecification',jsonb_build_array(jsonb_build_object(
        '@type','OpeningHoursSpecification',
        'dayOfWeek',jsonb_build_array('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
        'opens','08:00','closes','21:00'
      )),
      'sameAs',jsonb_build_array(
        'https://www.facebook.com/comfyclublahore/',
        'https://www.instagram.com/comfyclub.pk/',
        'https://www.tiktok.com/@comfyclub.pk',
        'https://www.linkedin.com/company/comfyclub/',
        'https://www.youtube.com/@comfyclublahore'
      )
    ))::text
  ),

  jsonb_build_object(
    'id','website','name','WebSite','type','WebSite','enabled',true,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','WebSite',
      'name','ComfyClub',
      'url','https://comfyclub.pk',
      'inLanguage','en-PK',
      'publisher',jsonb_build_object('@type','Organization','name','ComfyClub','url','https://comfyclub.pk')
    ))::text
  ),

  jsonb_build_object(
    'id','service','name','Service (Custom Furniture)','type','Service','enabled',true,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','Service',
      'serviceType','Custom furniture manufacturing',
      'provider',jsonb_build_object('@type','Organization','name','ComfyClub','url','https://comfyclub.pk'),
      'areaServed','PK',
      'description','Custom, handcrafted sofas and furniture made to order in Lahore. Choose your fabric, colour and size, with delivery across Pakistan.'
    ))::text
  ),

  jsonb_build_object(
    'id','breadcrumb','name','BreadcrumbList (page-specific - keep OFF)','type','BreadcrumbList','enabled',false,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','BreadcrumbList',
      'itemListElement',jsonb_build_array(
        jsonb_build_object('@type','ListItem','position',1,'name','Home','item','https://comfyclub.pk'),
        jsonb_build_object('@type','ListItem','position',2,'name','Sofas','item','https://comfyclub.pk/sofas/')
      )
    ))::text
  ),

  jsonb_build_object(
    'id','faqpage','name','FAQPage (page-specific - keep OFF)','type','FAQPage','enabled',false,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','FAQPage',
      'mainEntity',jsonb_build_array(jsonb_build_object(
        '@type','Question','name','Do you deliver across Pakistan?',
        'acceptedAnswer',jsonb_build_object('@type','Answer','text','Yes, we deliver handcrafted furniture across all major cities in Pakistan.')
      ))
    ))::text
  ),

  jsonb_build_object(
    'id','collectionpage','name','CollectionPage (page-specific - keep OFF)','type','CollectionPage','enabled',false,
    'json',(jsonb_build_object(
      '@context','https://schema.org','@type','CollectionPage',
      'name','Sofas','url','https://comfyclub.pk/sofas/'
    ))::text
  )

))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

SELECT jsonb_array_length(value) AS schemas_added,
       (SELECT count(*) FROM jsonb_array_elements(value) e WHERE (e->>'enabled')::boolean) AS live
FROM settings WHERE key = 'custom_schemas';
