# DNS Record types

 **Commonly used record types**

- A  (ipv4 address, map hostname to addresses)
- AAAA (ipv6 address, map hostname to addresses)
- ALIAS (auto resolved alias)
- CNAME (Canonical name for an alias,  Forwards one domain or subdomain to another domain, does NOT provide an IP address. )
- MX (Mail eXchange, Directs mail to an email server)
- SRV (location of Service, Specifies a port for specific services.)
- TXT (Descriptive text, Lets an admin store text notes in the record)
  - such as spf: `"v=spf1 redirect=_spf.google.com"`
- NS (Name Server, tores the name server for a DNS entry)
- SOA (Start Of Authority, Stores admin information about a domain)
- PTR (Pointer, map address to hostnames)



## ALIAS and CNAME

The primary difference between a CNAME record and an ALIAS record is not in the result—both record types point to another DNS record—but in *how* they resolve the target DNS record when queried. In short, one is safe to use at the zone apex (ex. naked domain, such as example.com) and the other is not. 

### Resolve Process

- CNAME
  - You (as the DNS client or stub resolver) query your recursive resolver for www.example.com.
  - Your recursive resolver queries the root name server for www.example.com.
  - The root name server refers your recursive resolver to the .com *Top-Level Domain (TLD)* authoritative server.
  - Your recursive resolver queries the .com TLD authoritative server for www.example.com.
  - The .com TLD authoritative server refers your recursive server to the authoritative servers for example.com.
  - Your recursive resolver queries the authoritative servers for www.example.com, and receives lb.example.net as the answer.
  - Your recursive resolver caches the answer, and returns it to you. 
  - You now issue a second query to your recursive resolver for lb.example.net.
  - Your recursive resolver queries the root name server for lb.example.net.
  - The root name server refers your recursive resolver to the .net Top-Level Domain (TLD) authoritative server.
  - Your recursive resolver queries the .net TLD authoritative server for lb.example.net.
  - The .net TLD authoritative server refers your recursive server to the authoritative servers for example.net.
  - Your recursive resolver queries the authoritative servers for lb.example.net, and receives an IP address as the answer.
  - Your recursive resolver caches the answer, and returns it to you.
- ALIAS
  -  Authoritative server handle the query internally (step1 to step 13), then return the final answer to your resolver.

### Pros and Cons

**Pros:**

- **Decreased time to final answer resolution.**
- **Answer looks like an A record.**

**Cons**:

- **Geo-targeting information is lost.**
  - Authoritative server as your full-agent.



## MX and SRV

- MX
  - A **mail exchanger record** (**MX record**) specifies the [mail server](https://en.wikipedia.org/wiki/Mail_server) responsible for accepting [email](https://en.wikipedia.org/wiki/Email) messages on behalf of a domain name. It is a [resource record](https://en.wikipedia.org/wiki/Resource_record) in the [Domain Name System](https://en.wikipedia.org/wiki/Domain_Name_System) (DNS). It is possible to configure several MX records, typically pointing to an array of mail servers for load balancing and redundancy.
- SRV
  - 



MX format:

```
priority-weight target.
```

```
pang@ubuntu:~/Desktop$ dig gmail.com mx

; <<>> DiG 9.16.1-Ubuntu <<>> gmail.com mx
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 21613
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;gmail.com.			IN	MX

;; ANSWER SECTION:
gmail.com.		5	IN	MX	20 alt2.gmail-smtp-in.l.google.com.
gmail.com.		5	IN	MX	40 alt4.gmail-smtp-in.l.google.com.
gmail.com.		5	IN	MX	10 alt1.gmail-smtp-in.l.google.com.
gmail.com.		5	IN	MX	5 gmail-smtp-in.l.google.com.
gmail.com.		5	IN	MX	30 alt3.gmail-smtp-in.l.google.com.

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Sat Aug 28 19:35:37 PDT 2021
;; MSG SIZE  rcvd: 161
```



SRV format:

```
_service._proto.name. ttl IN SRV priority-weight port target.
```

```
pang@ubuntu:~/Desktop$ dig _sip._udp.sip.voice.google.com SRV

; <<>> DiG 9.16.1-Ubuntu <<>> _sip._udp.sip.voice.google.com SRV
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12538
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;_sip._udp.sip.voice.google.com.	IN	SRV

;; ANSWER SECTION:
_sip._udp.sip.voice.google.com.	5 IN	SRV	10 1 5060 sip-anycast-1.voice.google.com.
_sip._udp.sip.voice.google.com.	5 IN	SRV	20 1 5060 sip-anycast-2.voice.google.com.

;; Query time: 60 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Sat Aug 28 19:33:10 PDT 2021
;; MSG SIZE  rcvd: 159
```



## NS

example:

```
pang@ubuntu:~/Desktop$ dig gmail.com ns

; <<>> DiG 9.16.1-Ubuntu <<>> gmail.com ns
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 15687
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;gmail.com.			IN	NS

;; ANSWER SECTION:
gmail.com.		5	IN	NS	ns3.google.com.
gmail.com.		5	IN	NS	ns2.google.com.
gmail.com.		5	IN	NS	ns1.google.com.
gmail.com.		5	IN	NS	ns4.google.com.

;; Query time: 40 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Sat Aug 28 19:42:56 PDT 2021
;; MSG SIZE  rcvd: 117

```





## References

- https://www.cloudflare.com/learning/dns/dns-records/

- https://help.ns1.com/hc/en-us/articles/360017511293-What-is-the-difference-between-CNAME-and-ALIAS-records-
- https://www.onsip.com/voip-resources/voip-fundamentals/dns-srv-records-sip