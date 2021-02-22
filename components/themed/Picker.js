import React, { useState, useContext, useEffect, useRef } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'
import { Picker, PickerIOS } from '@react-native-picker/picker'
import ToggleBox from 'react-native-togglebox'

export default ({ style, data = [], selectedIndex = 0, onValueChanged, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [selectValue, setSelectedValue] = useState()
    const [selectedItem, setSelectedItem] = useState(data?.[selectedIndex])
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    useEffect(() => {
        typeof onValueChanged === 'function' && onValueChanged(data?.[selectedIndex])
    }, [data])

    useEffect(() => {
        typeof onValueChanged === 'function' && onValueChanged(selectedItem)
    }, [selectedItem])

    const PickerCommon = () =>
        <Picker
            style={[Styles.picker.picker, Themes.picker[theme], style]}
            {...restProps}
            selectedValue={selectValue}
            onValueChange={(value, index) => {
                setSelectedValue(value)
                setSelectedItem(data?.[index])
            }}
            ref={pickerRef}
        >
            {
                data.map(item => {
                    return (
                        <Picker.Item
                            style={Styles.picker.item}
                            label={item.label}
                            value={item.value}
                            key={item.value}
                        />
                    )
                })
            }
        </Picker>
    if (Platform.OS === 'ios') {
        return (
            <ScrollView bounces={false}>
                <ToggleBox label={selectedItem && selectedItem.label} style={Styles.picker.toggleBox}>
                    <PickerCommon />
                </ToggleBox>
            </ScrollView>
        )
    }
    return (
        <ScrollView bounces={false}>
            <PickerCommon />
        </ScrollView>
    )
}


