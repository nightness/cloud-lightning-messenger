import React, { PureComponent } from 'react'
import { Text, View } from '../components/Components'
import { Timestamp } from '../firebase/Firebase'

interface MessageProps {
    authorName: string
    authorPhotoUrl?: string
    id: string
    message: string
    postedAt: Timestamp
}

interface Props {
    message: MessageProps
}

export default class Message extends PureComponent {
    private message: MessageProps
    private date: string
    private time: string

    constructor(props: Props) {
        super(props)
        this.message = props.message
        this.date = (this.message.postedAt
            ? this.message.postedAt.toDate()
            : new Date()
        ).toLocaleDateString()
        this.time = (this.message.postedAt
            ? this.message.postedAt.toDate()
            : new Date()
        ).toLocaleTimeString()
    }
    render() {
        return (
            <View key={this.message.id} style={{ paddingVertical: 5 }}>
                <Text fontSize={12} fontWeight="100">
                    {`${this.message.authorName} [ ${this.date} @ ${this.time} ] `}
                </Text>
                <Text fontSize={14} fontWeight="400">
                    {this.message.message}
                </Text>
            </View>
        )
    }
}
