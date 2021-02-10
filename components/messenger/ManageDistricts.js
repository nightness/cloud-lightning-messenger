import React, { useState, useContext } from 'react'
import { FlatList } from 'react-native'
import { Text, View, Button, Container, Screen } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'


// Just started

export default ({ navigation, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    return (
        <Screen navigation={navigation} title={"Manage Districts"} hasBurger={true} hasLogout={true}>
            <Container>
                <View style={[Styles.views.flatListView, Themes.defaultView[theme]]}>
                    <FlatList
                        {...restProps}
                        removeClippedSubviews={true}
                        contentContainerStyle={Styles.views.flatlist}
                    // data={messages}
                    // onLayout={onLayout}
                    // onContentSizeChange={onContentSizeChange}
                    // onScroll={onScroll}
                    />
                </View>
                <View style={Styles.views.flexRowJustifyCenter}>
                    <Button
                        title='Add'
                    />
                    <Button
                        title='Remove'
                    />
                </View>
            </Container>
        </Screen>
    )
}
