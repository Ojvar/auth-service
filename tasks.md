# Tasks

## Goal #1/ Login By MSAL

### Prerequisites
[x] Redis (Docker based)

### Microsoft Auth Service
[x] Installing MSAL library
[x] Creating required services and controllers
  - [x] MSAL Service
  - [x] Redis Service
  - [x] Auth Controller
    - [x] signin route
    - [x] redirect route
[x] Create sign-in route
  > To Prepare user session and request a token to authorization
[x] Create redirect route
  > To Authenticate user by auth-code and fetch a JWT token
  - [x] Check response status
  - [x] Load data from redis (by state)
  - [x] Check CSRF token
  - [x] Redirect to clientUrl by data (Redirect type 307 : preserve send method)

#### Sample Access Token
```json
{
  authority: 'https://login.microsoftonline.com/9b00d5ff-535a-423a-9d79-02778a083573/',
  uniqueId: 'b3ffbcb2-e13f-4f22-ae20-5f051db34f4b',
  tenantId: '9b00d5ff-535a-423a-9d79-02778a083573',
  scopes: [
    'openid',
    'profile',
    'email',
    'Calendars.Read',
    'Mail.Read',
    'User.Read'
  ],
  account: {
    homeAccountId: '00000000-0000-0000-c5de-57ed886e1ec5.9188040d-6c67-4c5b-b112-36a304b66dad',
    environment: 'login.windows.net',
    tenantId: '9b00d5ff-535a-423a-9d79-02778a083573',
    username: 'mojvar.amirhossein@gmail.com',
    localAccountId: 'b3ffbcb2-e13f-4f22-ae20-5f051db34f4b',
    name: 'Hossein Ojvar',
    idTokenClaims: {
      aud: 'e09d13ff-2cdb-41c8-bca1-8d8681dc33a5',
      iss: 'https://login.microsoftonline.com/9b00d5ff-535a-423a-9d79-02778a083573/v2.0',
      iat: 1671700874,
      nbf: 1671700874,
      exp: 1671704774,
      aio: 'AbQAS/8TAAAARzZlURckNTieT/srosy2BwJxhw69n6Vi4UCIxdmP69E/FzfblFU+1BnCaDzRQFIT0pQl/oiF39bzNTpEMGnr/fJxmTFfzzNHx20U/1aS+b9QD3tRPMENu9q5U0wZwJaT8V
FuLgzEJhWJbYAyc0A1s1us6Aa76RJwujnXHuVJh3HsSsPnIau65EqR+XrKaidXDSLSQiZPTnC9D0D9EqVxUguizH6/5xHHi1O0Ur8KfaE=',
      idp: 'https://sts.windows.net/9188040d-6c67-4c5b-b112-36a304b66dad/',
      name: 'Hossein Ojvar',
      oid: 'b3ffbcb2-e13f-4f22-ae20-5f051db34f4b',
      preferred_username: 'mojvar.amirhossein@gmail.com',
      prov_data: [Array],
      rh: '0.AWIA_9UAm1pTOkKdeQJ3igg1c_8TneDbLMhBvKGNhoHcM6ViAAE.',
      sub: 'vqXafM6Wz_jtlz0lFPwWMdv8ykzkRj1eJgOD2b87rx8',
      tid: '9b00d5ff-535a-423a-9d79-02778a083573',
      uti: '83pXqRJ0WkmYXABiaXktBQ',
      ver: '2.0'
    },
    nativeAccountId: undefined
  },
  idToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJlMDlkMTNmZi0yY2RiLTQxYzgtYmNhMS04ZDg2ODFkYzMzY
TUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOWIwMGQ1ZmYtNTM1YS00MjNhLTlkNzktMDI3NzhhMDgzNTczL3YyLjAiLCJpYXQiOjE2NzE3MDA4NzQsIm5iZiI6MTY3MTc
wMDg3NCwiZXhwIjoxNjcxNzA0Nzc0LCJhaW8iOiJBYlFBUy84VEFBQUFSelpsVVJja05UaWVUL3Nyb3N5MkJ3SnhodzY5bjZWaTRVQ0l4ZG1QNjlFL0Z6ZmJsRlUrMUJuQ2FEelJRRklUMHBRbC9vaUYzO
WJ6TlRwRU1HbnIvZkp4bVRGZnp6Tkh4MjBVLzFhUytiOVFEM3RSUE1FTnU5cTVVMHdad0phVDhWRnVMZ3pFSmhXSmJZQXljMEExczF1czZBYTc2Ukp3dWpuWEh1VkpoM0hzU3NQbklhdTY1RXFSK1hyS2F
pZFhEU0xTUWlaUFRuQzlEMEQ5RXFWeFVndWl6SDYvNXhISGkxTzBVcjhLZmFFPSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzkxODgwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTMwNGI2NmRhZ
C8iLCJuYW1lIjoiSG9zc2VpbiBPanZhciIsIm9pZCI6ImIzZmZiY2IyLWUxM2YtNGYyMi1hZTIwLTVmMDUxZGIzNGY0YiIsInByZWZlcnJlZF91c2VybmFtZSI6Im1vanZhci5hbWlyaG9zc2VpbkBnbWF
pbC5jb20iLCJwcm92X2RhdGEiOlt7ImF0Ijp0cnVlLCJwcm92IjoiZ2l0aHViLmNvbSIsImFsdHNlY2lkIjoiMTY3ODY5ODcifV0sInJoIjoiMC5BV0lBXzlVQW0xcFRPa0tkZVFKM2lnZzFjXzhUbmVEY
kxNaEJ2S0dOaG9IY002VmlBQUUuIiwic3ViIjoidnFYYWZNNld6X2p0bHowbEZQd1dNZHY4eWt6a1JqMWVKZ09EMmI4N3J4OCIsInRpZCI6IjliMDBkNWZmLTUzNWEtNDIzYS05ZDc5LTAyNzc4YTA4MzU
3MyIsInV0aSI6IjgzcFhxUkowV2ttWVhBQmlhWGt0QlEiLCJ2ZXIiOiIyLjAifQ.h4aMW9VwI33X-wQpFJSb-41QPAsF5wRlUJs2wTm1uZvH0QouENAiGboknMrQqzMcipr3kJlUdHaGJxMl32Od64iD--
QKyMAdFMmVyqyNtwRjbHooWwmjj6k8HfKxTXs-TCJYdas9eVZZ3pSKKSt45TWnJdVzxRemjfpxzrTpTJR7Pp2XurEIDDwN1RH7MEl5XUFUVTmtEqUmOj3CfI_fi_QS_s_Yh8642karliBnE8SRh0L8dKps
cWxhZior0UmX2uUbP1m7T03N9KUdgFtS7wXRaVWsl9xbycFTxeMCAq2n9tO2KD2LJkTFSL0Jj4vZGcCXWXxxunMDmT1bf4Kp9Q',
  idTokenClaims: {
    aud: 'e09d13ff-2cdb-41c8-bca1-8d8681dc33a5',
    iss: 'https://login.microsoftonline.com/9b00d5ff-535a-423a-9d79-02778a083573/v2.0',
    iat: 1671700874,
    nbf: 1671700874,
    exp: 1671704774,
    aio: 'AbQAS/8TAAAARzZlURckNTieT/srosy2BwJxhw69n6Vi4UCIxdmP69E/FzfblFU+1BnCaDzRQFIT0pQl/oiF39bzNTpEMGnr/fJxmTFfzzNHx20U/1aS+b9QD3tRPMENu9q5U0wZwJaT8VFu
LgzEJhWJbYAyc0A1s1us6Aa76RJwujnXHuVJh3HsSsPnIau65EqR+XrKaidXDSLSQiZPTnC9D0D9EqVxUguizH6/5xHHi1O0Ur8KfaE=',
    idp: 'https://sts.windows.net/9188040d-6c67-4c5b-b112-36a304b66dad/',
    name: 'Hossein Ojvar',
    oid: 'b3ffbcb2-e13f-4f22-ae20-5f051db34f4b',
    preferred_username: 'mojvar.amirhossein@gmail.com',
    prov_data: [ [Object] ],
    rh: '0.AWIA_9UAm1pTOkKdeQJ3igg1c_8TneDbLMhBvKGNhoHcM6ViAAE.',
    sub: 'vqXafM6Wz_jtlz0lFPwWMdv8ykzkRj1eJgOD2b87rx8',
    tid: '9b00d5ff-535a-423a-9d79-02778a083573',
    uti: '83pXqRJ0WkmYXABiaXktBQ',
    ver: '2.0'
  },
  accessToken: 'eyJ0eXAiOiJKV1QiLCJub25jZSI6InA5VXJ6NU9KZEhnUHVCTXZteDJTclRRbzlGV0NWc2lGRFBUaFI5VHpHaU0iLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG
1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy5
3aW5kb3dzLm5ldC85YjAwZDVmZi01MzVhLTQyM2EtOWQ3OS0wMjc3OGEwODM1NzMvIiwiaWF0IjoxNjcxNzAwODc0LCJuYmYiOjE2NzE3MDA4NzQsImV4cCI6MTY3MTcwNTQ3OCwiYWNjdCI6MCwiYWNyI
joiMSIsImFpbyI6IkFZUUFlLzhUQUFBQVVtcW1iOEI1ZzQxZkUvMFYvZzVONUVpWndBZ3pqMDB5OWJta0VVdzFUTUwxNTZMM1pJMVphZ0hWUzA4cWFmT2FLRjhaZzJUcmV5YUs0M0YzTnNhMDdGTGJ5SHY
zcUFxWUcwd0JKbktJOUVRZC9qR2RLQ3lDTCsrMER0UHRJMUc4cGg3eG85RXV3RTROUm1lK2UxSHplMWlTQ0FNd2RZdkVEbVJhUThyM0R5ND0iLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwM0JGRkRDM
zBDQjU5MSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiUmFkaSBUcmFja2VyIiwiYXBwaWQiOiJlMDlkMTNmZi0yY2RiLTQxYzgtYmNhMS04ZDg2ODFkYzMzYTUiLCJhcHBpZGF
jciI6IjEiLCJlbWFpbCI6Im1vanZhci5hbWlyaG9zc2VpbkBnbWFpbC5jb20iLCJmYW1pbHlfbmFtZSI6Ik9qdmFyIiwiZ2l2ZW5fbmFtZSI6Ikhvc3NlaW4iLCJpZHAiOiJsaXZlLmNvbSIsImlkdHlwI
joidXNlciIsImlwYWRkciI6IjE3OC4yNTIuMTQwLjYiLCJuYW1lIjoiSG9zc2VpbiBPanZhciIsIm9pZCI6ImIzZmZiY2IyLWUxM2YtNGYyMi1hZTIwLTVmMDUxZGIzNGY0YiIsInBsYXRmIjoiOCIsInB
1aWQiOiIxMDAzMjAwMTFEQUMxRENEIiwicmgiOiIwLkFXSUFfOVVBbTFwVE9rS2RlUUozaWdnMWN3TUFBQUFBQUFBQXdBQUFBQUFBQUFCaUFBRS4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZCBNYWlsLlJlY
WQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiM2VvdVF5cTRfRW1PdTlIcDFhM3V6SlBlNkVaNTFXQ0hoVTc4eXZIdXdrTSIsInRlbmF
udF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjliMDBkNWZmLTUzNWEtNDIzYS05ZDc5LTAyNzc4YTA4MzU3MyIsInVuaXF1ZV9uYW1lIjoibGl2ZS5jb20jbW9qdmFyLmFtaXJob3NzZWluQGdtYWlsL
mNvbSIsInV0aSI6IjgzcFhxUkowV2ttWVhBQmlhWGt0QlEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS0
4MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoidnFYYWZNNld6X2p0bHowbEZQd1dNZHY4eWt6a1JqMWVKZ09EMmI4N3J4OCJ9LCJ4bXNfdGNkdCI6MTYxNDc4NzY0NH0.iwJZQ7LO8e3FY
GBoZMBiGhw0dRIF38M1-ryiOxxiYw3jA0TM1JHgnO-bW0lut1xJuHOv65_V7gtdRPmpuFHH7xZFJjlLgV4IVkTfXzgVgEZe9xpBUGYK2OaQNr9jAKDc0uZsbwuQw3T-5ccBwlodoY38PLf64l7EVKhPaab
O8fTaluKonA45Q7jYLQguFJ8pd_jhIltn8lzTu57Jr2ZfTnaJnB84TZoO0fmewdzgfZuJcFUy0P5AXX2IyR6Y8UBa7f7_wWY0Qu0rLxLTbYeUff3QE0Oggg5d3qPybZfaCwen_5S_UrEGc_bfFP5_NVgPP
2oLAWXxQXZG6OhV7URz7g',
  fromCache: false,
  expiresOn: 2022-12-22T10:37:57.000Z,
  correlationId: '951bda82-6150-40d2-ba7d-61daa45c2e59',
  requestId: 'a9577af3-7412-495a-985c-006269792d05',
  extExpiresOn: 2022-12-22T11:49:40.000Z,
  familyId: '',
  tokenType: 'Bearer',
  state: '',
  cloudGraphHostName: '',
  msGraphHost: '',
  code: undefined,
  fromNativeBroker: false
} 
```
