import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'
import { Picker, PickerIOS } from '@react-native-picker/picker'
import ToggleBox from 'react-native-togglebox'

export default ({ style, classRef, data = [], selectedValue, onValueChanged, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [selectedItem, setSelectedItem] = useState(selectedValue)
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]
    const selectedData = data ? data.find(data => data.value === selectedItem) : undefined

    useEffect(() => {
        typeof onValueChanged === 'function' && onValueChanged(selectedData)
    }, [selectedItem])

    const PickerCommon = () =>
        <Picker
            style={[Styles.picker.picker, Themes.picker[theme], style]}
            {...restProps}
            ref={classRef}
            selectedValue={selectedItem}
            onValueChange={setSelectedItem}
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
                <ToggleBox label={selectedData.label} style={Styles.picker.toggleBox}>
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


