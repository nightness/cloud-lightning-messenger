import React, { useState, useContext } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'
import { Picker, PickerIOS } from '@react-native-picker/picker'
//import { Picker } from 'react-native'
//import DropDownPicker from 'react-native-dropdown-picker'
//import { SimplePicker } from 'react-native-simple-picker'
import SimplePicker from 'react-native-smart-picker'
import ToggleBox from 'react-native-togglebox'

export default ({ style, data = [], selectedValue, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [selectedItem, setSelectedItem] = useState(selectedValue)
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    console.log(`Selected Item = ${selectedItem}`)

    if (Platform.OS === 'ios') {
        return (
            <ToggleBox label='test' value='testing' style={{ Height: 40 }}>
                <Picker
                    style={[Styles.picker.picker, Themes.picker[theme], style]}
                    {...restProps}
                    selectedValue={selectedItem}
                    label='Set you favorite country'
                    onValueChange={setSelectedItem}
                >
                    {
                        data.map(item => <Picker.Item label={item.label} value={item.value} key={item.value} />)
                    }
                </Picker>
            </ToggleBox>
        )
    }
    return (
        <ScrollView>
            <Picker
                style={[Styles.picker.picker, Themes.picker[theme], style]}
                {...restProps}
                selectedValue={selectedItem}
                label='Set you favorite country'
                onValueChange={setSelectedItem}
            >
                {
                    data.map(item => <Picker.Item label={item.label} value={item.value} key={item.value} />)
                }
            </Picker>
        </ScrollView>
    )
}


