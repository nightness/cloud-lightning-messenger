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

-   Since it relies on Firestore, there is no need for push notifications; instead uses local notifications watching for snapshot changes in FireStore collections.
-   Each message is in it's own document in a collection.
-   All message posting is handled using firebase functions.
-   While walls and groups are not, the data for private messages is duplicated (normal for a non-SQL database). This makes new message detection simpler.
-   Isolates critical text communications by keeping everything cloud based. Firebase / Firestore have excellent offline support as well.
-   Firestore used in this way is very affordable.
-   Can be integrated with existing authentication systems. While it does require logging in with Firebase Authentication; this process can be completely automated away with a member creation REST API. When a new member is added, the REST API will return a custom authentication token for that member.
-   [In Development] Each document should have a 'recent' (messages) field for it's messages sub-collection. This will allows a single document read to initialize the state of the entire (message) view component on the front-end.
-   [Future] Handles isSeen and seenCounts
-   [Future] Encrypted messages, this can always be done client side too.

# Firestore Database Layout

## The collection of all member
### Fields for /profiles/{memberId}

| Name        | Type   | Description            |
| ----------- | ------ | ---------------------- |
| displayName | string | The member's name      |
| photoURL    | string | The member's photo URL |

#

## Group Details
### Fields for /groups/{groupId}

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| name    | string | Name for the group                                  |
| members | array  | Contains an array memberId's                        |
| recent  | array  | Contains an array of the most recent group messages |

#

## Group and Wall Messages
### Fields for walls and groups

#### &nbsp;&nbsp;&nbsp;/groups/{groupId}/messages/{messageId}

#### &nbsp;&nbsp;&nbsp;/walls/{memberId}/messages/{messageId}

| Name           | Type        | Description                  |
| -------------- | ----------- | ---------------------------- |
| authorName     | string      | Display name                 |
| authorUid      | string      | member's ID token            |
| authorPhotoUrl | string      | member's Photo URL           |
| message        | string      | The text of the message      |
| postedAt       | timestamp   | When the message was posted  |
| location       | geolocation | Where the message was posted |
| seenCount      | number      | The number of other member's that have seen the message |

#

## Fields for private messages

### Private message are duplicated...

#### &nbsp;&nbsp;&nbsp;/messages/{ownerMemberId}/{sendingMemberId}/{messageId}

#### &nbsp;&nbsp;&nbsp;/messages/{sendingMemberId}/{ownerMemberId}/{messageId}

| Name           | Type        | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| authorName     | string      | Display name                                    |
| authorUid      | string      | member's ID token                               |
| senderPhotoUrl | string      | member's Photo URL                              |
| message        | string      | The text of the message                         |
| postedAt       | timestamp   | When the message was posted                     |
| location       | geolocation | Where the message was posted                    |
| isSeen         | boolean     | True if messages has been seen by the recipient. Default is false. |
