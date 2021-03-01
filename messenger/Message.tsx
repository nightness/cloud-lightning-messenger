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
    item: MessageProps
}

export default class Message extends PureComponent<Props> {
    private item: MessageProps
    private date: string
    private time: string

    constructor(props: Props) {
        super(props)
        this.item = props.item
        this.date = (this.item.postedAt
            ? this.item.postedAt.toDate()
            : new Date()
        ).toLocaleDateString()
        this.time = (this.item.postedAt
            ? this.item.postedAt.toDate()
            : new Date()
        ).toLocaleTimeString()
    }
    render() {
        return (
            <View key={this.item.id} style={{ paddingVertical: 5 }}>
                <Text fontSize={12} fontWeight="100">
                    {`${this.item.authorName} [ ${this.date} @ ${this.time} ] `}
                </Text>
                <Text fontSize={14} fontWeight="400">
                    {this.item.message}
                </Text>
            </View>
        )
    }
}
