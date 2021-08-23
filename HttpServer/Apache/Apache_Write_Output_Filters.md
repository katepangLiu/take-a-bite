# How to write Apache output filters

## buckets brigade

Each time a filter is invoked, is passed a bucket brigade, containing a sequence of buckets.

`a bucket brigade: a doubly-linked list of buckets`

Bucket types:

- Metadata
  - EOS
    - indicates that the end of the response has been reached
  - FLUSH
    - indicates that the filter should flush any buffered buckets (if applicable) down the filter chain immediately.
    - Filters can create `FLUSH` buckets and pass these down the filter chain if desired
    - passing any pending or buffered buckets down the filter chain
- Data
  - HEAP
  - FILE  ( data stored in a file on disk)
  - PIPE
  - TRANCIENT
  - ...

```shell
# Example bucket brigade
# MetaData buckets: FLUSH EOS
# Data buckets:HEAP, FILE
HEAP FLUSH FILE EOS
```



## examples

### mod_txt

http://apache.webthing.com/mod_txt/

```c
/*
         Copyright (c) 2004, WebThing Ltd
         Author: Nick Kew <nick@webthing.com>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

*/
/*      Note to Users

        You are requested to register as a user, at
        http://apache.webthing.com/registration.html

        This entitles you to support from the developer.
        I'm unlikely to reply to help/support requests from
        non-registered users, unless you're paying and/or offering
        constructive feedback such as bug reports or sensible
        suggestions for further development.

        It also makes a small contribution to the effort
        that's gone into developing this work.
*/

#include <httpd.h>
#include <http_config.h>
#include <util_filter.h>

module AP_MODULE_DECLARE_DATA txt_module;

typedef struct
{
  const char *header;
  const char *footer;
} txt_dir_cfg;

typedef struct
{
  apr_bucket *head;
  apr_bucket *foot;
  unsigned int state;
} txt_ctxt;

static const char *txt_name = "text-filter";

#define TXT_HEAD 0x01
#define TXT_FOOT 0x02

/* Per-dir config initialisation */
static void *txt_config(apr_pool_t *pool, char *x)
{
  return apr_pcalloc(pool, sizeof(txt_dir_cfg));
}

static void *txt_merge(apr_pool_t *pool, void *BASE, void *ADD)
{
  txt_dir_cfg *base = (txt_dir_cfg *)BASE;
  txt_dir_cfg *add = (txt_dir_cfg *)ADD;
  txt_dir_cfg *conf = apr_palloc(pool, sizeof(txt_dir_cfg));

  conf->header = add->header ? add->header : base->header;
  conf->footer = add->footer ? add->footer : base->footer;
  return conf;
}

static apr_bucket *txt_file_bucket(request_rec *r, const char *fname)
{
  apr_file_t *file = NULL;
  apr_finfo_t finfo;
  if (apr_stat(&finfo, fname, APR_FINFO_SIZE, r->pool) != APR_SUCCESS)
  {
    return NULL;
  }
  if (apr_file_open(&file, fname, APR_READ | APR_SHARELOCK | APR_SENDFILE_ENABLED,
                    APR_OS_DEFAULT, r->pool) != APR_SUCCESS)
  {
    return NULL;
  }
  if (!file)
  {
    return NULL;
  }
  return apr_bucket_file_create(file, 0, finfo.size, r->pool,
                                r->connection->bucket_alloc);
}

static int txt_filter_init(ap_filter_t *f)
{
  txt_ctxt *ctxt = f->ctx = apr_palloc(f->r->pool, sizeof(txt_ctxt));
  txt_dir_cfg *conf = ap_get_module_config(f->r->per_dir_config, &txt_module);

  ctxt->head = txt_file_bucket(f->r, conf->header);
  ctxt->foot = txt_file_bucket(f->r, conf->footer);
  return OK;
}

static apr_bucket *txt_esc(char c, apr_bucket_alloc_t *alloc)
{
  switch (c)
  {
  case '<':
    return apr_bucket_transient_create("&lt;", 4, alloc);
  case '>':
    return apr_bucket_transient_create("&gt;", 4, alloc);
  case '&':
    return apr_bucket_transient_create("&amp;", 5, alloc);
  case '"':
    return apr_bucket_transient_create("&quot;", 6, alloc);
  default:
    return NULL;
  }
}

static int txt_filter(ap_filter_t *f, apr_bucket_brigade *bb)
{
  apr_bucket *b;
  txt_ctxt *ctxt = (txt_ctxt *)f->ctx;

  if (ctxt == NULL)
  {
    txt_filter_init(f);
    ctxt = f->ctx;
  }

  for (b = APR_BRIGADE_FIRST(bb);
       b != APR_BRIGADE_SENTINEL(bb);
       b = APR_BUCKET_NEXT(b))
  {

    const char *buf;
    size_t bytes;
    if (APR_BUCKET_IS_EOS(b))
    {
      /* end of input file - insert footer if any */
      if (ctxt->foot && !(ctxt->state & TXT_FOOT))
      {
        ctxt->state |= TXT_FOOT;
        APR_BUCKET_INSERT_BEFORE(b, ctxt->foot);
      }
    }
    else if (apr_bucket_read(b, &buf, &bytes, APR_BLOCK_READ) == APR_SUCCESS)
    {
      /* We have a bucket full of text.  Just escape it where necessary */
      size_t count = 0;
      const char *p = buf;
      while (count < bytes)
      {
        size_t sz = strcspn(p, "<>&\"");
        count += sz;
        if (count < bytes)
        {
          apr_bucket_split(b, sz);
          b = APR_BUCKET_NEXT(b);
          APR_BUCKET_INSERT_BEFORE(b, txt_esc(p[sz],
                                              f->r->connection->bucket_alloc));
          apr_bucket_split(b, 1);
          APR_BUCKET_REMOVE(b);
          b = APR_BUCKET_NEXT(b);
          count += 1;
          p += sz + 1;
        }
      }
    }
  }

  if (ctxt->head && !(ctxt->state & TXT_HEAD))
  {
    ctxt->state |= TXT_HEAD;
    APR_BRIGADE_INSERT_HEAD(bb, ctxt->head);
  }

  return ap_pass_brigade(f->next, bb);
}

static const command_rec txt_cmds[] = {
    AP_INIT_TAKE1("TextHeader", ap_set_file_slot,
                  (void *)APR_OFFSETOF(txt_dir_cfg, header), OR_ALL, "Header file"),
    AP_INIT_TAKE1("TextFooter", ap_set_file_slot,
                  (void *)APR_OFFSETOF(txt_dir_cfg, footer), OR_ALL, "Footer file"),
    {NULL}
};

static void txt_hooks(apr_pool_t *p)
{
  ap_register_output_filter(txt_name, txt_filter, txt_filter_init,
                            AP_FTYPE_RESOURCE);
}

module AP_MODULE_DECLARE_DATA txt_module = {
    STANDARD20_MODULE_STUFF,
    txt_config,
    txt_merge,
    NULL,
    NULL,
    txt_cmds,
    txt_hooks
};
```





## References

- https://httpd.apache.org/docs/trunk/developer/output-filters.html
- https://docstore.mik.ua/orelly/weblinux2/apache/ch20_09.htm

- http://www.apachetutor.org/dev/#filter
- http://apache.webthing.com/mod_txt/
