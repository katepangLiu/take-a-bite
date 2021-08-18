# PageSpeed

host:

https://developers.google.com/speed

https://www.modpagespeed.com/

slide:

https://www.slideshare.net/igrigorik/pagespeed-what-why-and-how-it-works

video:

[Make the Web Fast: Automagic site optimization with mod_pagespeed 1.0!](https://www.youtube.com/watch?v=6uCAdQSHhmA&ab_channel=GoogleDevelopers)

books:

High Performance Web Sites
Even Faster Web Sites

## Why

- Tradeoff:  speed render &  speed deploy 
- Speed Optimize JIT  

## What

- Server-independent lib:  
  - [PageSpeed Optimization Libraries(PSOL)](https://developers.google.com/speed/pagespeed/psol)
- Http Server module  https://www.modpagespeed.com/
  - [Apache](https://github.com/apache/incubator-pagespeed-mod)
  - [Nginx](https://github.com/apache/incubator-pagespeed-ngx)
  - [Envoy](https://github.com/apache/incubator-pagespeed-mod/tree/master/pagespeed/envoy)  
- Page Speed Test
  - [webpagetest](https://www.webpagetest.org/)
  - [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

## How

### Principles

- Automatic Image Compression & Resizing
- Minify CSS, JavaScript and HTML
- Inline small images, CSS, and JavaScript
- Cache Extension
- Defer JavaScript
- CSS/JavaScript Combining
- Domain Mapping
- Domain Sharding
- ...

### Examples:

- Images
  - Render-based Resize
  - ?
  - Image Format: WebP
- HTML
  - Collapse Whitespace
- CSS
  - Combining multiple CSS files
    - Served with 1-year TTL
    - 
- JavaScript



