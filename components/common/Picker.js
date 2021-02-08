import React, { useState, useContext } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../Constants'
import { Picker, PickerIOS } from '@react-native-picker/picker'
import ToggleBox from 'react-native-togglebox'

export default ({ style, data = [], selectedValue, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [selectedItem, setSelectedItem] = useState(selectedValue)
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]
    const selectedData = data ? data.find(data => data.value === selectedItem) : undefined

    const PickerCommon = () => <Picker
        style={[Styles.picker.picker, Themes.picker[theme], style]}
        {...restProps}
        selectedValue={selectedItem}
        onValueChange={setSelectedItem}
    >
        {
            data.map(item =>
                <Picker.Item
                    style={Styles.picker.item}
                    label={item.label}
                    value={item.value}
                    key={item.value}
                />)
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


