import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, Platform } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Theme, Themes } from '../shared/Themes'
import { Picker, PickerIOS } from '@react-native-picker/picker'
// @ts-ignore - No Types found yet
import ToggleBox from 'react-native-togglebox'

export interface PickerItem {
    label: string
    value: any
}

interface Props {
    style?: any
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
    const { theme } = useContext(GlobalContext)
    const [selectedValue, setSelectedValue] = useState()
    const [selectedItem, setSelectedItem] = useState<PickerItem>()
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    useEffect(() => {
        setSelectedItem(data?.[selectedIndex])
    }, [data])

    useEffect(() => {
        onValueChanged && onValueChanged(selectedItem)
    }, [selectedItem])

    const PickerCommon = () => (
        <Picker
            style={[Styles.picker.picker, Themes.picker[theme], style]}
            {...restProps}
            selectedValue={selectedValue}
            onValueChange={(value, index) => {
                setSelectedValue(value)
                setSelectedItem(data?.[index])
            }}
        >
            {data.map((item) => {
                return (
                    <Picker.Item label={item.label} value={item.value} key={item.value} />
                )
            })}
        </Picker>
    )

    return (
        <ScrollView bounces={false}>
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
