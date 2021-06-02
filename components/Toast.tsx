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

const Message = (props) => {
    const opacity = useRef(new Animated.Value(0))
        .current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                delay: 1000
            }),
            Animated.delay(2000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
                delay: 1000
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
                            outputRange: [-80, 0],
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
            <Text>{props.message}</Text>
        </Animated.View>
    );
};

export default () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [count, setCount] = useState(0)

    const getRandomMessage = () => {
        const number = Math.trunc(Math.random() * 10000);
        return `Random message ${number} (${count})`;
    };

    const addMessage = () => {
        const message = getRandomMessage();
        setMessages([...messages, message]);
    }

    useEffect(() => {
        if (count < 5) {
            setCount(count + 1)
            addMessage()
        }
    }, [messages])

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
                {messages.map((message) => (
                    <Message
                        key={message}
                        message={message}
                        onHide={() => {
                            setMessages((messages) =>
                                messages.filter(
                                    (currentMessage) =>
                                        currentMessage !== message
                                )
                            );
                        }}
                    />
                ))}
            </View>
        </>
    );
};