# Redis Backup Strategy

## Upstash Built-in Features

1. **Daily Backups** — Enable in Upstash Console → Database → Settings → Daily Backup
2. **Multi-Zone Replication** — Available on paid plans for automatic failover
3. **Export** — Manual JSON export via Upstash Console → Database → Data Browser → Export

## Key Data Stored

| Key Pattern | Data | Priority |
|---|---|---|
| `subscribers:*` | Newsletter subscriber emails + preferences | High |
| `newsletter:*` | Newsletter content + metadata | Medium |
| `bounced:*` | Bounced email addresses | Low |
| `unsub-reasons:*` | Unsubscribe feedback | Low |

## Recovery

If data is lost, subscribers can re-subscribe. Newsletter content exists in the admin panel and can be re-created. Enable Upstash daily backups to minimize risk.
