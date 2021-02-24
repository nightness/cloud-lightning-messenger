import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'
import { Picker, PickerIOS } from '@react-native-picker/picker'
import ToggleBox from 'react-native-togglebox'

export default ({ style, data = [], selectedIndex = 0, onValueChanged, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [selectedValue, setSelectedValue] = useState()
    const [selectedItem, setSelectedItem] = useState()
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    useEffect(() => {
        setSelectedItem(data?.[selectedIndex])
    }, [data])

    useEffect(() => {
        typeof onValueChanged === 'function' && onValueChanged(selectedItem)
    }, [selectedItem])

    const PickerCommon = () =>
        <Picker
            style={[Styles.picker.picker, Themes.picker[theme], style]}
            {...restProps}
            selectedValue={selectedValue}
            onValueChange={(value, index) => {
                setSelectedValue(value)
                setSelectedItem(data?.[index])
            }}
        >
            {
                data.map(item => {
                    return (
                        <Picker.Item
                            style={Styles.picker.item}
                            label={item?.label || item}
                            value={item?.value}
                            key={item?.value || item}
                        />
                    )
                })
            }
        </Picker>

    return (
        <ScrollView bounces={false}>
            {(Platform.OS === 'ios') &&
                <ToggleBox
                    label={
                        (selectedItem && selectedItem.label) ? selectedItem.label :
                            selectedItem ? selectedItem : ''
                    }
                    style={Styles.picker.toggleBox}>
                    <PickerCommon />
                </ToggleBox>
            }
            {(Platform.OS !== 'ios') &&
                <PickerCommon />
            }
        </ScrollView>
    )
}



