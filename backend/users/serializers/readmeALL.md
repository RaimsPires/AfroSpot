Plan — 4 steps:

Choose identifier type (recommended: per-app API key or OAuth2 client_id+PKCE).
Have each app send its identifier with the login request.
Server validates the identifier/secret and maps it to shop or client.
Rotate/revoke keys and store secrets securely.
How it works (concise)

App identifier (client_id): public ID that identifies the app (doesn't prove identity by itself). Good for routing logic.
App secret / API key: a secret assigned to each app (or to each app-install). Sent in Authorization or X-Api-Key. Server validates it and trusts the request source. Can be static per-app or unique per-install.
JWT signing key: server-side key used to sign tokens. This is NOT the same as an API key — keep it on the server and rotate when needed. It’s shared by the server(s), not by clients.
Will the keys change?

They can be static (one key per app) or dynamic (per-install keys). Best practice:
Issue one secret per app (e.g., shop-key, client-key) for server-to-server or trusted clients.
For mobile apps prefer PKCE (no secret in the app) or issue per-install refreshable tokens.
Rotate keys periodically or when compromised; support revocation in your DB so you can revoke a key without code changes.
Security & storage

Store API keys/clients in DB with hashed value and metadata (owner, created_at, revoked_at).
Keep secrets out of client source (use Keychain/Keystore for mobile). Never hardcode a confidential key into shipped app builds.
Use HTTPS always.
Minimal DRF example (what to add server-side)

Clients send header: X-Api-Key: <key> (or Authorization: ApiKey <key>).
Server validates key and sets source = "shop" | "client".
Example snippet you can add to your login flow (illustrative only):

Recommendation

If you can: use OAuth2 with distinct client_ids and PKCE for mobile — strongest and standard.
Fast/easy: create two API keys (shop, client), require X-Api-Key, validate server-side, and rotate periodically.
Want me to:

show the exact code patch to validate X-Api-Key in email_or_phone_login_serializer.py, or
scaffold a tiny AppKey model + validation helper so keys can be created/revoked?


request = self.context.get("request")
api_key = request.headers.get("X-Api-Key") or request.data.get("api_key")
if api_key:
    app = AppKey.objects.filter(hashed_key=hash_api_key(api_key), revoked=False).first()
    if not app:
        raise serializers.ValidationError("Invalid app key", code="authorization")
    source = app.name  # 'shop' or 'client'
else:
    source = request.headers.get("X-App-Source")  # fallback (UNTRUSTED)
# then continue authenticate(...)