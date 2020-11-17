import React from 'react'
import { Form as AntForm } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { FormProps, FormItemProps } from '../interface'
import './style/index.less'

export const Form = (props: FormProps) => {
    const { cols = 5, form: propsForm, children, ...restProps } = props
    const [form] = useForm()
    if (propsForm) {
        propsForm.current = form
    }

    return (
        <AntForm
            {...restProps}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, auto)`,
                columnGap: 4,
            }}
            form={form}
        >
            {children}
        </AntForm>
    )
}

const Item = (props: FormItemProps) => {
    const { colSpan, rowSpan, style, br, labelWidth, ...restProps } = props

    const cleanMarginBottom: React.CSSProperties = {}
    if (!props.name && !props.label) {
        cleanMarginBottom.marginBottom = 0
    }
    const colSpanTemp = colSpan === undefined ? 'auto' : colSpan
    const rowSpanTemp = rowSpan === undefined ? 'auto' : rowSpan
    let gridColumn;
    if (colSpan) gridColumn = `auto / span ${colSpanTemp}`
    if (br) gridColumn = '1/ auto'
    if (colSpan && br) gridColumn = `1/ span ${colSpanTemp}`

    return (
        <AntForm.Item
            style={{
                ...cleanMarginBottom,
                ...style,
                gridColumn,
                gridRow: `auto / span ${rowSpanTemp}`,
                '--label-width': labelWidth && `${labelWidth}`
            } as unknown as React.CSSProperties}
            {...restProps}
        />
    )
}
Form.Item = Item
