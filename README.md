# Serverless JWT Auth Boilerplate by Daniel Abib

A [Serverless](https://serverless.com/) REST API boilerplate for authenticating with email/password over JWT (JSON Web Tokens) using
AWS DynamoDB and DynamoDB local as database

---

# 0. Installation

```bash
# Install the Serverless CLI
npm install serverless (maybe sudo is required)

# Clone the repo
git clone https://github.com/dcabib/serverless-jwt-auth serverless-jwt-auth

# Install dependencies
cd serverless-jwt-auth && npm install

# Install dynamodb local
sls dynamodb install

# Edit (if needed) your environment variables (and update the JWT secret)
(optional) env.prod.yml
```

## Required softwares:

- NodeJS (version 10 or newer)
- Java runtime (for dynamoDB local server)

## Recommended software

- Visual Studio Code (IDE for develpment)
- Postman
- Google Chrome

---

# 1. Usage

### 1.1 Development

You can use Serverless Offline while you develop, which starts a local DynamoDB instance (data is reset on each start)

```bash
npm start

# OR to use env.staging.yml environment variables:
# npm start --STAGE staging
```

Expected Result: (BE SURE that DynamoDB local is installed and running)

```bash
Dynamodb Local Started, Visit: http://localhost:8000/shell
Serverless: DynamoDB - created table serverless-jwt-auth-test-users
Seed running complete for table: serverless-jwt-auth-test-users
Serverless: Starting Offline: undefined/undefined.

Serverless: Routes for verify-token:
Serverless: (none)

Serverless: Routes for login:
Serverless: POST /login

Serverless: Routes for register:
Serverless: POST /register

Serverless: Routes for user:
Serverless: GET /user
Serverless: Configuring Authorization: user verify-token

Serverless: Routes for userUpdate:
Serverless: PUT /user
Serverless: Configuring Authorization: user verify-token

Serverless: Offline listening on http://localhost:3000
```

# 2. Running Unit Tests

```bash
npm run test (or npm test)
```

Expected Result:

```bash
 PASS  tests/Helpers/Users.test.js
  JWT Tokens
    ✓ should generate token + when decoded, should be equal to input User ID (6 ms)
  User lookup by email
    ✓ should load correct user (1 ms)
    ✓ should return null when not found in DB (1 ms)
  User lookup by ID
    ✓ should load correct user (1 ms)
    ✓ should throw an error when not found in DB (3 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.009 s
```

# 3. Running local tests

PRE-REQUISIT: To be able to test locally, be sure that serverless offline and dynamodb local is running as described in step  1.1 Developement

```bash
npm start (if it is no already running) 
```
Run in another terminal (or using your favorite HTTP Client - Postman for example) the following commands:

##  3.1. Upload a challenger video

```json
Request: POST /videos
JSON data
{
"challengeId": STRING,
"userId": INTEGER,
}
```



## Response
```json
{
    "success": true,
    "video": {
        "challengeId": "jnkkjjf",
        "userId": "hjuhu",
        "takeOn": "2020-10-10T16:00:08.945Z",
        "video": "www.hhh.com",
        "description": "teukoo",
        "createdAt": 1602345608
    }
}
```

## 3.2. Get a challenger info

```json
 Request: GET /videos/{challengeId}/{userId}


```



## Response
```json
{
    "success": true,
    "video": {
        "createdAt": 1602345608,
        "challengeId": "jnkkjjf",
        "description": "teukoo",
        "video": "www.hhh.com",
        "takeOn": "2020-10-10T16:00:08.945Z",
        "userId": "hjuhu"
    }
}
```

## 3.3. Update User info

```json
 Request: PUT /videos/{challengeId}/{userId}

{
    "video": "www.hhh.com",
    "description": "teukoo is good"
}



```



## Response
```json
{
    "success": true,
    "video": {
        "video": "www.hhh.com",
        "description": "teukoo is good",
        "updatedAt": 1602347606
    }
}
```


## 3.4. Delete User Information

```json
 Request: DELETE /videos/{challengeId}/{userId}


```



## Response

```json
{
    "success": true,
    "message": "Video deleted successfully"
}

```

# 3.5. Get all video by challenge

```json
  Request: GET /allVideos/{challengeId}



```

# 3.6. Get all video of a user 

```json
  Request: GET /allUserVideos/{userId}


```

# 4. Production

__1. Setup your AWS credentials__

_Create a new AWS IAM user and assign the `AdministratorAccess` policy to the new user (later, it's best to reduce the permissions this IAM User has for security reasons)._

```bash
serverless config credentials --provider aws --key <YOUR_AWS_KEY> --secret <YOUR_AWS_SECRET>
```

__2. Then deploy to AWS__

```bash
sls deploy

# OR to use env.dev.yml environment variables:
# sls deploy --STAGE dev
```

# 5. Debugging

## 5.1. DynamoDB Local Shell / Web tool

You can use your browser to query dynamoDB local database. After running npm star (sls offline start --migrate), use this URL to check database information 

http://localhost:8000/shell/



---

