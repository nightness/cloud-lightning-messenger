import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Animated,
    Button,
    Text,
    View,
} from 'react-native';

interface MessageInfo {
    message: string
    title: string
}

interface MessageProps extends MessageInfo {
    onHide: () => void
}

const Message = (props: MessageProps) => {
    const opacity = useRef(new Animated.Value(0))
        .current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.delay(5000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            props.onHide();
        });
    }, []);

    return (
        <Animated.View
            style={{
                opacity,
                transform: [
                    {
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [80, 0],
                        }),
                    },
                ],
                margin: 10,
                marginBottom: 5,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 4,
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 6,
            }}
        >
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{props.title}</Text>
            <Text>{props.message}</Text>
        </Animated.View>
    );
};

interface Props {
    messages: string[]
    setMessages: React.Dispatch<React.SetStateAction<string[]>>
}

export default ({ messages, setMessages }: Props) => {

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    bottom: 45,
                    left: 0,
                    right: 0,
                }}
            >
                {/* {messages.slice(0).reverse().map((message) => ( */}
                {messages.slice(0).reverse().map((result) => {
                    const [title, message] = result.split('`')
                    return (
                        <Message
                            key={result}
                            message={message}
                            title={title}
                            onHide={() => {
                                setMessages((messages) =>
                                    messages.filter(
                                        (currentMessage) =>
                                            currentMessage !== result
                                    )
                                );
                            }}
                        />
                    )
                })}
            </View>
        </>
    );
};