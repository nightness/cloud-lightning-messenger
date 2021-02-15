<!-- Comment -->

# Setup

```
npm i -g expo-cli firebase-cli
npm install
```

# Startup

```
expo start
```

# Firebase text messenging service

- Since it relies on Firestore, there is no need for push notifications; instead uses local notifications watching for snapshot changes.
- Can be integrated with existing authentication systems. While it does require logging in with Firebase Authentication, this process can be completely automated away with a member creation REST API. When a new member is added, the REST API will return a custom authentication token for that member.

# Firestore Database Layout

## Fields for /members/{memberId}

| Name        | Type         | Description                                   |
| ----------- | ------------ | --------------------------------------------- |
| displayName | string       | The member's name                             |
| claims      | map (object) | { "dispatcher": true } (REQUIRED)             |
| recent      | array        | Contains an array of the most recent messages |

## Fields for /members/{memberId}/messages/{messageId}

| Name       | Type        | Description                                     |
| ---------- | ----------- | ----------------------------------------------- |
| authorName | string      | Display name                                    |
| authorId   | string      | member's ID token                               |
| message    | string      | The text of the message                         |
| postedAt   | timestamp   | When the message was posted                     |
| location   | geolocation | Where the message was posted                    |
| isSeen     | boolean     | True if messages has been seen by the recipient |

# Authentication

In order to have access to the Firestore database, members need to authenticate with Firebase. Instead of having them sign-in manually; there is a REST API to manage member creation. When a member is created with the REST API, it returns a custom authentication token, that is sent to the member so the client can automatically authenticate with Firebase.

If you have the vscode extension 'REST client' you can use the files in the 'rest/' folder to test out that API. (Not in repository)

https://us-central1-cloud-lightning.cloudfunctions.net/members
