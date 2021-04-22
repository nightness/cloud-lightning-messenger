import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, Platform, StyleProp, TextStyle } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'
import { Styles } from '../app/Styles'
import { Picker, PickerIOS } from '@react-native-picker/picker'
// @ts-ignore - No Types found yet
import ToggleBox from 'react-native-togglebox'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'
import { ThemeContext } from 'cloud-lightning-themed-ui'

export interface PickerItem {
    label: string
    value: any
}

interface Props {
    style?: StyleProp<TextStyle>
    data?: PickerItem[]
    selectedIndex?: number
    onValueChanged?: (item?: PickerItem) => void
}

export default ({
    style,
    data = [],
    selectedIndex = 0,
    onValueChanged,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const [selectedValue, setSelectedValue] = useState<ItemValue>()
    const [selectedItem, setSelectedItem] = useState<PickerItem>()
    const themedStyles = getThemedComponentStyle('Picker')[activeTheme]
        // enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    useEffect(() => {
        setSelectedItem(data?.[selectedIndex])
    }, [data])

    useEffect(() => {
        onValueChanged && onValueChanged(selectedItem)
    }, [selectedItem])

    const PickerCommon = () => (
        <Picker
            style={[Styles.picker.picker, themedStyles, style]}
            ///itemStyle={[Styles.picker.pickerItem, Themes.pickerItem[theme], style]}            
            {...restProps}
            selectedValue={selectedValue}
            onValueChange={(value, index) => {
                setSelectedValue(value)
                setSelectedItem(data?.[index])
            }}
        >
            {data.map((item) => {
                return (
                    <Picker.Item
                        color={themedStyles.color}
                        label={item.label} value={item.value} key={item.value}
                    />
                )
            })}
        </Picker>
    )

    return (
        <ScrollView style={[Styles.container.scrollView, themedStyles]} bounces={false}>
            {Platform.OS === 'ios' && (
                <ToggleBox
                    label={
                        selectedItem && selectedItem.label
                            ? selectedItem.label
                            : selectedItem
                            ? selectedItem
                            : ''
                    }
                    style={Styles.picker.toggleBox}
                >
                    <PickerCommon />
                </ToggleBox>
            )}
            {Platform.OS !== 'ios' && <PickerCommon />}
        </ScrollView>
    )
}
