<!-- Comment -->

# Setup

```
npm i -g expo-cli firebase-cli
expo install
```

# Startup

```
expo start
```

# Firebase text messenging service

- Since it relies on Firestore, there is no need for push notifications; instead uses local notifications watching for snapshot changes.
- Can be integrated with existing authentication systems. While it does require logging in with Firebase Authentication, this process can be completely automated away with a user creation REST API. When a new user is added, the REST API will return a custom authentication token for that user.

# Firestore Database Layout

## Fields for /messenger/{messengerId}

| Name   | Type  | Description                                                                                        |
| ------ | ----- | -------------------------------------------------------------------------------------------------- |
| recent | array | Contains the most recent messages. Objects in the array follow the same structure as in 'history/' |

Single document read pulls all recent messages, individual message documents are only queried when scrolling back in history.

## Fields for /messenger/{messengerId}/messages/{messageId}

| Name         | Type        | Description                    |
| ------------ | ----------- | ------------------------------ |
| authorName   | string      | Display name                   |
| authorUserId | string      | User's ID token                |
| message      | string      | The text of the message        |
| postedAt     | timestamp   | When the message was posted    |
| location     | geolocation | Where the message was posted   |
| isSeen       | boolean     | True if messages has been seen |

## Driver Fields for /users/{userId}

| Name        | Type   | Description                        |
| ----------- | ------ | ---------------------------------- |
| displayName | string | The user's name                    |
| districtId  | string | The district the driver belongs to |

## Dispatcher Fields for /users/{userId}

| Name        | Type               | Description                               |
| ----------- | ------------------ | ----------------------------------------- |
| displayName | string             | The user's name                           |
| districtIds | array (of strings) | The district ID's the dispatcher monitors |
| claims      | map (object)       | { "dispatcher": true } (REQUIRED)         |

# Authentication

In order to have access to the Firestore database, users need to authenticate with Firebase. Instead of having them sign-in manually; there is a REST API to manage user creation. When a user is created with the REST API, it returns a custom authentication token, that is sent to the user so client can automatically authenticate with Firebase.

If you have the vscode extension 'REST client' you can use the files in the 'rest/' folder to test out that API. (Not in repository)

https://us-central1-cloud-lightning.cloudfunctions.net/users
