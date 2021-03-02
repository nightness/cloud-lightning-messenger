// These are the TypeScript types for the data structures in used Firestore

export interface UserProfile {
    displayName?: string
}

export interface GroupDocument {
    members?: []
}

export interface UserClaims {
    admin: boolean
    manager: boolean
    moderator: boolean
}
