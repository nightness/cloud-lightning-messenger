<!-- Comment -->

# Live Site

https://cloud-lightning.web.app/

# Setup

```
npm i -g expo-cli firebase-tools
npm install
```

# Startup

```
expo start
```

# Firebase text messenging service

-   Since it relies on Firestore, there is no need for push notifications; instead uses local notifications watching for snapshot changes.
-   Can be integrated with existing authentication systems. While it does require logging in with Firebase Authentication, this process can be completely automated away with a member creation REST API. When a new member is added, the REST API will return a custom authentication token for that member.

# Firestore Database Layout

## Fields for /profiles/{memberId}

| Name        | Type   | Description       |
| ----------- | ------ | ----------------- |
| displayName | string | The member's name |

#

## Fields for /groups/{groupId}

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| name    | string | Name for the group                                  |
| members | array  | Contains an array memberId's                        |
| recent  | array  | Contains an array of the most recent group messages |

#

## Fields for walls and groups

### /groups/{groupId}/messages/{messageId}

### /walls/{memberId}/messages/{messageId}

| Name           | Type        | Description                  |
| -------------- | ----------- | ---------------------------- |
| authorName     | string      | Display name                 |
| authorUid      | string      | member's ID token            |
| authorPhotoUrl | string      | member's Photo URL           |
| message        | string      | The text of the message      |
| postedAt       | timestamp   | When the message was posted  |
| location       | geolocation | Where the message was posted |

#

## Fields for private messages

### Private message are duplicated...

### /messages/{ownerMemberId}/{sendingMemberId}/{messageId}

### /messages/{sendingMemberId}/{ownerMemberId}/{messageId}

| Name           | Type        | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| authorName     | string      | Display name                                    |
| authorUid      | string      | member's ID token                               |
| senderPhotoUrl | string      | member's Photo URL                              |
| message        | string      | The text of the message                         |
| postedAt       | timestamp   | When the message was posted                     |
| location       | geolocation | Where the message was posted                    |
| isSeen         | boolean     | True if messages has been seen by the recipient |
